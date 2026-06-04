import { useState } from "react";
import { Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePasswordResetRequest } from "../../hooks/useAuth";
import Feedback from "./Feedback";
import styles from "../../styles/auth.module.css";

export default function ForgotPasswordForm() {
    const [email, setEmail] = useState("");
    const { loading, error, success, requestReset } = usePasswordResetRequest();
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const trimmedEmail = email.trim();
        if (!trimmedEmail) return;

        const ok = await requestReset(trimmedEmail);
        if (ok) {
            navigate("/reset-password", { state: { email: trimmedEmail } });
        }
    }

    return (
        <div className={styles.body}>
            <div className={styles.verifyHeader}>
                <Lock className={styles.verifyIcon} />
                <h2 className={styles.verifyTitle}>Reset your password</h2>
                <p className={styles.verifySubtitle}>
                    Enter the email for your CineLog account and we’ll send you a reset code.
                </p>
            </div>

            {error && <Feedback message={error} type="error" />}
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

                <button className={styles.submit} type="submit" disabled={loading || !email.trim()}>
                    {loading && <span className={styles.spinner} />}
                    {loading ? "Sending code…" : "Send reset code"}
                </button>
            </form>

            <div className={styles.footerLink}>
                Remembered your password?{' '}
                <button type="button" onClick={() => navigate("/login")}>Sign in</button>
            </div>
        </div>
    );
}
