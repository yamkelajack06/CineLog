import { useState, useEffect } from "react";

const API_BASE_URL = "http://127.0.0.1:8000";
export interface DashboardStats {
    total_watched: number;
    movies_watched: number;
    tv_watched: number;
    watchlist_size: number;
    watch_streak: number;
    average_rating: number | null;
    total_reviews: number | null;
}

export interface RecentActivityItem {
    id: string;
    tmdb_id: number;
    date_watched: string;
    title: string;
    poster_url: string | null;
    release_year: number | null;
    type: "movie" | "tv";
    overview: string | null;
}

export interface GenreBreakdownItem {
    genre: string;
    count: number;
}

export interface WatchlistSummary {
    want_to_watch: number;
    watched: number;
    total: number;
}

export interface ActivityHeatmapEntry {
    date: string;
    count: number;
}

export interface DashboardData {
    stats: DashboardStats;
    recent_activity: RecentActivityItem[];
    genre_breakdown: GenreBreakdownItem[];
    watchlist_summary: WatchlistSummary;
    activity_heatmap: ActivityHeatmapEntry[];
}

export function useStats(userId: string | null) {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) return;

        async function fetchDashboard() {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`${API_BASE_URL}/dashboard/${userId}`);
                const json = await response.json();

                if (json.status === "error") {
                    setError(json.message);
                } else {
                    setData(json.data);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load dashboard");
            } finally {
                setLoading(false);
            }
        }

        fetchDashboard();
    }, [userId]);

    return { data, loading, error };
}