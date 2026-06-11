import { useTheme } from "../hooks/useTheme";
import { useAuthContext } from "../context/AuthContext";
import { useStats } from "../hooks/useStats";
import HomeNav from "../components/home/HomeNav";
import HomeFooter from "../components/home/HomeFooter";
import MetricCards from "../components/dashboard/MetricCards";
import RecentCarousel from "../components/dashboard/RecentCarousel";
import WatchlistBar from "../components/dashboard/Watchlistbar";
import GenreBreakdown from "../components/dashboard/GenreBreakdown";
import DashboardSkeleton from "../components/dashboard/DashboadSkeletonl";
import DashboardGuest from "../components/dashboard/DashboardGuest";
import styles from "../styles/dashboard.module.css";

export default function Dashboard() {
    const { theme, toggleTheme } = useTheme();
    const { user, isLoggedIn } = useAuthContext();
    const { data, loading, error } = useStats(user?.id ?? null);

    return (
        <div className={styles.page}>
            <div className={styles.pageContent}>
                <HomeNav theme={theme} toggleTheme={toggleTheme} />

                <main className={styles.main}>
                    <div className={styles.pageHeader}>
                        <div>
                            <h1 className={styles.pageTitle}>
                                {isLoggedIn ? `${user!.username}'s diary` : "Your diary"}
                            </h1>
                            <p className={styles.pageSubtitle}>
                                Your personal tracking stats and watch history.
                            </p>
                        </div>
                    </div>

                    {!isLoggedIn && <DashboardGuest />}

                    {isLoggedIn && loading && <DashboardSkeleton />}

                    {isLoggedIn && error && (
                        <p className={styles.errorNote}>{error}</p>
                    )}

                    {isLoggedIn && data && (
                        <div className={styles.layout}>
                            {/* main column */}
                            <div className={styles.mainCol}>
                                <MetricCards stats={data.stats} />
                                <RecentCarousel items={data.recent_activity} />
                            </div>

                            {/* sidebar */}
                            <div className={styles.sideCol}>
                                <WatchlistBar summary={data.watchlist_summary} />
                                <GenreBreakdown genres={data.genre_breakdown} />
                            </div>
                        </div>
                    )}
                </main>

                <HomeFooter />
            </div>
        </div>
    );
}