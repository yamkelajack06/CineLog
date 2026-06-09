from datetime import datetime
from schemas.response import ApiResponse
from schemas.watchlist import WatchlistEntryCreate, WatchlistEntryUpdate
from schemas.tmdb_item import TmdbItemCreate
from database.database import Database
from utilities.general_utils import General_Utils


class Watchlist_Service:

    # ensure the tmdb item exists in our db before referencing it
    @staticmethod
    def _cache_tmdb_item(item: TmdbItemCreate) -> None:
        Database.query(
            """
            INSERT INTO tmdb_items (tmdb_id, type, title, poster_url, release_year, overview, cached_at)
            VALUES (:tmdb_id, :type, :title, :poster_url, :release_year, :overview, :cached_at)
            ON CONFLICT (tmdb_id) DO UPDATE
            SET title = EXCLUDED.title,
                poster_url = EXCLUDED.poster_url,
                cached_at = EXCLUDED.cached_at
            """,
            {
                "tmdb_id": item.tmdb_id,
                "type": item.type,
                "title": item.title,
                "poster_url": item.poster_url,
                "release_year": item.release_year,
                "overview": item.overview,
                "cached_at": datetime.now()
            }
        )

    # get all watchlist entries for a user
    @staticmethod
    def get_watchlist(user_id: str) -> ApiResponse:
        try:
            result = Database.query(
                """
                SELECT we.id, we.user_id, we.tmdb_id, we.status, we.created_at, we.updated_at,
                       ti.title, ti.poster_url, ti.release_year, ti.type, ti.overview
                FROM watchlist_entries we
                JOIN tmdb_items ti ON we.tmdb_id = ti.tmdb_id
                WHERE we.user_id = :user_id
                ORDER BY we.updated_at DESC
                """,
                {"user_id": user_id}
            )

            if result.status != "success":
                return ApiResponse(status="error", message="Failed to fetch watchlist")

            return ApiResponse(status="success", data=result.data)

        except Exception as e:
            return ApiResponse(status="error", message=str(e))

    # add an item to the watchlist
    @staticmethod
    def add_to_watchlist(user_id: str, entry: WatchlistEntryCreate, tmdb_item: TmdbItemCreate) -> ApiResponse:
        try:
            # cache the tmdb item first so the foreign key exists
            Watchlist_Service._cache_tmdb_item(tmdb_item)

            # check if already in watchlist
            existing = Database.query(
                "SELECT id, status FROM watchlist_entries WHERE user_id = :user_id AND tmdb_id = :tmdb_id",
                {"user_id": user_id, "tmdb_id": entry.tmdb_id}
            )

            if existing.status == "success" and existing.data:
                return ApiResponse(status="error", message="Item already in watchlist")

            # insert new watchlist entry
            result = Database.query(
                """
                INSERT INTO watchlist_entries (id, user_id, tmdb_id, status)
                VALUES (:id, :user_id, :tmdb_id, :status)
                """,
                {
                    "id": General_Utils.generate_random_id(),
                    "user_id": user_id,
                    "tmdb_id": entry.tmdb_id,
                    "status": entry.status
                }
            )

            if result.status != "success":
                return ApiResponse(status="error", message="Failed to add to watchlist")

            return ApiResponse(status="success", message="Added to watchlist")

        except Exception as e:
            return ApiResponse(status="error", message=str(e))

    # update watchlist entry status (want_to_watch <-> watched)
    @staticmethod
    def update_watchlist_entry(user_id: str, tmdb_id: int, update: WatchlistEntryUpdate) -> ApiResponse:
        try:
            result = Database.query(
                """
                UPDATE watchlist_entries
                SET status = :status, updated_at = :updated_at
                WHERE user_id = :user_id AND tmdb_id = :tmdb_id
                """,
                {
                    "status": update.status,
                    "updated_at": datetime.now(),
                    "user_id": user_id,
                    "tmdb_id": tmdb_id
                }
            )

            if result.status != "success" or result.data == 0:
                return ApiResponse(status="error", message="Entry not found or update failed")

            return ApiResponse(status="success", message="Watchlist entry updated")

        except Exception as e:
            return ApiResponse(status="error", message=str(e))

    # remove an item from the watchlist
    @staticmethod
    def remove_from_watchlist(user_id: str, tmdb_id: int) -> ApiResponse:
        try:
            result = Database.query(
                "DELETE FROM watchlist_entries WHERE user_id = :user_id AND tmdb_id = :tmdb_id",
                {"user_id": user_id, "tmdb_id": tmdb_id}
            )

            if result.status != "success" or result.data == 0:
                return ApiResponse(status="error", message="Entry not found")

            return ApiResponse(status="success", message="Removed from watchlist")

        except Exception as e:
            return ApiResponse(status="error", message=str(e))

    # check if a specific item is in a user's watchlist
    @staticmethod
    def get_watchlist_entry(user_id: str, tmdb_id: int) -> ApiResponse:
        try:
            result = Database.query(
                "SELECT id, status FROM watchlist_entries WHERE user_id = :user_id AND tmdb_id = :tmdb_id",
                {"user_id": user_id, "tmdb_id": tmdb_id}
            )

            if result.status != "success":
                return ApiResponse(status="error", message="Failed to check watchlist")

            if not result.data:
                return ApiResponse(status="success", data=None)

            return ApiResponse(status="success", data=result.data[0])

        except Exception as e:
            return ApiResponse(status="error", message=str(e))