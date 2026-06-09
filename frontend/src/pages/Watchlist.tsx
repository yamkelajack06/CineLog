import { useState } from "react";
import { Trash2, Eye, Clock, BookmarkX, Film, Tv } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import { useWatchlist, useWatchLogs } from "../hooks/useWatchlist";
import { useAuthContext } from "../context/AuthContext";
import HomeNav from "../components/home/HomeNav";
import HomeFooter from "../components/home/HomeFooter";
import styles from "../styles/wathlist.module.css";

const TMDB_IMG = "https://image.tmdb.org/t/p/w342";


type Tab = "watchlist" | "logs";
type FilterStatus = "all" | "want_to_watch" | "watched";

export default function WatchlistPage() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("watchlist");
  const [filter, setFilter] = useState<FilterStatus>("all");
  const { user } = useAuthContext();

  // watchlist hook
  const {
    watchlist,
    loading: watchlistLoading,
    removeFromWatchlist,
    updateStatus,
  } = useWatchlist(user?.id ?? null);

  // logs hook
  const {
    logs,
    loading: logsLoading,
    deleteLog,
  } = useWatchLogs(user?.id ?? null);

  // filter watchlist by status
  const filteredWatchlist =
    filter === "all" ? watchlist : watchlist.filter((e) => e.status === filter);

  // navigate to the detail page on card click
  const handleCardClick = (tmdbId: number, type: string) => {
    navigate(`/details/${type === "show" ? "tv" : "movie"}/${tmdbId}`);
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageContent}>
        <HomeNav theme={theme} toggleTheme={toggleTheme} />

        <main className={styles.main}>
          <div className={styles.header}>
            <h1 className={styles.pageTitle}>My Watchlist</h1>
            <p className={styles.pageSubtitle}>
              Track what you want to watch and log what you've seen.
            </p>
          </div>

          {/* tabs */}
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === "watchlist" ? styles.tabActive : ""}`}
              onClick={() => setActiveTab("watchlist")}
            >
              Watchlist
              {watchlist.length > 0 && (
                <span className={styles.tabBadge}>{watchlist.length}</span>
              )}
            </button>
            <button
              className={`${styles.tab} ${activeTab === "logs" ? styles.tabActive : ""}`}
              onClick={() => setActiveTab("logs")}
            >
              Watch Logs
              {logs.length > 0 && (
                <span className={styles.tabBadge}>{logs.length}</span>
              )}
            </button>
          </div>

          {/* watchlist tab */}
          {activeTab === "watchlist" && (
            <section className={styles.section}>
              {/* filter bar */}
              <div className={styles.filterBar}>
                {(["all", "want_to_watch", "watched"] as FilterStatus[]).map(
                  (f) => (
                    <button
                      key={f}
                      className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ""}`}
                      onClick={() => setFilter(f)}
                    >
                      {f === "all"
                        ? "All"
                        : f === "want_to_watch"
                          ? "Want to Watch"
                          : "Watched"}
                    </button>
                  ),
                )}
              </div>

              {watchlistLoading && (
                <div className={styles.emptyState}>Loading watchlist…</div>
              )}

              {!watchlistLoading && filteredWatchlist.length === 0 && (
                <div className={styles.emptyState}>
                  <BookmarkX size={40} className={styles.emptyIcon} />
                  <p>Nothing here yet. Browse and add films to get started.</p>
                </div>
              )}

              <div className={styles.grid}>
                {filteredWatchlist.map((entry) => (
                  <article key={entry.id} className={styles.card}>
                    {/* poster */}
                    <div
                      className={styles.posterWrap}
                      onClick={() => handleCardClick(entry.tmdb_id, entry.type)}
                    >
                      {entry.poster_url ? (
                        <img
                          src={`${TMDB_IMG}${entry.poster_url}`}
                          alt={entry.title}
                          className={styles.poster}
                        />
                      ) : (
                        <div className={styles.posterFallback}>
                          {entry.type === "show" ? (
                            <Tv size={24} />
                          ) : (
                            <Film size={24} />
                          )}
                        </div>
                      )}

                      {/* status badge */}
                      <span
                        className={`${styles.statusBadge} ${entry.status === "watched" ? styles.statusWatched : styles.statusWant}`}
                      >
                        {entry.status === "watched" ? (
                          <Eye size={10} />
                        ) : (
                          <Clock size={10} />
                        )}
                        {entry.status === "watched"
                          ? "Watched"
                          : "Want to Watch"}
                      </span>
                    </div>

                    {/* info */}
                    <div className={styles.cardInfo}>
                      <h3
                        className={styles.cardTitle}
                        onClick={() =>
                          handleCardClick(entry.tmdb_id, entry.type)
                        }
                      >
                        {entry.title}
                      </h3>
                      <span className={styles.cardYear}>
                        {entry.release_year ?? "—"}
                      </span>

                      {/* actions */}
                      <div className={styles.cardActions}>
                        {entry.status === "want_to_watch" && (
                          <button
                            className={styles.actionBtn}
                            onClick={() =>
                              updateStatus(entry.tmdb_id, "watched")
                            }
                            title="Mark as watched"
                          >
                            <Eye size={14} />
                            Mark watched
                          </button>
                        )}
                        {entry.status === "watched" && (
                          <button
                            className={`${styles.actionBtn} ${styles.actionBtnSecondary}`}
                            onClick={() =>
                              updateStatus(entry.tmdb_id, "want_to_watch")
                            }
                            title="Move back to want to watch"
                          >
                            <Clock size={14} />
                            Unwatch
                          </button>
                        )}
                        <button
                          className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                          onClick={() => removeFromWatchlist(entry.tmdb_id)}
                          title="Remove from watchlist"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* logs tab */}
          {activeTab === "logs" && (
            <section className={styles.section}>
              {logsLoading && (
                <div className={styles.emptyState}>Loading logs…</div>
              )}

              {!logsLoading && logs.length === 0 && (
                <div className={styles.emptyState}>
                  <Eye size={40} className={styles.emptyIcon} />
                  <p>
                    No watch logs yet. Mark items as watched to log them here.
                  </p>
                </div>
              )}

              <div className={styles.logList}>
                {logs.map((log) => (
                  <article key={log.id} className={styles.logRow}>
                    {log.poster_url ? (
                      <img
                        src={`${TMDB_IMG}${log.poster_url}`}
                        alt={log.title}
                        className={styles.logPoster}
                        onClick={() => handleCardClick(log.tmdb_id, log.type)}
                      />
                    ) : (
                      <div className={styles.logPosterFallback}>
                        {log.type === "show" ? (
                          <Tv size={16} />
                        ) : (
                          <Film size={16} />
                        )}
                      </div>
                    )}

                    <div className={styles.logInfo}>
                      <h3
                        className={styles.logTitle}
                        onClick={() => handleCardClick(log.tmdb_id, log.type)}
                      >
                        {log.title}
                      </h3>
                      <span className={styles.logMeta}>
                        {log.release_year ?? "—"} · Watched{" "}
                        {new Date(log.date_watched).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </span>
                    </div>

                    <button
                      className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                      onClick={() => deleteLog(log.id)}
                      title="Delete log entry"
                    >
                      <Trash2 size={14} />
                    </button>
                  </article>
                ))}
              </div>
            </section>
          )}
        </main>

        <HomeFooter />
      </div>
    </div>
  );
}
