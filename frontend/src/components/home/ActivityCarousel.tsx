import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "../../styles/home.module.css";

const items = [
    {
        title: "Inception",
        date: "Watched Apr 28",
        image: "https://images.unsplash.com/photo-1517604931442-7b0e31e75d35?w=600&q=60",
    },
    {
        title: "Barbie",
        date: "Watched Apr 24",
        image: "https://images.unsplash.com/photo-1517607609076-5b3b02b0f5e8?w=600&q=60",
    },
    {
        title: "The Matrix",
        date: "Watched Apr 21",
        image: "https://images.unsplash.com/photo-1505682634904-d7c1f73d7b92?w=600&q=60",
    },
    {
        title: "Kill Bill",
        date: "Watched Apr 18",
        image: "https://images.unsplash.com/photo-1517607632446-54af30a07db4?w=600&q=60",
    },
    {
        title: "Dune",
        date: "Watched Apr 11",
        image: "https://images.unsplash.com/photo-1486427944299-d1955d79b7fa?w=600&q=60",
    },
];

export default function ActivityCarousel() {
    const scrollRef = useRef<HTMLDivElement | null>(null);

    const handleScroll = (direction: "left" | "right") => {
        if (!scrollRef.current) return;
        const offset = direction === "left" ? -320 : 320;
        scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    };

    return (
        <section className={styles.carouselSection} id="activity">
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Recent activity</h2>
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
                    <article key={item.title} className={styles.movieCard}>
                        <img src={item.image} alt={item.title} className={styles.poster} />
                        <div className={styles.movieInfo}>
                            <h3 className={styles.movieTitle}>{item.title}</h3>
                            <p className={styles.movieDate}>{item.date}</p>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
