import { useRef, useState, useEffect } from "react";
import { Link } from "react-router";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import styles from "../styles/landing.module.css";

const SLIDES = [
  {
    title: "Oppenheimer",
    year: "2023",
    genre: "Drama · History",
    rating: "8.9",
    backdrop: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&q=80",
  },
  {
    title: "Dune: Part Two",
    year: "2024",
    genre: "Sci-Fi · Adventure",
    rating: "8.5",
    backdrop: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80",
  },
  {
    title: "Succession",
    year: "2018",
    genre: "Drama · Series",
    rating: "8.9",
    backdrop: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&q=80",
  },
  {
    title: "The Batman",
    year: "2022",
    genre: "Action · Crime",
    rating: "7.8",
    backdrop: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1920&q=80",
  },
  {
    title: "Shogun",
    year: "2024",
    genre: "Drama · Series",
    rating: "9.0",
    backdrop: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=1920&q=80",
  },
];

const SLIDE_DURATION = 6000;

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();

  // add shadow to nav on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // auto advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setTransitioning(true);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % SLIDES.length);
        setTransitioning(false);
      }, 600);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, []);

  // manual slide change
  const goTo = (index: number) => {
    if (index === current) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrent(index);
      setTransitioning(false);
    }, 600);
  };

  const slide = SLIDES[current];

  return (
    <div className={styles["landing-root"]}>
      {/* nav */}
      <nav className={`${styles["landing-nav"]} ${scrolled ? styles["landing-nav--scrolled"] : ""}`}>
        <div className={styles["landing-nav__logo"]}>
          <span className={styles["logo-mark"]}>C</span>
          <span className={styles["logo-text"]}>CineLog</span>
        </div>
        <div className={styles["landing-nav__actions"]}>
          <button className={styles["theme-toggle"]} onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <Link to = "login" className={`${styles.btn} ${styles["btn--ghost"]}`}>Sign in</Link>
          <Link to="register" className={`${styles.btn} ${styles["btn--primary"]}`}>Get Started</Link>
        </div>
      </nav>

      {/* hero with slideshow background */}
      <header className={styles["landing-hero"]} ref={heroRef}>

        {/* backdrop */}
        <div className={`${styles["hero-bg"]} ${transitioning ? styles["hero-bg--fade"] : ""}`}>
          <img key={current} src={slide.backdrop} alt="" className={styles["hero-bg__img"]} />
          <div className={styles["hero-bg__overlay"]} />
          <div className={styles["hero-bg__gradient"]} />
        </div>

        <div className={styles["hero-content"]}>
          <div className={styles["hero-badge"]}>
            <span className={styles["hero-badge__dot"]} />
            Your personal film &amp; TV tracker
          </div>

          <h1 className={styles["hero-title"]}>
            Track every film.<br />
            Every series.<br />
            <span className={styles["hero-title--accent"]}>Every moment.</span>
          </h1>

          <p className={styles["hero-subtitle"]}>
            Build your watchlist, log what you've seen, rate and review all in one place. No noise, just cinema.
          </p>

          <div className={styles["hero-cta"]}>
            <a href="/register" className={`${styles.btn} ${styles["btn--primary"]} ${styles["btn--lg"]}`}>
              Start tracking free
            </a>
            <a href="/browse" className={`${styles.btn} ${styles["btn--outline"]} ${styles["btn--lg"]}`}>
              Browse without account
            </a>
          </div>
        </div>

        {/* current movie label + dots */}
        <div className={styles["slide-ui"]}>
          <div className={`${styles["slide-info"]} ${transitioning ? styles["slide-info--hidden"] : ""}`}>
            <span className={styles["slide-info__rating"]}>★ {slide.rating}</span>
            <span className={styles["slide-info__title"]}>{slide.title}</span>
            <span className={styles["slide-info__meta"]}>{slide.year} · {slide.genre}</span>
          </div>
          <div className={styles["slide-dots"]}>
            {SLIDES.map((_, i) => (
              <button
                key={i}
                className={`${styles["slide-dot"]} ${i === current ? styles["slide-dot--active"] : ""}`}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* progress bar */}
        <div className={styles["slide-progress"]}>
          <div key={current} className={styles["slide-progress__bar"]} />
        </div>
      </header>

      {/* features */}
      <section className={styles["features-section"]}>
        <div className={styles["features-grid"]}>
          <div className={styles["feature-card"]}>
            <div className={styles["feature-icon"]}>◎</div>
            <h3>Search &amp; Discover</h3>
            <p>Search millions of movies and shows powered by TMDB. Find exactly what you're looking for.</p>
          </div>
          <div className={styles["feature-card"]}>
            <div className={styles["feature-icon"]}>⊞</div>
            <h3>Your Watchlist</h3>
            <p>Queue up what you want to watch. Mark items as watched and keep your list organised.</p>
          </div>
          <div className={styles["feature-card"]}>
            <div className={styles["feature-icon"]}>◈</div>
            <h3>Rate &amp; Review</h3>
            <p>Score titles from 1–10 and write reviews. Your personal critics' archive.</p>
          </div>
          <div className={styles["feature-card"]}>
            <div className={styles["feature-icon"]}>◉</div>
            <h3>Watch Stats</h3>
            <p>See your most watched genres, average rating, recent activity and more.</p>
          </div>
        </div>
      </section>

      {/* footer cta */}
      <section className={styles["footer-cta"]}>
        <h2>Ready to start logging?</h2>
        <div className={styles["hero-cta"]}>
          <a href="/register" className={`${styles.btn} ${styles["btn--primary"]} ${styles["btn--lg"]}`}>
            Create free account
          </a>
          <a href="/login" className={`${styles.btn} ${styles["btn--outline"]} ${styles["btn--lg"]}`}>
            Sign in
          </a>
        </div>
      </section>

      <footer className={styles["landing-footer"]}>
        <span>© {new Date().getFullYear()} CineLog</span>
        <span>Powered by TMDB</span>
      </footer>
    </div>
  );
}