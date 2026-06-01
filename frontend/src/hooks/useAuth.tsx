import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:8000";

export type AuthTab = "login" | "register";

interface ApiResponse {
    status: "success" | "error";
    message?: string;
    data?: unknown;
}

interface AuthState {
    loading: boolean;
    error: string | null;
    success: string | null;
}

export function useAuth() {
    const [state, setState] = useState<AuthState>({
        loading: false,
        error: null,
        success: null,
    });

    const navigate = useNavigate();

    function setPartial(partial: Partial<AuthState>) {
        setState((prev) => ({ ...prev, ...partial }));
    }

    function clearMessages() {
        setPartial({ error: null, success: null });
    }

    async function register(username: string, email: string, password: string) {
        setPartial({ loading: true, error: null, success: null });
        try {
            const res = await fetch(`${API_BASE}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });
            const data: ApiResponse = await res.json();

            if (data.status === "success") {
                // navigate to verify page, passing email via router state
                navigate("/verify", { state: { email } });
            } else {
                setPartial({ loading: false, error: data.message ?? "Registration failed." });
            }
        } catch {
            setPartial({ loading: false, error: "Could not connect to the server." });
        }
    }

    async function login(email: string, password: string) {
        setPartial({ loading: true, error: null, success: null });
        try {
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data: ApiResponse = await res.json();

            if (data.status === "success") {
                setPartial({ loading: false, success: data.message ?? "Login successful!" });
                // TODO: store session token
                setTimeout(() => navigate("/browse"), 1000);
            } else {
                setPartial({ loading: false, error: data.message ?? "Login failed." });
            }
        } catch {
            setPartial({ loading: false, error: "Could not connect to the server." });
        }
    }

    return {
        ...state,
        register,
        login,
        clearMessages,
    };
}

export function useVerify(email: string) {
    const [state, setState] = useState<AuthState>({
        loading: false,
        error: null,
        success: null,
    });

    const navigate = useNavigate();

    function setPartial(partial: Partial<AuthState>) {
        setState((prev) => ({ ...prev, ...partial }));
    }

    function clearMessages() {
        setPartial({ error: null, success: null });
    }

    async function verifyToken(token: string) {
        setPartial({ loading: true, error: null, success: null });
        try {
            const res = await fetch(`${API_BASE}/auth/verify-token`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, token }),
            });
            const data: ApiResponse = await res.json();

            if (data.status === "success") {
                setPartial({ loading: false, success: "Account verified! Redirecting to sign in…" });
                setTimeout(() => navigate("/login"), 1200);
            } else {
                setPartial({ loading: false, error: data.message ?? "Invalid or expired token." });
            }
        } catch {
            setPartial({ loading: false, error: "Could not connect to the server." });
        }
    }

    async function resendToken() {
        setPartial({ loading: true, error: null, success: null });
        try {
            const res = await fetch(`${API_BASE}/auth/resend-token`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data: ApiResponse = await res.json();

            if (data.status === "success") {
                setPartial({ loading: false, success: data.message ?? "New token sent!" });
            } else {
                setPartial({ loading: false, error: data.message ?? "Could not resend token." });
            }
        } catch {
            setPartial({ loading: false, error: "Could not connect to the server." });
        }
    }

    return {
        ...state,
        verifyToken,
        resendToken,
        clearMessages,
    };
}