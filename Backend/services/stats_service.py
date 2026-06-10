from datetime import datetime, timedelta
from schemas.response import ApiResponse
from database.database import Database


class Dashboard_Service:

    @staticmethod
    def get_dashboard(user_id: str) -> ApiResponse:
        try:
            stats = Dashboard_Service._get_stats(user_id)
            recent_activity = Dashboard_Service._get_recent_activity(user_id)
            genre_breakdown = Dashboard_Service._get_genre_breakdown(user_id)
            watchlist_summary = Dashboard_Service._get_watchlist_summary(user_id)
            activity_heatmap = Dashboard_Service._get_activity_heatmap(user_id)

            return ApiResponse(
                status="success",
                data={
                    "stats": stats,
                    "recent_activity": recent_activity,
                    "genre_breakdown": genre_breakdown,
                    "watchlist_summary": watchlist_summary,
                    "activity_heatmap": activity_heatmap,
                }
            )
        except Exception as e:
            return ApiResponse(status="error", message=str(e))

    @staticmethod
    def _get_stats(user_id: str) -> dict:
        # total unique items watched (from watch_logs)
        total_watched_result = Database.query(
            "SELECT COUNT(DISTINCT tmdb_id) AS total FROM watch_logs WHERE user_id = :user_id",
            {"user_id": user_id}
        )
        total_watched = (
            total_watched_result.data[0]["total"]
            if total_watched_result.status == "success" and total_watched_result.data
            else 0
        )

        # watchlist size (want_to_watch only)
        watchlist_result = Database.query(
            "SELECT COUNT(*) AS total FROM watchlist_entries WHERE user_id = :user_id AND status = 'want_to_watch'",
            {"user_id": user_id}
        )
        watchlist_size = (
            watchlist_result.data[0]["total"]
            if watchlist_result.status == "success" and watchlist_result.data
            else 0
        )

        # current watch streak (consecutive days with at least one log)
        streak = Dashboard_Service._calculate_streak(user_id)

        # movies vs tv breakdown
        type_breakdown_result = Database.query(
            """
            SELECT ti.type, COUNT(*) AS count
            FROM watch_logs wl
            JOIN tmdb_items ti ON wl.tmdb_id = ti.tmdb_id
            WHERE wl.user_id = :user_id
            GROUP BY ti.type
            """,
            {"user_id": user_id}
        )
        movies_watched = 0
        tv_watched = 0
        if type_breakdown_result.status == "success" and type_breakdown_result.data:
            for row in type_breakdown_result.data:
                if row["type"] == "movie":
                    movies_watched = row["count"]
                elif row["type"] == "tv":
                    tv_watched = row["count"]

        return {
            "total_watched": total_watched,
            "movies_watched": movies_watched,
            "tv_watched": tv_watched,
            "watchlist_size": watchlist_size,
            "watch_streak": streak,
            # ratings/reviews not yet implemented
            "average_rating": None,
            "total_reviews": None,
        }

    @staticmethod
    def _calculate_streak(user_id: str) -> int:
        result = Database.query(
            """
            SELECT DISTINCT DATE(date_watched) AS watch_date
            FROM watch_logs
            WHERE user_id = :user_id
            ORDER BY watch_date DESC
            """,
            {"user_id": user_id}
        )

        if result.status != "success" or not result.data:
            return 0

        dates = [row["watch_date"] for row in result.data]
        today = datetime.now().date()
        streak = 0

        # allow streak to start from today or yesterday
        expected = today if dates[0] == today else today - timedelta(days=1)

        for date in dates:
            if isinstance(date, datetime):
                date = date.date()
            if date == expected:
                streak += 1
                expected -= timedelta(days=1)
            else:
                break

        return streak

    @staticmethod
    def _get_recent_activity(user_id: str, limit: int = 20) -> list:
        result = Database.query(
            """
            SELECT wl.id, wl.tmdb_id, wl.date_watched, wl.created_at,
                   ti.title, ti.poster_url, ti.release_year, ti.type, ti.overview
            FROM watch_logs wl
            JOIN tmdb_items ti ON wl.tmdb_id = ti.tmdb_id
            WHERE wl.user_id = :user_id
            ORDER BY wl.date_watched DESC
            LIMIT :limit
            """,
            {"user_id": user_id, "limit": limit}
        )

        if result.status != "success":
            return []

        return result.data or []

    @staticmethod
    def _get_genre_breakdown(user_id: str) -> list:
    
        result = Database.query(
            """
            SELECT ti.genres, COUNT(*) AS count
            FROM watch_logs wl
            JOIN tmdb_items ti ON wl.tmdb_id = ti.tmdb_id
            WHERE wl.user_id = :user_id AND ti.genres IS NOT NULL
            GROUP BY ti.genres
            ORDER BY count DESC
            """,
            {"user_id": user_id}
        )

        if result.status != "success" or not result.data:
            return []

        # aggregate genre counts across multi-genre items
        genre_counts: dict[str, int] = {}
        for row in result.data:
            genres_raw = row.get("genres") or ""
            count = row.get("count", 1)
            for genre in genres_raw.split("|"):
                genre = genre.strip()
                if genre:
                    genre_counts[genre] = genre_counts.get(genre, 0) + count

        return [
            {"genre": genre, "count": count}
            for genre, count in sorted(genre_counts.items(), key=lambda x: x[1], reverse=True)
        ]

    @staticmethod
    def _get_watchlist_summary(user_id: str) -> dict:
        result = Database.query(
            """
            SELECT status, COUNT(*) AS count
            FROM watchlist_entries
            WHERE user_id = :user_id
            GROUP BY status
            """,
            {"user_id": user_id}
        )

        summary = {"want_to_watch": 0, "watched": 0, "total": 0}

        if result.status == "success" and result.data:
            for row in result.data:
                status = row.get("status")
                count = row.get("count", 0)
                if status in summary:
                    summary[status] = count
                summary["total"] += count

        return summary

    @staticmethod
    def _get_activity_heatmap(user_id: str, days: int = 365) -> list:
        since = datetime.now().date() - timedelta(days=days)

        result = Database.query(
            """
            SELECT DATE(date_watched) AS day, COUNT(*) AS count
            FROM watch_logs
            WHERE user_id = :user_id AND DATE(date_watched) >= :since
            GROUP BY day
            ORDER BY day ASC
            """,
            {"user_id": user_id, "since": since}
        )

        if result.status != "success" or not result.data:
            return []

        return [
            {
                "date": row["day"].isoformat() if hasattr(row["day"], "isoformat") else str(row["day"]),
                "count": row["count"]
            }
            for row in result.data
        ]