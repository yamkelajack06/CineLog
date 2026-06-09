import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star, Bookmark, BookmarkCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { FeedItem } from "../../hooks/useFeed";
import { useAuthContext } from "../../context/AuthContext";
import { useWatchlist } from "../../hooks/useWatchlist";
import AuthModal from "../auth/AuthModal";
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
    const { user, isLoggedIn } = useAuthContext();
    const { addToWatchlist, isInWatchlist } = useWatchlist(user?.id ?? null);
    const [showModal, setShowModal] = useState(false);
    const [loadingId, setLoadingId] = useState<number | null>(null);

    const handleScroll = (direction: "left" | "right") => {
        if (!scrollRef.current) return;
        const offset = direction === "left" ? -320 : 320;
        scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    };

    // navigate to detail page on card click
    const handleClick = (item: FeedItem) => {
        navigate(`/details/${item.media_type || "movie"}/${item.id}`);
    };

    // add to watchlist or show modal if not logged in
    const handleBookmark = async (e: React.MouseEvent, item: FeedItem) => {
        e.stopPropagation();

        if (!isLoggedIn) {
            setShowModal(true);
            return;
        }

        // already in watchlist navigate to watchlist page
        if (isInWatchlist(item.id)) {
            navigate("/watchlist");
            return;
        }

        setLoadingId(item.id);
        await addToWatchlist({
            tmdb_id: item.id,
            title: item.title,
            poster_url: item.poster_path,
            release_year: item.release_date ? Number(item.release_date.slice(0, 4)) : null,
            overview: item.overview,
            media_type: item.media_type || "movie"
        });
        setLoadingId(null);
    };

    return (
        <>
            {showModal && <AuthModal onClose={() => setShowModal(false)} />}

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
                            <div className={styles.posterWrap}>
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

                                {/* bookmark button shown on hover */}
                                <button
                                    className={`${styles.bookmarkBtn} ${isInWatchlist(item.id) ? styles.bookmarkActive : ""}`}
                                    onClick={(e) => handleBookmark(e, item)}
                                    aria-label={isInWatchlist(item.id) ? "In watchlist" : "Add to watchlist"}
                                    disabled={loadingId === item.id}
                                >
                                    {isInWatchlist(item.id)
                                        ? <BookmarkCheck size={15} />
                                        : <Bookmark size={15} />
                                    }
                                </button>
                            </div>

                            <div className={styles.movieInfo}>
                                <h3 className={styles.movieTitle}>{item.title}</h3>
                                <div className={styles.movieMeta}>
                                    <span className={styles.movieRating}>
                                        <Star size={11} className={styles.starIcon} />
                                        {item.vote_average?.toFixed(1)}
                                    </span>
                                    <span className={styles.movieDate}>{item.release_date?.slice(0, 4)}</span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </>
    );
}