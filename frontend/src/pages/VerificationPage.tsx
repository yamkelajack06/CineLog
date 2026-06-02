import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useVerify } from "../hooks/useAuth";
import AuthCard from "../components/auth/AuthCard";
import Feedback from "../components/auth/Feedback";
import styles from "../styles/auth.module.css";

export default function VerifyPage() {
    const location = useLocation();
    const navigate = useNavigate();

    // email is passed via router state from the register flow
    const email: string = location.state?.email ?? "";

    const [token, setToken] = useState("");
    const { loading, error, success, verifyToken, resendToken } = useVerify(email);

    // redirect to login if the page is visited directly without an email
    useEffect(() => {
        if (!email) navigate("/login", { replace: true });
    }, [email, navigate]);

    useEffect(() => {
        if (success) {
            navigate("/login", { replace: true, state: { email } });
        }
    }, [success, navigate, email]);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (token.trim().length === 5) verifyToken(token.trim());
    }

    // strip non-digits and cap at 5 characters
    function handleTokenChange(e: React.ChangeEvent<HTMLInputElement>) {
        setToken(e.target.value.replace(/\D/g, "").slice(0, 5));
    }

    return (
        <AuthCard>
            <div className={styles.body}>

                <div className={styles.verifyHeader}>
                    <span className={styles.verifyIcon}>✉</span>
                    <h2 className={styles.verifyTitle}>Check your inbox</h2>
                    <p className={styles.verifySubtitle}>
                        We sent a 5-digit code to{" "}
                        <span className={styles.verifyEmail}>{email}</span>.
                        <br />Enter it below to activate your account.
                    </p>
                </div>

                {error && <Feedback message={error} type="error" />}
                {success && <Feedback message={success} type="success" />}

                <form onSubmit={handleSubmit} noValidate>
                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="token-input">Verification code</label>
                        <input
                            id="token-input"
                            className={`${styles.input} ${styles.tokenInput}`}
                            type="text"
                            inputMode="numeric"
                            maxLength={5}
                            placeholder="•••••"
                            value={token}
                            onChange={handleTokenChange}
                            autoFocus
                            autoComplete="one-time-code"
                        />
                    </div>

                    <button
                        className={styles.submit}
                        type="submit"
                        disabled={loading || token.length !== 5}
                    >
                        {loading && <span className={styles.spinner} />}
                        {loading ? "Verifying…" : "Verify account"}
                    </button>
                </form>

                <div className={styles.resendRow}>
                    <span>Didn't receive it?</span>
                    <button className={styles.resendBtn} onClick={resendToken} disabled={loading}>
                        Resend code
                    </button>
                </div>

                <button className={styles.backBtn} onClick={() => navigate("/login")}>
                    ← Back to sign in
                </button>

            </div>
        </AuthCard>
    );
}