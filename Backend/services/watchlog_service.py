from datetime import datetime
from schemas.response import ApiResponse
from database.database import Database
from utilities.general_utils import General_Utils


class WatchLog_Service:

    # get all watch logs for a user
    @staticmethod
    def get_watch_logs(user_id: str) -> ApiResponse:
        try:
            result = Database.query(
                """
                SELECT wl.id, wl.user_id, wl.tmdb_id, wl.date_watched, wl.created_at,
                       ti.title, ti.poster_url, ti.release_year, ti.type
                FROM watch_logs wl
                JOIN tmdb_items ti ON wl.tmdb_id = ti.tmdb_id
                WHERE wl.user_id = :user_id
                ORDER BY wl.date_watched DESC
                """,
                {"user_id": user_id}
            )

            if result.status != "success":
                return ApiResponse(status="error", message="Failed to fetch watch logs")

            return ApiResponse(status="success", data=result.data)

        except Exception as e:
            return ApiResponse(status="error", message=str(e))

    # log a watch entry for a user
    @staticmethod
    def log_watch(user_id: str, tmdb_id: int, date_watched: datetime = None) -> ApiResponse:
        try:
            # default date watched to now if not provided
            watched_at = date_watched or datetime.now()

            result = Database.query(
                """
                INSERT INTO watch_logs (id, user_id, tmdb_id, date_watched)
                VALUES (:id, :user_id, :tmdb_id, :date_watched)
                """,
                {
                    "id": General_Utils.generate_random_id(),
                    "user_id": user_id,
                    "tmdb_id": tmdb_id,
                    "date_watched": watched_at
                }
            )

            if result.status != "success":
                return ApiResponse(status="error", message="Failed to log watch")

            # also update watchlist status to watched if entry exists
            Database.query(
                """
                UPDATE watchlist_entries
                SET status = 'watched', updated_at = :updated_at
                WHERE user_id = :user_id AND tmdb_id = :tmdb_id
                """,
                {
                    "updated_at": datetime.now(),
                    "user_id": user_id,
                    "tmdb_id": tmdb_id
                }
            )

            return ApiResponse(status="success", message="Watch logged successfully")

        except Exception as e:
            return ApiResponse(status="error", message=str(e))

    # delete a watch log entry
    @staticmethod
    def delete_watch_log(user_id: str, log_id: str) -> ApiResponse:
        try:
            result = Database.query(
                "DELETE FROM watch_logs WHERE id = :id AND user_id = :user_id",
                {"id": log_id, "user_id": user_id}
            )

            if result.status != "success" or result.data == 0:
                return ApiResponse(status="error", message="Log entry not found")

            return ApiResponse(status="success", message="Watch log deleted")

        except Exception as e:
            return ApiResponse(status="error", message=str(e))