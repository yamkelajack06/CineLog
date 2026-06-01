import type { AuthTab } from "../../hooks/useAuth";
import styles from "../../styles/auth.module.css";

interface Props {
    active: AuthTab;
    onChange: (tab: AuthTab) => void;
}

export default function AuthTabs({ active, onChange }: Props) {
    return (
        <div className={styles.tabs}>
            <button
                className={`${styles.tab} ${active === "login" ? styles.tabActive : ""}`}
                onClick={() => onChange("login")}
            >
                Sign in
            </button>
            <button
                className={`${styles.tab} ${active === "register" ? styles.tabActive : ""}`}
                onClick={() => onChange("register")}
            >
                Create account
            </button>
        </div>
    );
}