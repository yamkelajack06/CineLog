import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import Feedback from "./Feedback";
import styles from "../../styles/auth.module.css";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { loading, error, success, login } = useAuth();

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        login(email, password);
    }

    return (
        <form onSubmit={handleSubmit} noValidate>
            {error && <Feedback message={error} type="error" />}
            {success && <Feedback message={success} type="success" />}

            <div className={styles.field}>
                <label className={styles.label} htmlFor="login-email">Email</label>
                <input
                    id="login-email"
                    className={styles.input}
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    autoFocus
                />
            </div>

            <div className={styles.field}>
                <label className={styles.label} htmlFor="login-password">Password</label>
                <input
                    id="login-password"
                    className={styles.input}
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                />
            </div>

            <button className={styles.submit} type="submit" disabled={loading}>
                {loading && <span className={styles.spinner} />}
                {loading ? "Signing in…" : "Sign in"}
            </button>
        </form>
    );
}