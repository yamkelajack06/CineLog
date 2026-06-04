import { Search, Sun, Moon, UserCircle } from "lucide-react";
import styles from "../../styles/home.module.css";

type Theme = "light" | "dark";

interface Props {
    theme: Theme;
    toggleTheme: () => void;
}

export default function HomeNav({ theme, toggleTheme }: Props) {
    return (
        <nav className={styles.nav}>
            <div className={styles.navBrand}>
                <span className={styles.brandMark}>C</span>
                <div>
                    <div className={styles.brandName}>CineLog</div>
                    <div className={styles.brandTagline}>Cinema diary</div>
                </div>
            </div>

            <div className={styles.navLinks}>
                <a href="#overview" className={styles.navLink}>Dashboard</a>
                <a href="#stats" className={styles.navLink}>Discover</a>
                <a href="#watchlist" className={styles.navLink}>Watchlist</a>
                <a href="#activity" className={styles.navLink}>Activity</a>
            </div>

            <div className={styles.navActions}>
                <label className={styles.searchBox}>
                    <Search size={16} />
                    <input
                        className={styles.searchInput}
                        type="search"
                        placeholder="Search movies"
                        aria-label="Search movies"
                    />
                </label>
                <button className={styles.iconButton} onClick={toggleTheme} aria-label="Toggle theme">
                    {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
                </button>
                <button className={styles.avatar} type="button" aria-label="Open profile">
                    <UserCircle size={20} />
                </button>
            </div>
        </nav>
    );
}
