import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Feedback from "./Feedback";
import styles from "../../styles/auth.module.css";

export default function RegisterForm() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [localError, setLocalError] = useState<string | null>(null);

    const { loading, error, register } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLocalError(null);

        if (password.length < 8) {
            setLocalError("Password must be at least 8 characters.");
            return;
        }
        if (password !== confirmPassword) {
            setLocalError("Passwords do not match.");
            return;
        }

        const ok = await register(username, email, password);
        if (ok) {
            navigate("/verify", { state: { email } });
        }
    }

    const displayError = localError ?? error;

    return (
        <form onSubmit={handleSubmit} noValidate>
            {displayError && <Feedback message={displayError} type="error" />}

            <div className={styles.field}>
                <label className={styles.label} htmlFor="reg-username">Username</label>
                <input
                    id="reg-username"
                    className={styles.input}
                    type="text"
                    placeholder="cinephile_42"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    autoComplete="username"
                    autoFocus
                />
            </div>

            <div className={styles.field}>
                <label className={styles.label} htmlFor="reg-email">Email</label>
                <input
                    id="reg-email"
                    className={styles.input}
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                />
            </div>

            <div className={styles.field}>
                <label className={styles.label} htmlFor="reg-password">Password</label>
                <input
                    id="reg-password"
                    className={styles.input}
                    type="password"
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                />
            </div>

            <div className={styles.field}>
                <label className={styles.label} htmlFor="reg-confirm">Confirm password</label>
                <input
                    id="reg-confirm"
                    className={styles.input}
                    type="password"
                    placeholder="Repeat your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                />
            </div>

            <button className={styles.submit} type="submit" disabled={loading}>
                {loading && <span className={styles.spinner} />}
                {loading ? "Creating account..." : "Create account"}
            </button>
        </form>
    );
}