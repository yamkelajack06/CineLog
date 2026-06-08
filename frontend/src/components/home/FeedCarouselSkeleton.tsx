import styles from "../../styles/home.module.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SkeletonCard from "./SkeletonCard";

interface Props {
    title: string;
    id?: string;
    itemsCount?: number;
}

export default function FeedCarouselSkeleton({
    title,
    id,
    itemsCount = 7,
}: Props) {
    return (
        <section className={styles.carouselSection} id={id}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>{title}</h2>
                <div className={styles.carouselControls}>
                    <button
                        className={styles.carouselButton}
                        type="button"
                        aria-label="Scroll left"
                        disabled
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <button
                        className={styles.carouselButton}
                        type="button"
                        aria-label="Scroll right"
                        disabled
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            <div className={styles.carouselViewport} aria-hidden="true">
                {Array.from({ length: itemsCount }).map((_, idx) => (
                    <SkeletonCard key={idx} />
                ))}
            </div>
        </section>
    );
}

