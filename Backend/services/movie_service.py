from services.tmdb_client import TMDB_Client
from schemas.response import ApiResponse
import json

class MovieService:

    # user searches movie by title
    @staticmethod
    def search_movies(query: str) -> ApiResponse:
        return TMDB_Client.make_request(f"search/multi?query={query}&include_adult=false&language=en-US&page=1")

    # user gets details of a specific movie
    @staticmethod
    def get_movie_details(movie_id: int) -> ApiResponse:
        return TMDB_Client.make_request(f"movie/{movie_id}?append_to_response=videos,images,credits")

    # user gets details of a specific tv show
    @staticmethod
    def get_tv_details(tv_id: int) -> ApiResponse:
        return TMDB_Client.make_request(f"tv/{tv_id}?append_to_response=videos,images,credits")

    # gets trending movies
    @staticmethod
    def get_trending_movies() -> ApiResponse:
        return TMDB_Client.make_request("trending/movie/day?language=en-US")

    # gets trending this week (movies + tv)
    @staticmethod
    def get_trending_this_week() -> ApiResponse:
        return TMDB_Client.make_request("trending/all/week?language=en-US")

    # get top rated movies
    @staticmethod
    def get_top_rated_movies() -> ApiResponse:
        return TMDB_Client.make_request("movie/top_rated?language=en-US&page=1")

    # gets movies by genre
    @staticmethod
    def get_movies_by_genre(genre_id: int) -> ApiResponse:
        return TMDB_Client.make_request(f"discover/movie?with_genres={genre_id}&language=en-US&page=1")

    # get upcoming releases
    @staticmethod
    def get_upcoming_movies() -> ApiResponse:
        return TMDB_Client.make_request("movie/upcoming?language=en-US&page=1")

    # gets popular movies
    @staticmethod
    def get_popular_movies() -> ApiResponse:
        return TMDB_Client.make_request("movie/popular?language=en-US&page=1")

    # gets similar movies to the searched/viewed movie
    @staticmethod
    def get_similar_movies(movie_id: int) -> ApiResponse:
        return TMDB_Client.make_request(f"movie/{movie_id}/similar?language=en-US&page=1")

    # gets personalized movie recommendations based on a movie
    @staticmethod
    def get_movie_recommendations(movie_id: int) -> ApiResponse:
        return TMDB_Client.make_request(f"movie/{movie_id}/recommendations?language=en-US&page=1")

    # gets cast and crew for a movie
    @staticmethod
    def get_movie_credits(movie_id: int) -> ApiResponse:
        return TMDB_Client.make_request(f"movie/{movie_id}/credits")

    # gets cast and crew for a tv show
    @staticmethod
    def get_tv_credits(tv_id: int) -> ApiResponse:
        return TMDB_Client.make_request(f"tv/{tv_id}/credits")

    # gets videos (trailers, teasers) for a movie
    @staticmethod
    def get_movie_videos(movie_id: int) -> ApiResponse:
        return TMDB_Client.make_request(f"movie/{movie_id}/videos?language=en-US")

    # gets videos (trailers, teasers) for a tv show
    @staticmethod
    def get_tv_videos(tv_id: int) -> ApiResponse:
        return TMDB_Client.make_request(f"tv/{tv_id}/videos?language=en-US")

    # get movie by actor/director person id
    @staticmethod
    def get_movies_by_person(person_id: int) -> ApiResponse:
        return TMDB_Client.make_request(f"person/{person_id}/movie_credits")

    # gets movies by release year
    @staticmethod
    def get_movies_by_year(year: int) -> ApiResponse:
        return TMDB_Client.make_request(f"discover/movie?primary_release_year={year}&language=en-US&page=1")

    # gets the full feed for the homepage
    @staticmethod
    def get_feed() -> dict:
        results = {}
        endpoints = {
            "trending":"trending/movie/day?language=en-US",
            "popular":"movie/popular?language=en-US&page=1",
            "top_rated":"movie/top_rated?language=en-US&page=1",
            "upcoming":"movie/upcoming?language=en-US&page=1",
            "trending_this_week":"trending/all/week?language=en-US",
        }

        for key, endpoint in endpoints.items():
            response = TMDB_Client.make_request(endpoint)
            if response.status == "success":
                data = json.loads(response.data)
                # cap each category at 20 items, deduplicate by id
                seen = set()
                items = []
                for item in data.get("results", []):
                    item_id = item.get("id")
                    if item_id not in seen:
                        seen.add(item_id)
                        items.append(item)
                    if len(items) >= 20:
                        break
                results[key] = items
            else:
                results[key] = []

        return results