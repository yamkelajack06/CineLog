import { useState, useEffect, useRef } from "react";
import type { FeedItem } from "./useFeed";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export function useSearch() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<FeedItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // debounce timer ref
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        // clear results if query is empty
        if (!query.trim()) {
            setResults([]);
            setError(null);
            return;
        }

        // debounce search by 400ms to avoid hammering the api
        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(
                    `${API_BASE_URL}/movies/search?query=${encodeURIComponent(query.trim())}`
                );
                const data = await response.json();

                if (data.status === "error") {
                    setError(data.message);
                    setResults([]);
                } else {
                    // filter out results with no poster or title
                    const items: FeedItem[] = (data.data?.results ?? []).filter(
                        (item: FeedItem) => item.title && item.poster_path
                    );
                    setResults(items);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Search failed");
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 400);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [query]);

    const clear = () => {
        setQuery("");
        setResults([]);
        setError(null);
    };

    return { query, setQuery, results, loading, error, clear };
}