from fastapi import APIRouter
from schemas.response import ApiResponse
from services.movie_service import MovieService
from utilities.movie_utils import Movie_Utils
import json

router = APIRouter(prefix="/tv", tags=["TV Shows"])


@router.get("/{tv_id}/details", response_model=ApiResponse)
def handle_tv_details(tv_id: int) -> ApiResponse:
    result = MovieService.get_tv_details(tv_id)
    if result.status == "error":
        return result
    formatted = Movie_Utils.format_movie_details(json.loads(result.data))
    return ApiResponse(status="success", data=formatted)


@router.get("/{tv_id}/videos", response_model=ApiResponse)
def handle_tv_videos(tv_id: int) -> ApiResponse:
    result = MovieService.get_tv_videos(tv_id)
    if result.status == "error":
        return result
    return ApiResponse(status="success", data=json.loads(result.data))