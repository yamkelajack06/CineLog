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

        params = {
            "append_to_response": "videos,images"
        }

        try:
            response = requests.get(BASE_URL + endpoint, headers=headers, params=params)
            print("making api call...")
            #if network call fails return immediately
            if response.status_code != 200:
                return ApiResponse(status = "error", message= f"Error: API call failed. Status = {response.status_code}")
        
        except Exception as e:
            return ApiResponse(status="error", message=str(e))
    
        return ApiResponse(status = "success", message = "Data loaded successfully", data = response.text)
    
    #formats movie data for the feed
    @staticmethod
    def format_feed_data(movie_data):
        pass

    #formats movie details for the details page
    @staticmethod
    def format_movie_details(movie_data):
        pass