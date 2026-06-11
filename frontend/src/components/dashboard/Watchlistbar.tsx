import { Eye, Clock } from "lucide-react";
import type { WatchlistSummary } from "../../hooks/useStats";
import styles from "../../styles/dashboard.module.css";

interface Props {
    summary: WatchlistSummary;
}

export default function WatchlistBar({ summary }: Props) {
    const total = summary.total || 1;
    const watchedPct = Math.round((summary.watched / total) * 100);
    const wantPct = Math.round((summary.want_to_watch / total) * 100);

    return (
        <section className={styles.panel}>
            <h2 className={styles.panelTitle}>Watchlist breakdown</h2>

            <div className={styles.wlBar}>
                <div
                    className={styles.wlBarFill}
                    style={{ width: `${watchedPct}%`, background: "var(--color-success)" }}
                />
                <div
                    className={styles.wlBarFill}
                    style={{ width: `${wantPct}%`, background: "var(--color-primary)" }}
                />
            </div>

            <div className={styles.wlLegend}>
                <span className={styles.wlLegendItem}>
                    <span className={styles.wlDot} style={{ background: "var(--color-success)" }} />
                    <Eye size={12} />
                    Watched — {summary.watched}
                </span>
                <span className={styles.wlLegendItem}>
                    <span className={styles.wlDot} style={{ background: "var(--color-primary)" }} />
                    <Clock size={12} />
                    Want to watch — {summary.want_to_watch}
                </span>
                <span className={styles.wlTotal}>{summary.total} total</span>
            </div>
        </section>
    );
}