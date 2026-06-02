import { useState } from "react";

export type AuthTab = "login" | "register";

type ApiResponse<T = unknown> = {
  status: "success" | "error";
  message: string;
  data?: T;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

async function post<T>(path: string, body: unknown): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Network response was not ok.");
  }

  return response.json();
}

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

export function useAuth() {
  const { loading, setLoading, error, setError, success, setSuccess, clearStatus, handleResponse } = useApiStatus();

  async function login(email: string, password: string) {
    clearStatus();
    setLoading(true);

    try {
      const response = await post("/auth/login", { email, password });
      return handleResponse(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to login");
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function register(username: string, email: string, password: string) {
    clearStatus();
    setLoading(true);

    try {
      const response = await post("/auth/register", { username, email, password });
      return handleResponse(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to register");
      return false;
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, success, login, register };
}

export function usePasswordResetRequest() {
  const { loading, setLoading, error, setError, success, setSuccess, clearStatus, handleResponse } = useApiStatus();

  async function requestReset(email: string) {
    clearStatus();
    setLoading(true);

    try {
      const response = await post("/auth/request-password-reset", { email });
      return handleResponse(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to request password reset");
      return false;
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, success, requestReset };
}

export function useResetPassword() {
  const { loading, setLoading, error, setError, success, setSuccess, clearStatus, handleResponse } = useApiStatus();

  async function resetPassword(email: string, token: string, newPassword: string) {
    clearStatus();
    setLoading(true);

    try {
      const response = await post("/auth/reset-password", {
        email,
        token,
        new_password: newPassword,
      });
      return handleResponse(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to reset password");
      return false;
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, success, resetPassword };
}

export function useVerify(email: string) {
  const { loading, setLoading, error, setError, success, setSuccess, clearStatus, handleResponse } = useApiStatus();

  async function verifyToken(token: string) {
    clearStatus();
    setLoading(true);

    try {
      const response = await post("/auth/verify-token", { email, token });
      return handleResponse(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to verify token");
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function resendToken() {
    clearStatus();
    setLoading(true);

    try {
      const response = await post("/auth/resend-token", { email });
      return handleResponse(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to resend token");
      return false;
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, success, verifyToken, resendToken };
}
