import styles from "../../styles/auth.module.css";

interface Props {
    children: React.ReactNode;
}

export default function AuthCard({ children }: Props) {
    return (
        <div className={styles.page}>
            <div className={styles.card}>

                {/* brand header */}
                <div className={styles.brand}>
                    <div className={styles.brandMark}>C</div>
                    <div>
                        <div className={styles.brandName}>CineLog</div>
                        <div className={styles.brandTagline}>Your cinema diary</div>
                    </div>
                </div>

                {children}
            </div>
        </div>
    );
}