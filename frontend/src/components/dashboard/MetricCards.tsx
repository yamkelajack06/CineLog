import { Film, Flame, Clock } from "lucide-react";
import type { DashboardStats } from "../../hooks/useStats";
import styles from "../../styles/dashboard.module.css";

interface Props {
    stats: DashboardStats;
}

export default function MetricCards({ stats }: Props) {
    const cards = [
        {
            label: "Total watched",
            value: stats.total_watched,
            sub: `${stats.movies_watched} films · ${stats.tv_watched} shows`,
            icon: <Film size={18} />,
            accent: "var(--color-primary)",
        },
        {
            label: "Watch streak",
            value: stats.watch_streak === 0 ? "—" : `${stats.watch_streak}d`,
            sub: stats.watch_streak > 0 ? "consecutive days" : "No active streak",
            icon: <Flame size={18} />,
            accent: "var(--color-warning)",
        },
        {
            label: "Watchlist",
            value: stats.watchlist_size,
            sub: "titles to watch",
            icon: <Clock size={18} />,
            accent: "var(--color-secondary)",
        },
        {
            label: "Top genre",
            value: "—",
            sub: "coming soon",
            icon: <Film size={18} />,
            accent: "var(--icon-genre)",
        },
    ];

    return (
        <div className={styles.metricGrid}>
            {cards.map((card) => (
                <article key={card.label} className={styles.metricCard}>
                    <div className={styles.metricTop}>
                        <span className={styles.metricLabel}>{card.label}</span>
                        <span className={styles.metricIcon} style={{ color: card.accent }}>
                            {card.icon}
                        </span>
                    </div>
                    <div className={styles.metricValue}>{card.value}</div>
                    <div className={styles.metricSub}>{card.sub}</div>
                </article>
            ))}
        </div>
    );
}