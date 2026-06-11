import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Eye, Film, Tv } from "lucide-react";
import type { RecentActivityItem } from "../../hooks/useStats";
import styles from "../../styles/dashboard.module.css";

const TMDB_IMG = "https://image.tmdb.org/t/p/w185";

interface Props {
    items: RecentActivityItem[];
}

export default function RecentCarousel({ items }: Props) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const scroll = (dir: "left" | "right") => {
        scrollRef.current?.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
    };

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

    return (
        <section className={styles.carouselSection}>
            <div className={styles.carouselHeader}>
                <h2 className={styles.panelTitle} style={{ marginBottom: 0 }}>Recently watched</h2>
                <div className={styles.carouselBtns}>
                    <button className={styles.carouselBtn} onClick={() => scroll("left")} aria-label="Scroll left">
                        <ChevronLeft size={16} />
                    </button>
                    <button className={styles.carouselBtn} onClick={() => scroll("right")} aria-label="Scroll right">
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {items.length === 0 ? (
                <p className={styles.emptyNote}>
                    Nothing logged yet. Mark items as watched from the Browse or Watchlist pages.
                </p>
            ) : (
                <div className={styles.carouselViewport} ref={scrollRef}>
                    {items.map((item) => (
                        <article
                            key={item.id}
                            className={styles.activityCard}
                            onClick={() => navigate(`/details/${item.type === "tv" ? "tv" : "movie"}/${item.tmdb_id}`)}
                        >
                            <div className={styles.activityPosterWrap}>
                                {item.poster_url ? (
                                    <img
                                        src={`${TMDB_IMG}${item.poster_url}`}
                                        alt={item.title}
                                        className={styles.activityPoster}
                                    />
                                ) : (
                                    <div className={styles.activityPosterFallback}>
                                        {item.type === "tv" ? <Tv size={20} /> : <Film size={20} />}
                                    </div>
                                )}
                                <span className={styles.activityTypeBadge}>
                                    {item.type === "tv" ? <Tv size={10} /> : <Film size={10} />}
                                    {item.type === "tv" ? "TV" : "Film"}
                                </span>
                            </div>
                            <div className={styles.activityInfo}>
                                <p className={styles.activityTitle}>{item.title}</p>
                                <p className={styles.activityDate}>
                                    <Eye size={10} />
                                    {formatDate(item.date_watched)}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}