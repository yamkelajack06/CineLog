import styles from "../../styles/dashboard.module.css";

export default function DashboardSkeleton() {
    return (
        <div className={styles.skeletonWrap}>
            <div className={styles.metricGrid}>
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`${styles.metricCard} ${styles.skeletonCard}`} />
                ))}
            </div>
            <div className={`${styles.panel} ${styles.skeletonBlock}`} style={{ height: "12rem" }} />
        </div>
    );
}