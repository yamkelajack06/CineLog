import { useTheme } from "../hooks/useTheme";
import { useFeed } from "../hooks/useFeed";
import HomeNav from "../components/home/HomeNav";
import FeedCarousel from "../components/home/FeedCarousel";
import FeedCarouselSkeleton from "../components/home/FeedCarouselSkeleton";
import HomeFooter from "../components/home/HomeFooter";
import styles from "../styles/home.module.css";

export default function HomePage() {
    const { theme, toggleTheme } = useTheme();
    const { feed, loading, error } = useFeed();

    return (
        <div className={styles.page}>
            <div className={styles.pageContent}>
                <HomeNav theme={theme} toggleTheme={toggleTheme} />

                <main className={styles.hero}>
                    <h1 className={styles.pageTitle}>Discover your next watch.</h1>
                    <p className={styles.heroSubtitle}>
                        Browse trending movies and shows, explore top rated picks, and find what to watch next.
                    </p>

                    {/* discover feed section */}
                    <section id="discover">
                        {loading && (
                            <>
                                <FeedCarouselSkeleton
                                    title="Trending today"
                                    id="trending"
                                />
                                <FeedCarouselSkeleton
                                    title="Trending this week"
                                    id="trending-week"
                                />
                                <FeedCarouselSkeleton title="Popular" id="popular" />
                                <FeedCarouselSkeleton title="Top rated" id="top-rated" />
                                <FeedCarouselSkeleton title="Upcoming" id="upcoming" />
                            </>
                        )}
                        {error && <p className={styles.feedError}>{error}</p>}

                        {feed && (
                            <>
                                <FeedCarousel title="Trending today" items={feed.trending} id="trending" />
                                <FeedCarousel title="Trending this week" items={feed.trending_this_week} id="trending-week" />
                                <FeedCarousel title="Popular" items={feed.popular} id="popular" />
                                <FeedCarousel title="Top rated" items={feed.top_rated} id="top-rated" />
                                <FeedCarousel title="Upcoming" items={feed.upcoming} id="upcoming" />
                            </>
                        )}
                    </section>
                </main>

                <HomeFooter />
            </div>
        </div>
    );
}

