import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { FeedItem } from "../../hooks/useFeed";
import styles from "../../styles/home.module.css";

const TMDB_IMG = "https://image.tmdb.org/t/p/w342";

interface Props {
    title: string;
    items: FeedItem[];
    id?: string;
}

export default function FeedCarousel({ title, items, id }: Props) {
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();

    const handleScroll = (direction: "left" | "right") => {
        if (!scrollRef.current) return;
        const offset = direction === "left" ? -320 : 320;
        scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    };

    // navigate to detail page on card click
    const handleClick = (item: FeedItem) => {
        navigate(`/details/${item.media_type || "movie"}/${item.id}`);
    };

    return (
        <section className={styles.carouselSection} id={id}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>{title}</h2>
                <div className={styles.carouselControls}>
                    <button
                        className={styles.carouselButton}
                        type="button"
                        onClick={() => handleScroll("left")}
                        aria-label="Scroll left"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <button
                        className={styles.carouselButton}
                        type="button"
                        onClick={() => handleScroll("right")}
                        aria-label="Scroll right"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            <div className={styles.carouselViewport} ref={scrollRef}>
                {items.map((item) => (
                    <article
                        key={item.id}
                        className={styles.movieCard}
                        onClick={() => handleClick(item)}
                    >
                        {item.poster_path ? (
                            <img
                                src={`${TMDB_IMG}${item.poster_path}`}
                                alt={item.title}
                                className={styles.poster}
                            />
                        ) : (
                            <div className={styles.posterFallback}>
                                <span>{item.title.charAt(0)}</span>
                            </div>
                        )}
                        <div className={styles.movieInfo}>
                            <h3 className={styles.movieTitle}>{item.title}</h3>
                            <div className={styles.movieMeta}>
                                <span className={styles.movieRating}>★ {item.vote_average?.toFixed(1)}</span>
                                <span className={styles.movieDate}>{item.release_date?.slice(0, 4)}</span>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}