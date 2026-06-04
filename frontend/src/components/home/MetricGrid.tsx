import { BarChart3, Clock3, Star, Film } from "lucide-react";
import styles from "../../styles/home.module.css";

const cards = [
    {
        title: "Total watched",
        icon: <Film size={20} />,
        value: "128",
        detail: "This month: 12 new titles",
        iconColor: "var(--color-primary)",
    },
    {
        title: "Average rating",
        icon: <Star size={20} />,
        value: "8.7",
        detail: "Based on 68 reviews",
        iconColor: "var(--icon-rating)",
    },
    {
        title: "Watchlist count",
        icon: <Clock3 size={20} />,
        value: "34",
        detail: "5 items added today",
        iconColor: "var(--color-secondary)",
    },
    {
        title: "Top genre",
        icon: <BarChart3 size={20} />,
        value: "Sci-Fi",
        detail: "Highest score this week",
        iconColor: "var(--icon-genre)",
    },
];

export default function MetricGrid() {
    return (
        <section className={styles.metricsGrid} id="stats">
            {cards.map((card) => (
                <article key={card.title} className={styles.metricCard}>
                    <div className={styles.metricHeader}>
                        <span className={styles.metricTitle}>{card.title}</span>
                        <span className={styles.metricIcon} style={{ color: card.iconColor }}>
                            {card.icon}
                        </span>
                    </div>
                    <div className={styles.metricValue}>{card.value}</div>
                    <div className={styles.metricMeta}>{card.detail}</div>
                </article>
            ))}
        </section>
    );
}
