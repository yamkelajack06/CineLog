from fastapi import APIRouter
from schemas.response import ApiResponse
from services.movie_service import MovieService
from services.tmdb_client import TMDB_Client
import json

router = APIRouter(prefix="/movies", tags=["Movies"])


@router.get("/feed", response_model=ApiResponse)
def handle_get_feed() -> ApiResponse:
    data = MovieService.get_feed()
    return ApiResponse(status="success", message="Feed loaded", data=data)


@router.get("/search", response_model=ApiResponse)
def handle_search(query: str) -> ApiResponse:
    result = MovieService.search_movies(query)
    if result.status == "error":
        return result
    return ApiResponse(status="success", data=json.loads(result.data))


@router.get("/trending", response_model=ApiResponse)
def handle_trending() -> ApiResponse:
    result = MovieService.get_trending_movies()
    if result.status == "error":
        return result
    return ApiResponse(status="success", data=json.loads(result.data))


@router.get("/popular", response_model=ApiResponse)
def handle_popular() -> ApiResponse:
    result = MovieService.get_popular_movies()
    if result.status == "error":
        return result
    return ApiResponse(status="success", data=json.loads(result.data))


@router.get("/top-rated", response_model=ApiResponse)
def handle_top_rated() -> ApiResponse:
    result = MovieService.get_top_rated_movies()
    if result.status == "error":
        return result
    return ApiResponse(status="success", data=json.loads(result.data))


@router.get("/upcoming", response_model=ApiResponse)
def handle_upcoming() -> ApiResponse:
    result = MovieService.get_upcoming_movies()
    if result.status == "error":
        return result
    return ApiResponse(status="success", data=json.loads(result.data))


@router.get("/trending-week", response_model=ApiResponse)
def handle_trending_week() -> ApiResponse:
    result = MovieService.get_trending_this_week()
    if result.status == "error":
        return result
    return ApiResponse(status="success", data=json.loads(result.data))


@router.get("/{movie_id}/details", response_model=ApiResponse)
def handle_movie_details(movie_id: int) -> ApiResponse:
    result = MovieService.get_movie_details(movie_id)
    if result.status == "error":
        return result
    formatted = TMDB_Client.format_movie_details(json.loads(result.data))
    return ApiResponse(status="success", data=formatted)


@router.get("/{movie_id}/similar", response_model=ApiResponse)
def handle_similar(movie_id: int) -> ApiResponse:
    result = MovieService.get_similar_movies(movie_id)
    if result.status == "error":
        return result
    return ApiResponse(status="success", data=json.loads(result.data))


@router.get("/{movie_id}/recommendations", response_model=ApiResponse)
def handle_recommendations(movie_id: int) -> ApiResponse:
    result = MovieService.get_movie_recommendations(movie_id)
    if result.status == "error":
        return result
    return ApiResponse(status="success", data=json.loads(result.data))


@router.get("/{movie_id}/videos", response_model=ApiResponse)
def handle_videos(movie_id: int) -> ApiResponse:
    result = MovieService.get_movie_videos(movie_id)
    if result.status == "error":
        return result
    return ApiResponse(status="success", data=json.loads(result.data))