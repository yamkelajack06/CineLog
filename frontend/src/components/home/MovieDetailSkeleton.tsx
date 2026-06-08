import styles from "../../styles/detail.module.css";

export default function MovieDetailSkeleton() {
    return (
        <main className={styles.main}>
            {/* back button */}
            <div className={`${styles.skeletonBlock} ${styles.skeletonBackBtn}`} />

            {/* hero */}
            <div className={styles.hero}>
                <div className={`${styles.skeletonBlock} ${styles.skeletonPoster}`} />

                <div className={styles.heroInfo}>
                    {/* genres */}
                    <div className={styles.skeletonGenres}>
                        <div className={`${styles.skeletonBlock} ${styles.skeletonGenre}`} />
                        <div className={`${styles.skeletonBlock} ${styles.skeletonGenre}`} />
                    </div>

                    {/* title */}
                    <div className={`${styles.skeletonBlock} ${styles.skeletonTitle}`} />
                    <div className={`${styles.skeletonBlock} ${styles.skeletonTitleShort}`} />

                    {/* tagline */}
                    <div className={`${styles.skeletonBlock} ${styles.skeletonTagline}`} />

                    {/* meta row */}
                    <div className={styles.skeletonMetaRow}>
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className={`${styles.skeletonBlock} ${styles.skeletonMetaItem}`} />
                        ))}
                    </div>

                    {/* overview */}
                    <div className={styles.skeletonOverview}>
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div
                                key={i}
                                className={`${styles.skeletonBlock} ${styles.skeletonLine}`}
                                style={{ width: i === 3 ? "60%" : "100%" }}
                            />
                        ))}
                    </div>

                    {/* director */}
                    <div className={`${styles.skeletonBlock} ${styles.skeletonDirector}`} />
                </div>
            </div>

            {/* cast section */}
            <section className={styles.section}>
                <div className={`${styles.skeletonBlock} ${styles.skeletonSectionTitle}`} />
                <div className={styles.castGrid}>
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className={styles.castCard}>
                            <div className={`${styles.skeletonBlock} ${styles.skeletonCastPhoto}`} />
                            <div className={`${styles.skeletonBlock} ${styles.skeletonCastName}`} />
                            <div className={`${styles.skeletonBlock} ${styles.skeletonCastChar}`} />
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}