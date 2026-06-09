import { useNavigate } from "react-router-dom";
import { X, LogIn, UserPlus } from "lucide-react";
import styles from "../../styles/authModal.module.css";

interface Props {
    onClose: () => void;
}

export default function AuthModal({ onClose }: Props) {
    const navigate = useNavigate();

    const handleNavigate = (path: string) => {
        onClose();
        navigate(path);
    };

    // close on backdrop click
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div className={styles.backdrop} onClick={handleBackdropClick}>
            <div className={styles.modal}>

                {/* close button */}
                <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
                    <X size={18} />
                </button>

                {/* brand mark */}
                <div className={styles.brandMark}>C</div>

                <h2 className={styles.title}>Sign in to continue</h2>
                <p className={styles.subtitle}>
                    Create a free account or sign in to add films to your watchlist,
                    log watches, and track your cinema diary.
                </p>

                <div className={styles.actions}>
                    <button
                        className={styles.btnPrimary}
                        onClick={() => handleNavigate("/register")}
                    >
                        <UserPlus size={16} />
                        Create free account
                    </button>
                    <button
                        className={styles.btnSecondary}
                        onClick={() => handleNavigate("/login")}
                    >
                        <LogIn size={16} />
                        Already have an account
                    </button>
                </div>

                <p className={styles.note}>No credit card required. Free forever.</p>
            </div>
        </div>
    );
}