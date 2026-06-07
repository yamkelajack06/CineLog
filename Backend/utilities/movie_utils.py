import requests
import os
from dotenv import load_dotenv
from schemas.response import ApiResponse

load_dotenv()

class Movie_Utils:
    #setup the movie database api call
    @staticmethod
    def make_request(endpoint:str) -> ApiResponse:
        #params to pass in my api call
        #try and load the env variable from env file
        try:
            AUTH_TOKEN:str = os.getenv("TMDB_ACCESS_TOKEN")
            print("loading token passed")

        except ImportError:
            return ApiResponse(status="error", message="Failed to load Acess token from .env file")

        BASE_URL = "https://api.themoviedb.org/3/"

        headers = {
            "Authorization": f"Bearer {AUTH_TOKEN}"
        }

        try:
            response = requests.get(BASE_URL + endpoint, headers=headers)
            print("making api call...")
            #if network call fails return immediately
            if response.status_code != 200:
                return ApiResponse(status = "error", message= f"Error: API call failed. Status = {response.status_code}")
        
        except Exception as e:
            return ApiResponse(status="error", message=str(e))
    
        return ApiResponse(status = "success", message = "Data loaded successfully", data = response.text)
    
    # formats a raw TMDB result item for the feed
    @staticmethod
    def format_feed_item(item: dict) -> dict:
        return {
            "id": item.get("id"),
            "title": item.get("title") or item.get("name"),
            "overview": item.get("overview"),
            "poster_path": item.get("poster_path"),
            "backdrop_path": item.get("backdrop_path"),
            "vote_average": item.get("vote_average"),
            "release_date": item.get("release_date") or item.get("first_air_date"),
            "media_type": item.get("media_type", "movie"),
            "genre_ids": item.get("genre_ids", []),
        }

    # formats full movie/tv details for the details page
    @staticmethod
    def format_movie_details(data: dict) -> dict:
        # extract trailer prefer official YouTube trailers
        videos = data.get("videos", {}).get("results", [])
        trailer = next(
            (v for v in videos if v.get("type") == "Trailer" and v.get("site") == "YouTube" and v.get("official")),
            next((v for v in videos if v.get("type") == "Trailer" and v.get("site") == "YouTube"), None)
        )

        # extract cast (top 20) and directors/creators from crew
        credits = data.get("credits", {})
        cast = [
            {
                "id": c.get("id"),
                "name": c.get("name"),
                "character": c.get("character"),
                "profile_path": c.get("profile_path"),
                "order": c.get("order"),
            }
            for c in credits.get("cast", [])[:20]
        ]
        directors = [
            {
                "id":   c.get("id"),
                "name": c.get("name"),
                "job":  c.get("job"),
            }
            for c in credits.get("crew", [])
            if c.get("job") in ("Director", "Creator", "Executive Producer")
        ]

        return {
            "id": data.get("id"),
            "title": data.get("title") or data.get("name"),
            "tagline": data.get("tagline"),
            "overview": data.get("overview"),
            "poster_path": data.get("poster_path"),
            "backdrop_path": data.get("backdrop_path"),
            "vote_average": data.get("vote_average"),
            "vote_count": data.get("vote_count"),
            "release_date": data.get("release_date") or data.get("first_air_date"),
            "runtime": data.get("runtime"),
            "genres": [g.get("name") for g in data.get("genres", [])],
            "status": data.get("status"),
            "original_language": data.get("original_language"),
            "trailer": {
                "key": trailer.get("key"),
                "name": trailer.get("name"),
            } if trailer else None,
            "cast": cast,
            "directors": directors,
            "images": {
                "backdrops": [img.get("file_path") for img in data.get("images", {}).get("backdrops", [])[:6]],
                "posters": [img.get("file_path") for img in data.get("images", {}).get("posters", [])[:4]],
            }
        }