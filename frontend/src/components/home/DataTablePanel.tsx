import styles from "../../styles/home.module.css";

const rows = [
    { category: "Action", count: "42", average: "8.3" },
    { category: "Drama", count: "29", average: "8.9" },
    { category: "Sci-Fi", count: "18", average: "9.0" },
];

export default function DataTablePanel() {
    return (
        <section className={styles.panel}>
            <h2 className={styles.panelTitle}>Watchlist summary</h2>
            <div className={styles.tableScroll}>
                <table className={styles.dataTable}>
                    <thead>
                        <tr>
                            <th className={styles.dataHeader}>Category</th>
                            <th className={styles.dataHeader}>Item count</th>
                            <th className={styles.dataHeader}>Avg score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => (
                            <tr key={row.category} className={styles.dataRow}>
                                <td className={styles.dataCell}>{row.category}</td>
                                <td className={styles.dataCell}>{row.count}</td>
                                <td className={styles.dataCell}>{row.average}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
