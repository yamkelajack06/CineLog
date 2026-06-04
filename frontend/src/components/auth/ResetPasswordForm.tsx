import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { useResetPassword } from "../../hooks/useAuth";
import Feedback from "./Feedback";
import styles from "../../styles/auth.module.css";

interface Props {
    initialEmail: string;
}

export default function ResetPasswordForm({ initialEmail }: Props) {
    const navigate = useNavigate();
    const [email, setEmail] = useState(initialEmail);
    const [token, setToken] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [localError, setLocalError] = useState<string | null>(null);

    const { loading, error, success, resetPassword } = useResetPassword();

    useEffect(() => {
        if (!initialEmail) return;
        setEmail(initialEmail);
    }, [initialEmail]);

    useEffect(() => {
        if (success) {
            navigate("/login", { replace: true, state: { email } });
        }
    }, [success, navigate, email]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLocalError(null);

        if (!email.trim()) {
            setLocalError("Please enter your email.");
            return;
        }

        if (token.trim().length !== 5) {
            setLocalError("Please enter the 5-digit reset code.");
            return;
        }

        if (password.length < 8) {
            setLocalError("Password must be at least 8 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setLocalError("Passwords do not match.");
            return;
        }

        await resetPassword(email.trim(), token.trim(), password);
    }

    const displayError = localError ?? error;

    return (
        <div className={styles.body}>
            <div className={styles.verifyHeader}>
                <ShieldCheck className={styles.verifyIcon} />
                <h2 className={styles.verifyTitle}>Enter your reset code</h2>
                <p className={styles.verifySubtitle}>
                    Use the code sent to your email, then choose a new password.
                </p>
            </div>

            {displayError && <Feedback message={displayError} type="error" />}
            {success && <Feedback message={success} type="success" />}

            <form onSubmit={handleSubmit} noValidate>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="reset-email">
                        Email
                    </label>
                    <input
                        id="reset-email"
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
                    <label className={styles.label} htmlFor="reset-token">
                        Reset code
                    </label>
                    <input
                        id="reset-token"
                        className={styles.input}
                        type="text"
                        inputMode="numeric"
                        maxLength={5}
                        placeholder="12345"
                        value={token}
                        onChange={(e) => setToken(e.target.value.replace(/\D/g, "").slice(0, 5))}
                        required
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label} htmlFor="new-password">
                        New password
                    </label>
                    <input
                        id="new-password"
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
                    <label className={styles.label} htmlFor="confirm-password">
                        Confirm password
                    </label>
                    <input
                        id="confirm-password"
                        className={styles.input}
                        type="password"
                        placeholder="Repeat your new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                    />
                </div>

                <button className={styles.submit} type="submit" disabled={loading}>
                    {loading && <span className={styles.spinner} />}
                    {loading ? "Resetting password…" : "Reset password"}
                </button>
            </form>

            <div className={styles.footerLink}>
                Back to{' '}
                <button type="button" onClick={() => navigate("/login")}>Sign in</button>
            </div>
        </div>
    );
}
