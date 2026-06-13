import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useVerify } from "../hooks/useAuth";
import AuthCard from "../components/auth/AuthCard";
import Feedback from "../components/auth/Feedback";
import styles from "../styles/auth.module.css";

export default function VerifyPage() {
    const location = useLocation();
    const navigate = useNavigate();

    // email passed via router state from register flow, or entered manually
    const routeEmail: string = location.state?.email ?? "";
    const [manualEmail, setManualEmail] = useState("");
    const resolvedEmail = routeEmail || manualEmail;

    // tracks whether the code has been sent for self directed users
    const [codeSent, setCodeSent] = useState(false);

    const [token, setToken] = useState("");
    const { loading, error, success, verifyToken, resendToken } = useVerify(resolvedEmail);

    async function handleSendCode() {
        const ok = await resendToken();
        if (ok) setCodeSent(true);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (token.trim().length === 5) verifyToken(token.trim());
    }

    // strip non-digits and cap at 5 characters
    function handleTokenChange(e: React.ChangeEvent<HTMLInputElement>) {
        setToken(e.target.value.replace(/\D/g, "").slice(0, 5));
    }

    // user arrived from register flow, show the normal verify form
    if (routeEmail) {
        return (
            <AuthCard>
                <div className={styles.body}>

                    <div className={styles.verifyHeader}>
                        <span className={styles.verifyIcon}>✉</span>
                        <h2 className={styles.verifyTitle}>Check your inbox</h2>
                        <p className={styles.verifySubtitle}>
                            We sent a 5-digit code to{" "}
                            <span className={styles.verifyEmail}>{routeEmail}</span>.
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
                            {loading ? "Verifying..." : "Verify account"}
                        </button>
                    </form>

                    <div className={styles.resendRow}>
                        <span>Didn't receive it?</span>
                        <button
                            className={styles.resendBtn}
                            onClick={resendToken}
                            disabled={loading}
                        >
                            Resend code
                        </button>
                    </div>

                    <button className={styles.backBtn} onClick={() => navigate("/login")}>
                        Back to sign in
                    </button>

                </div>
            </AuthCard>
        );
    }

    // user arrived directly, step 1 collect email and send code
    if (!codeSent) {
        return (
            <AuthCard>
                <div className={styles.body}>

                    <div className={styles.verifyHeader}>
                        <span className={styles.verifyIcon}>✉</span>
                        <h2 className={styles.verifyTitle}>Verify your account</h2>
                        <p className={styles.verifySubtitle}>
                            Enter the email you registered with and we'll send you a verification code.
                        </p>
                    </div>

                    {error && <Feedback message={error} type="error" />}

                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="verify-email">Email</label>
                        <input
                            id="verify-email"
                            className={styles.input}
                            type="email"
                            placeholder="you@example.com"
                            value={manualEmail}
                            onChange={(e) => setManualEmail(e.target.value)}
                            required
                            autoComplete="email"
                            autoFocus
                        />
                    </div>

                    <button
                        className={styles.submit}
                        onClick={handleSendCode}
                        disabled={loading || !manualEmail.trim()}
                    >
                        {loading && <span className={styles.spinner} />}
                        {loading ? "Sending code..." : "Send code"}
                    </button>

                    <button className={styles.backBtn} onClick={() => navigate("/login")}>
                        Back to sign in
                    </button>

                </div>
            </AuthCard>
        );
    }

    // user arrived directly, step 2 code sent now enter it
    return (
        <AuthCard>
            <div className={styles.body}>

                <div className={styles.verifyHeader}>
                    <span className={styles.verifyIcon}>✉</span>
                    <h2 className={styles.verifyTitle}>Check your inbox</h2>
                    <p className={styles.verifySubtitle}>
                        We sent a 5-digit code to{" "}
                        <span className={styles.verifyEmail}>{manualEmail}</span>.
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
                        {loading ? "Verifying..." : "Verify account"}
                    </button>
                </form>

                <div className={styles.resendRow}>
                    <span>Didn't receive it?</span>
                    <button
                        className={styles.resendBtn}
                        onClick={resendToken}
                        disabled={loading}
                    >
                        Resend code
                    </button>
                </div>

                <button className={styles.backBtn} onClick={() => navigate("/login")}>
                    Back to sign in
                </button>

            </div>
        </AuthCard>
    );
}