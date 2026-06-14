import { useState } from "react";

const API_BASE_URL = "http://127.0.0.1:8000";

type ApiResponse<T = unknown> = {
    status: "success" | "error";
    message: string;
    data?: T;
};

// reusable api status state
function useApiStatus() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const clearStatus = () => {
        setError(null);
        setSuccess(null);
    };

    const handleResponse = <T,>(response: ApiResponse<T>) => {
        if (response.status === "error") {
            setError(response.message);
            return false;
        }
        setSuccess(response.message);
        return true;
    };

    return { loading, setLoading, error, setError, success, setSuccess, clearStatus, handleResponse };
}

// patch helper function
async function patch<T>(path: string, body: unknown): Promise<ApiResponse<T>> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Network response was not ok.");
    }

    return response.json();
}

// delete helper with optional body
async function del<T>(path: string, body?: unknown): Promise<ApiResponse<T>> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Network response was not ok.");
    }

    return response.json();
}

export function useAccount(userId: string) {
    const { loading, setLoading, error, setError, success, clearStatus, handleResponse } = useApiStatus();

    // update the user's username
    async function updateUsername(username: string) {
        clearStatus();
        setLoading(true);

        try {
            const response = await patch(`/account/${userId}/username`, { username });
            return handleResponse(response);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update username");
            return false;
        } finally {
            setLoading(false);
        }
    }

    // update the user's email sets account back to unverified
    async function updateEmail(email: string) {
        clearStatus();
        setLoading(true);

        try {
            const response = await patch(`/account/${userId}/email`, { email });
            return handleResponse(response);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update email");
            return false;
        } finally {
            setLoading(false);
        }
    }

    // update password which requires current password for verification
    async function updatePassword(currentPassword: string, newPassword: string) {
        clearStatus();
        setLoading(true);

        try {
            const response = await patch(`/account/${userId}/password`, {
                current_password: currentPassword,
                new_password: newPassword,
            });
            return handleResponse(response);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update password");
            return false;
        } finally {
            setLoading(false);
        }
    }

    // permanently delete the account which requires password confirmation
    async function deleteAccount(password: string) {
        clearStatus();
        setLoading(true);

        try {
            const response = await del(`/account/${userId}`, { password });
            return handleResponse(response);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete account");
            return false;
        } finally {
            setLoading(false);
        }
    }

    return { loading, error, success, updateUsername, updateEmail, updatePassword, deleteAccount };
}