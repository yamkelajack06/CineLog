# CineLog

CineLog is a personal movie and TV show tracking web application designed with a professional, database-driven aesthetic. It allows users to search for content, build a private watchlist, log watched items, and leave detailed ratings and reviews. 

Built with a robust custom authentication system and seamless TMDB integration, CineLog serves as a private, highly organized cinema diary.

---

## Core Features

### Custom Authentication & Security
* **Token-Based Verification:** Secure email verification using 5-minute expiry tokens.
* **Rate Limiting:** Built-in cooldowns (2-minute waits, 3-request maximums) for token generation.
* **Account Protection:** Automatic 60-minute account lockouts after 5 failed login attempts.
* **Password Management:** Secure password reset flows with temporary tokens.

### Discovery & TMDB Integration
* **Extensive Database:** Search for any movie or TV show using the TMDB API.
* **Rich Details:** View release years, synopses, and genre tags.
* **Integrated Trailers:** Watch official YouTube trailers embedded directly on the movie detail pages.
* **Smart Recommendations:** Discover new content via TMDB's native recommendation engine based on highly-rated watch logs.

### Tracking & Logging
* **Watchlists:** Add items to your private watchlist and filter by "Want to Watch" or "Watched".
* **Watch Logs:** Mark items as watched, automatically recording the date.
* **Ratings & Reviews:** Rate watched content on a 1-10 scale and leave optional written reviews.

### Personal Dashboard
* **Analytics:** View your personalized tracking stats, including Total Watched, Average Rating, and Most Watched Genre.
* **Recent Activity:** Browse a horizontally scrolling carousel of your most recently logged films and shows.

---

## Tech Stack

**Frontend**
* **Language:** Typescript
* **Framework:** React.ts
* **Styling:** Vanilla CSS (Implementing a strict, custom design system)
* **Icons:** Lucide React

**Backend**
* **Language:**Python
* **Framework:** FastAPI
* **Data Validation:** Pydantic (V2)
* **Database:** Relational SQL Database (PostgreSQL)
* **External APIs:** The Movie Database (TMDB) API

**Tools**
* **SMTP**: Email sending
---

## Local Development Setup

### Prerequisites
* Node.js & npm
* Python 3.9+
* A TMDB API Key
* SMTP Email Credentials (for the auth flow)

### 1. Clone the Repository
```bash
git clone [https://github.com/yamkelajack06/cinelog.git](https://github.com/yamkelajack06/cinelog.git)
cd cinelog
