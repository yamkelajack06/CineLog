import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Clock, Calendar, Globe } from "lucide-react";
import { useMovieDetails } from "../hooks/useMovieDetails";
import { useTheme } from "../hooks/useTheme";
import HomeNav from "../components/home/HomeNav";
import HomeFooter from "../components/home/HomeFooter";
import styles from "../styles/detail.module.css";

const TMDB_IMG_W500 = "https://image.tmdb.org/t/p/w500";
const TMDB_IMG_ORIGINAL = "https://image.tmdb.org/t/p/original";
const TMDB_IMG_FACE = "https://image.tmdb.org/t/p/w185";

export default function MovieDetailPage() {
    const { mediaType, id } = useParams<{ mediaType: string; id: string }>();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const { details, loading, error } = useMovieDetails(Number(id), mediaType);

    // loading state
    if (loading) {
        return (
            <div className={styles.page}>
                <div className={styles.pageContent}>
                    <HomeNav theme={theme} toggleTheme={toggleTheme} />
                    <div className={styles.statusMessage}>Loading…</div>
                </div>
            </div>
        );
    }

    // error state
    if (error || !details) {
        return (
            <div className={styles.page}>
                <div className={styles.pageContent}>
                    <HomeNav theme={theme} toggleTheme={toggleTheme} />
                    <div className={styles.statusMessage}>{error ?? "Not found"}</div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            {/* backdrop */}
            {details.backdrop_path && (
                <div className={styles.backdrop}>
                    <img
                        src={`${TMDB_IMG_ORIGINAL}${details.backdrop_path}`}
                        alt=""
                        className={styles.backdropImg}
                    />
                    <div className={styles.backdropOverlay} />
                </div>
            )}

            <div className={styles.pageContent}>
                <HomeNav theme={theme} toggleTheme={toggleTheme} />

                <main className={styles.main}>

                    {/* back */}
                    <button className={styles.backBtn} onClick={() => navigate(-1)}>
                        <ArrowLeft size={16} />
                        Back
                    </button>

                    {/* hero */}
                    <div className={styles.hero}>
                        {details.poster_path && (
                            <img
                                src={`${TMDB_IMG_W500}${details.poster_path}`}
                                alt={details.title}
                                className={styles.poster}
                            />
                        )}

                        <div className={styles.heroInfo}>
                            {/* genres */}
                            <div className={styles.genres}>
                                {details.genres.map((g) => (
                                    <span key={g} className={styles.genre}>{g}</span>
                                ))}
                            </div>

                            <h1 className={styles.title}>{details.title}</h1>

                            {details.tagline && (
                                <p className={styles.tagline}>"{details.tagline}"</p>
                            )}

                            {/* meta */}
                            <div className={styles.meta}>
                                <span className={styles.metaItem}>
                                    <Star size={14} />
                                    {details.vote_average?.toFixed(1)} ({details.vote_count?.toLocaleString()} votes)
                                </span>
                                {details.runtime && (
                                    <span className={styles.metaItem}>
                                        <Clock size={14} />
                                        {Math.floor(details.runtime / 60)}h {details.runtime % 60}m
                                    </span>
                                )}
                                {details.release_date && (
                                    <span className={styles.metaItem}>
                                        <Calendar size={14} />
                                        {details.release_date.slice(0, 4)}
                                    </span>
                                )}
                                {details.original_language && (
                                    <span className={styles.metaItem}>
                                        <Globe size={14} />
                                        {details.original_language.toUpperCase()}
                                    </span>
                                )}
                            </div>

                            <p className={styles.overview}>{details.overview}</p>

                            {/* directors */}
                            {details.directors.length > 0 && (
                                <div className={styles.directors}>
                                    <span className={styles.directorsLabel}>
                                        {details.directors[0].job === "Director" ? "Directed by" : "Created by"}
                                    </span>
                                    <span className={styles.directorsNames}>
                                        {details.directors.map((d) => d.name).join(", ")}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* trailer */}
                    {details.trailer && (
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>Trailer</h2>
                            <div className={styles.trailerWrap}>
                                <iframe
                                    className={styles.trailer}
                                    src={`https://www.youtube.com/embed/${details.trailer.key}`}
                                    title={details.trailer.name}
                                    allowFullScreen
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                />
                            </div>
                        </section>
                    )}

                    {/* cast */}
                    {details.cast.length > 0 && (
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>Cast</h2>
                            <div className={styles.castGrid}>
                                {details.cast.map((member) => (
                                    <div key={member.id} className={styles.castCard}>
                                        {member.profile_path ? (
                                            <img
                                                src={`${TMDB_IMG_FACE}${member.profile_path}`}
                                                alt={member.name}
                                                className={styles.castPhoto}
                                            />
                                        ) : (
                                            <div className={styles.castPhotoFallback}>
                                                {member.name.charAt(0)}
                                            </div>
                                        )}
                                        <div className={styles.castName}>{member.name}</div>
                                        <div className={styles.castCharacter}>{member.character}</div>
                                    </div>
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