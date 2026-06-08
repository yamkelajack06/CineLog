import { Search, Sun, Moon, UserCircle, X, Loader2, Film, Tv } from "lucide-react";
import { useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSearch } from "../../hooks/useSearch";
import styles from "../../styles/home.module.css";

const TMDB_IMG = "https://image.tmdb.org/t/p/w92";

type Theme = "light" | "dark";

interface Props {
    theme: Theme;
    toggleTheme: () => void;
}

export default function HomeNav({ theme, toggleTheme }: Props) {
    const { query, setQuery, results, loading, clear } = useSearch();
    const navigate = useNavigate();
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    // close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                clear();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [clear]);

    // navigate to detail page and clear search
    const handleResultClick = (mediaType: string, id: number) => {
        navigate(`/details/${mediaType || "movie"}/${id}`);
        clear();
    };

    const showDropdown = query.trim().length > 0;

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
                <Link to = "/dashboard" className = {styles.navLink}>Dashboard</Link>
                <Link to = "/browse" className = {styles.navLink}>Discover</Link>
                <Link to = "/watchlist" className = {styles.navLink}>Watchlist</Link>
            </div>

            <div className={styles.navActions}>
                {/* search with dropdown */}
                <div className={styles.searchWrap} ref={dropdownRef}>
                    <label className={styles.searchBox}>
                        {loading
                            ? <Loader2 size={16} className={styles.searchSpinner} />
                            : <Search size={16} />
                        }
                        <input
                            className={styles.searchInput}
                            type="search"
                            placeholder="Search movies & shows"
                            aria-label="Search movies and shows"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        {query && (
                            <button className={styles.searchClear} onClick={clear} aria-label="Clear search">
                                <X size={14} />
                            </button>
                        )}
                    </label>

                    {/* results dropdown */}
                    {showDropdown && (
                        <div className={styles.searchDropdown}>
                            {results.length === 0 && !loading && (
                                <div className={styles.searchEmpty}>No results for "{query}"</div>
                            )}
                            {results.map((item) => (
                                <button
                                    key={item.id}
                                    className={styles.searchResult}
                                    onClick={() => handleResultClick(item.media_type, item.id)}
                                >
                                    {item.poster_path ? (
                                        <img
                                            src={`${TMDB_IMG}${item.poster_path}`}
                                            alt={item.title}
                                            className={styles.searchResultPoster}
                                        />
                                    ) : (
                                        <div className={styles.searchResultPosterFallback}>
                                            {item.media_type === "tv" ? <Tv size={14} /> : <Film size={14} />}
                                        </div>
                                    )}
                                    <div className={styles.searchResultInfo}>
                                        <span className={styles.searchResultTitle}>{item.title}</span>
                                        <span className={styles.searchResultMeta}>
                                            {item.media_type === "tv" ? <Tv size={11} /> : <Film size={11} />}
                                            {item.release_date?.slice(0, 4) ?? "—"}
                                            {item.vote_average > 0 && (
                                                <> · ★ {item.vote_average.toFixed(1)}</>
                                            )}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

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