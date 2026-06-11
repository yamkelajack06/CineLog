import { useNavigate } from "react-router-dom";
import { BookmarkCheck, LogIn } from "lucide-react";
import styles from "../../styles/dashboard.module.css";

export default function DashboardGuest() {
    const navigate = useNavigate();

    return (
        <div className={styles.guestWrap}>
            <div className={styles.guestBox}>
                <div className={styles.guestIcon}>
                    <BookmarkCheck size={32} />
                </div>
                <h2 className={styles.guestTitle}>Your cinema diary</h2>
                <p className={styles.guestText}>
                    Sign in to see your watch stats, and recently logged films and shows.
                </p>
                <button className={styles.guestBtn} onClick={() => navigate("/login")}>
                    <LogIn size={16} />
                    Sign in
                </button>
            </div>
        </div>
    );
}