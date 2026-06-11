import type { GenreBreakdownItem } from "../../hooks/useStats";
import styles from "../../styles/dashboard.module.css";

interface Props {
    genres: GenreBreakdownItem[];
}

export default function GenreBreakdown({ genres }: Props) {
    const max = genres[0]?.count || 1;

    return (
        <section className={styles.panel}>
            <h2 className={styles.panelTitle}>Genre breakdown</h2>

            {genres.length === 0 ? (
                <p className={styles.emptyNote}>
                    Genre data will appear once genre caching is enabled in the backend.
                </p>
            ) : (
                <div className={styles.genreList}>
                    {genres.slice(0, 8).map((g) => (
                        <div key={g.genre} className={styles.genreRow}>
                            <span className={styles.genreName}>{g.genre}</span>
                            <div className={styles.genreTrack}>
                                <div
                                    className={styles.genreBar}
                                    style={{ width: `${(g.count / max) * 100}%` }}
                                />
                            </div>
                            <span className={styles.genreCount}>{g.count}</span>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}