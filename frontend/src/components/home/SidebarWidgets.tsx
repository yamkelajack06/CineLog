import { Sparkles } from "lucide-react";
import styles from "../../styles/home.module.css";

const feedItems = [
    { name: "Mia", action: "rated", subject: "The Lighthouse 9/10" },
    { name: "Noah", action: "added", subject: "Watchlist: Arrival" },
    { name: "Ava", action: "reviewed", subject: "Blade Runner 2049" },
    { name: "Leo", action: "logged", subject: "Avatar: The Way of Water" },
];

export default function SidebarWidgets() {
    return (
        <div className={styles.sidebarStack}>
            <section className={`${styles.panel} ${styles.ctaPanel}`}>
                <div className={styles.ctaContent}>
                    <div>
                        <p className={styles.ctaLabel}>Keep your diary updated</p>
                        <h3 className={styles.ctaTitle}>Log today's watch in one tap.</h3>
                        <p className={styles.ctaText}>Freshen your feed, refine your stats, and never lose track of what you’ve seen.</p>
                    </div>
                    <button className={styles.ctaButton} type="button">Add new entry</button>
                </div>
                <Sparkles className={styles.ctaIcon} />
            </section>

            <section className={styles.panel}>
                <div className={styles.sectionHeaderCompact}>
                    <h3 className={styles.sectionTitle}>Activity feed</h3>
                </div>
                <div className={styles.activityList}>
                    {feedItems.map((item) => (
                        <div key={item.name + item.subject} className={styles.activityItem}>
                            <div className={styles.activityAvatar}>{item.name.charAt(0)}</div>
                            <div className={styles.activityText}>
                                <p className={styles.activityName}>{item.name}</p>
                                <p className={styles.activityMeta}>{item.action} {item.subject}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
