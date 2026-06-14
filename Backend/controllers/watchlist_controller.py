from fastapi import APIRouter, Depends, HTTPException
from schemas.response import ApiResponse
from schemas.requests import AddToWatchlistRequest, UpdateWatchlistRequest, LogWatchRequest
from schemas.watchlist import WatchlistEntryCreate, WatchlistEntryUpdate
from schemas.tmdb_item import TmdbItemCreate
from services.watchlist_service import Watchlist_Service
from services.watchlog_service import WatchLog_Service

from utilities.auth_middleware import get_current_user

router = APIRouter(prefix="/watchlist", tags=["Watchlist"])


def _require_self(user_id: str, current_user: dict) -> None:
    # ensure user can only modify their own account
    if current_user["sub"] != user_id:
        raise HTTPException(status_code=403, detail="Access denied")


# --- watchlist endpoints ---


@router.get("/{user_id}", response_model=ApiResponse)
def handle_get_watchlist(user_id: str, current_user: dict = Depends(get_current_user)) -> ApiResponse:
    # fetch all watchlist entries for a user
    _require_self(user_id, current_user)
    return Watchlist_Service.get_watchlist(user_id)


@router.get("/{user_id}/check/{tmdb_id}", response_model=ApiResponse)
def handle_check_watchlist(user_id: str, tmdb_id: int, current_user: dict = Depends(get_current_user)) -> ApiResponse:
    # check if a specific item is already in a user's watchlist
    _require_self(user_id, current_user)
    return Watchlist_Service.get_watchlist_entry(user_id, tmdb_id)


@router.post("/{user_id}/add", response_model=ApiResponse)
def handle_add_to_watchlist(user_id: str, request: AddToWatchlistRequest, current_user: dict = Depends(get_current_user)) -> ApiResponse:
    # build entry and item objects from request
    _require_self(user_id, current_user)
    entry = WatchlistEntryCreate(tmdb_id=request.tmdb_id, status=request.status)
    tmdb_item = TmdbItemCreate(
        tmdb_id=request.tmdb_id,
        type=request.media_type,
        title=request.title,
        poster_url=request.poster_url,
        release_year=request.release_year,
        overview=request.overview
    )
    return Watchlist_Service.add_to_watchlist(user_id, entry, tmdb_item)


@router.patch("/{user_id}/update/{tmdb_id}", response_model=ApiResponse)
def handle_update_watchlist_entry(user_id: str, tmdb_id: int, request: UpdateWatchlistRequest, current_user: dict = Depends(get_current_user)) -> ApiResponse:
    # update the status of a watchlist entry
    _require_self(user_id, current_user)
    update = WatchlistEntryUpdate(status=request.status)
    return Watchlist_Service.update_watchlist_entry(user_id, tmdb_id, update)


@router.delete("/{user_id}/remove/{tmdb_id}", response_model=ApiResponse)
def handle_remove_from_watchlist(user_id: str, tmdb_id: int, current_user: dict = Depends(get_current_user)) -> ApiResponse:
    # remove an item from the watchlist
    _require_self(user_id, current_user)
    return Watchlist_Service.remove_from_watchlist(user_id, tmdb_id)


# --- watch log endpoints ---


@router.get("/{user_id}/logs", response_model=ApiResponse)
def handle_get_watch_logs(user_id: str, current_user: dict = Depends(get_current_user)) -> ApiResponse:
    # fetch all watch logs for a user
    _require_self(user_id, current_user)
    return WatchLog_Service.get_watch_logs(user_id)


@router.post("/{user_id}/log", response_model=ApiResponse)
def handle_log_watch(user_id: str, request: LogWatchRequest, current_user: dict = Depends(get_current_user)) -> ApiResponse:
    # log a watch entry, also updates watchlist status to watched
    _require_self(user_id, current_user)
    return WatchLog_Service.log_watch(user_id, request.tmdb_id, request.date_watched)


@router.delete("/{user_id}/logs/{log_id}", response_model=ApiResponse)
def handle_delete_watch_log(user_id: str, log_id: str, current_user: dict = Depends(get_current_user)) -> ApiResponse:
    # delete a specific watch log entry
    _require_self(user_id, current_user)
    return WatchLog_Service.delete_watch_log(user_id, log_id)

