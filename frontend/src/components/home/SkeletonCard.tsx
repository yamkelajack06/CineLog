import styles from "../../styles/home.module.css";

export default function SkeletonCard() {
    return (
        <article className={styles.movieCard} aria-hidden="true">
            <div className={styles.skeletonPoster} />
            <div className={styles.skeletonInfo}>
                <div className={styles.skeletonTitle} />
                <div className={styles.skeletonMetaRow}>
                    <div className={styles.skeletonMeta} />
                    <div className={styles.skeletonMeta} />
                </div>
            </div>
        </article>
    );
}

