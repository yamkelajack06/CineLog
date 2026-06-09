import { useState, useEffect, useCallback } from "react";

const API_BASE_URL = "http://localhost:8000";

export interface WatchlistEntry {
    id: string;
    user_id: string;
    tmdb_id: number;
    status: "want_to_watch" | "watched";
    title: string;
    poster_url: string | null;
    release_year: number | null;
    type: "movie" | "show";
    overview: string | null;
    created_at: string;
    updated_at: string;
}

export interface WatchLog {
    id: string;
    user_id: string;
    tmdb_id: number;
    date_watched: string;
    title: string;
    poster_url: string | null;
    release_year: number | null;
    type: "movie" | "show";
    created_at: string;
}

export function useWatchlist(userId: string | null) {
    const [watchlist, setWatchlist] = useState<WatchlistEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // fetch the full watchlist for the user
    const fetchWatchlist = useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/watchlist/${userId}`);
            const data = await response.json();

            if (data.status === "error") {
                setError(data.message);
            } else {
                setWatchlist(data.data ?? []);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load watchlist");
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchWatchlist();
    }, [fetchWatchlist]);

    // add an item to the watchlist
    const addToWatchlist = async (item: {
        tmdb_id: number;
        title: string;
        poster_url: string | null;
        release_year: number | null;
        overview: string | null;
        media_type: string;
    }) => {
        if (!userId) return false;

        try {
            const response = await fetch(`${API_BASE_URL}/watchlist/${userId}/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...item, status: "want_to_watch" })
            });
            const data = await response.json();

            if (data.status === "success") {
                await fetchWatchlist();
                return true;
            }
            return false;
        } catch {
            return false;
        }
    };

    // remove an item from the watchlist
    const removeFromWatchlist = async (tmdbId: number) => {
        if (!userId) return false;

        try {
            const response = await fetch(`${API_BASE_URL}/watchlist/${userId}/remove/${tmdbId}`, {
                method: "DELETE"
            });
            const data = await response.json();

            if (data.status === "success") {
                setWatchlist((prev) => prev.filter((e) => e.tmdb_id !== tmdbId));
                return true;
            }
            return false;
        } catch {
            return false;
        }
    };

    // update a watchlist entry status
    const updateStatus = async (tmdbId: number, status: "want_to_watch" | "watched") => {
        if (!userId) return false;

        try {
            const response = await fetch(`${API_BASE_URL}/watchlist/${userId}/update/${tmdbId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            });
            const data = await response.json();

            if (data.status === "success") {
                setWatchlist((prev) =>
                    prev.map((e) => e.tmdb_id === tmdbId ? { ...e, status } : e)
                );
                return true;
            }
            return false;
        } catch {
            return false;
        }
    };

    // check if an item is already in the watchlist
    const isInWatchlist = (tmdbId: number) => {
        return watchlist.some((e) => e.tmdb_id === tmdbId);
    };

    // get the status of a specific entry
    const getEntryStatus = (tmdbId: number) => {
        return watchlist.find((e) => e.tmdb_id === tmdbId)?.status ?? null;
    };

    return {
        watchlist,
        loading,
        error,
        fetchWatchlist,
        addToWatchlist,
        removeFromWatchlist,
        updateStatus,
        isInWatchlist,
        getEntryStatus
    };
}

export function useWatchLogs(userId: string | null) {
    const [logs, setLogs] = useState<WatchLog[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // fetch all watch logs for the user
    const fetchLogs = useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/watchlist/${userId}/logs`);
            const data = await response.json();

            if (data.status === "error") {
                setError(data.message);
            } else {
                setLogs(data.data ?? []);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load watch logs");
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    // log a watch for a tmdb item
    const logWatch = async (tmdbId: number, dateWatched?: string) => {
        if (!userId) return false;

        try {
            const response = await fetch(`${API_BASE_URL}/watchlist/${userId}/log`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tmdb_id: tmdbId, date_watched: dateWatched ?? null })
            });
            const data = await response.json();

            if (data.status === "success") {
                await fetchLogs();
                return true;
            }
            return false;
        } catch {
            return false;
        }
    };

    // delete a watch log entry
    const deleteLog = async (logId: string) => {
        if (!userId) return false;

        try {
            const response = await fetch(`${API_BASE_URL}/watchlist/${userId}/logs/${logId}`, {
                method: "DELETE"
            });
            const data = await response.json();

            if (data.status === "success") {
                setLogs((prev) => prev.filter((l) => l.id !== logId));
                return true;
            }
            return false;
        } catch {
            return false;
        }
    };

    return { logs, loading, error, fetchLogs, logWatch, deleteLog };
}