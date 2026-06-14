import { useState, useEffect } from "react";

const API_BASE_URL = "http://127.0.0.1:8000";

export interface CastMember {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
    order: number;
}

export interface CrewMember {
    id: number;
    name: string;
    job: string;
}

export interface Trailer {
    key: string;
    name: string;
}

export interface MovieDetails {
    id: number;
    title: string;
    tagline: string | null;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    vote_average: number;
    vote_count: number;
    release_date: string;
    runtime: number | null;
    genres: string[];
    status: string;
    original_language: string;
    trailer: Trailer | null;
    cast: CastMember[];
    directors: CrewMember[];
    images: {
        backdrops: string[];
        posters: string[];
    };
}

export function useMovieDetails(id: number, mediaType: string = "movie") {
    const [details, setDetails] = useState<MovieDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        setDetails(null);
        setError(null);

        // fetch movie or tv details based on media type
        async function fetchDetails() {
            try {
                const endpoint = mediaType === "tv"
                    ? `${API_BASE_URL}/tv/${id}/details`
                    : `${API_BASE_URL}/movies/${id}/details`;

                const response = await fetch(endpoint);
                const data = await response.json();

                if (data.status === "error") {
                    setError(data.message);
                } else {
                    setDetails(data.data);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load details");
            } finally {
                setLoading(false);
            }
        }

        fetchDetails();
    }, [id, mediaType]);

    return { details, loading, error };
}