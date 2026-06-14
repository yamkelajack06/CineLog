import { useState, useEffect } from "react";

const API_BASE_URL = "http://127.0.0.1:8000";


export interface FeedItem {
    id: number;
    title: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    vote_average: number;
    release_date: string;
    media_type: string;
    genre_ids: number[];
}

export interface Feed {
    trending: FeedItem[];
    popular: FeedItem[];
    top_rated: FeedItem[];
    upcoming: FeedItem[];
    trending_this_week: FeedItem[];
}

export function useFeed() {
    const [feed, setFeed] = useState<Feed | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // fetch all feed categories from the api
        async function fetchFeed() {
            try {
                const response = await fetch(`${API_BASE_URL}/movies/feed`);
                const data = await response.json();
                if (data.status === "error") {
                    setError(data.message);
                } else {
                    setFeed(data.data);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load feed");
            } finally {
                setLoading(false);
            }
        }

        fetchFeed();
    }, []);

    return { feed, loading, error };
}