import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthCard from "../components/auth/AuthCard";
import AuthTabs from "../components/auth/AuthTabs";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegistrationForm";
import type { AuthTab } from "../hooks/useAuth";
import styles from "../styles/auth.module.css";

export default function AuthPage() {
    const [tab, setTab] = useState<AuthTab>("login");
    const navigate = useNavigate();

    function handleTabChange(next: AuthTab) {
        setTab(next);
    }

    return (
        <AuthCard>
            <AuthTabs active={tab} onChange={handleTabChange} />

            <div className={styles.body}>
                {tab === "login" ? (
                    <>
                        <LoginForm />
                        <div className={styles.footerLink}>
                            No account?{" "}
                            <button onClick={() => setTab("register")}>Create one</button>
                        </div>
                    </>
                ) : (
                    <>
                        <RegisterForm />
                        <div className={styles.footerLink}>
                            Already have an account?{" "}
                            <button onClick={() => setTab("login")}>Sign in</button>
                        </div>
                    </>
                )}

                <button className={styles.backBtn} onClick={() => navigate("/")}>
                    ← Back to home
                </button>
            </div>
        </AuthCard>
    );
}