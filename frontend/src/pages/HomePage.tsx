import { useTheme } from "../hooks/useTheme";
import HomeNav from "../components/home/HomeNav";
import MetricGrid from "../components/home/MetricGrid";
import ActivityCarousel from "../components/home/ActivityCarousel";
import DataTablePanel from "../components/home/DataTablePanel";
import SidebarWidgets from "../components/home/SidebarWidgets";
import HomeFooter from "../components/home/HomeFooter";
import styles from "../styles/home.module.css";

export default function HomePage() {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className={styles.page}>
            <div className={styles.pageContent}>
                <HomeNav theme={theme} toggleTheme={toggleTheme} />

                <main className={styles.hero}>
                    <h1 className={styles.pageTitle}>Browse your cinema world.</h1>
                    <p className={styles.heroSubtitle}>
                        A clean dashboard view of your watch history, watchlist, and activity. Everything is designed to keep your movie tracking simple, professional, and easy to scan.
                    </p>

                    <MetricGrid />
                    <ActivityCarousel />

                    <div className={styles.dashboardGrid}>
                        <DataTablePanel />
                        <SidebarWidgets />
                    </div>
                </main>

                <HomeFooter />
            </div>
        </div>
    );
}