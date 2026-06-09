import { createContext, useContext, useState, useEffect } from "react";

interface AuthUser {
    id: string;
    username: string;
    email: string;
    status: string;
}

interface AuthContextType {
    user: AuthUser | null;
    login: (userData: AuthUser) => void;
    logout: () => void;
    isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = "cinelog_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    // initialise from localStorage so session persists on refresh
    const [user, setUser] = useState<AuthUser | null>(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });

    // keep localStorage in sync whenever user changes
    useEffect(() => {
        if (user) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    }, [user]);

    const login = (userData: AuthUser) => setUser(userData);

    const logout = () => setUser(null);

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

// hook to consume auth context
export function useAuthContext() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuthContext must be used inside AuthProvider");
    return ctx;
}