class MovieService:
    #user searches movie by title
    @staticmethod
    def search_movies(query: str):
        pass

    #user gets details of a specific movie
    @staticmethod
    def get_movie_details(movie_id: int):
        pass

    #gets trending movies
    @staticmethod    
    def get_trending_movies():
        pass

    #get top rated movies
    @staticmethod
    def get_top_rated_movies():
        pass

    #get movie by actor/director
    @staticmethod
    def get_movies_by_person(name: str):
        pass

    #gets movies by genre
    @staticmethod
    def get_movies_by_genre(genre: str):
        pass

    #get upcoming releases
    @staticmethod
    def get_upcoming_movies():
        pass

    #gets movies by release year
    @staticmethod
    def get_movies_by_year(year: int):
        pass

    #gets popular movies
    @staticmethod
    def get_popular_movies():
        pass 

    #gets similar movies to the searches/viewed movie
    @staticmethod
    def get_similar_movies(movie_id: int):
        pass

    #gets personalized movie recommendations based on user preferences and viewing history
    @staticmethod
    def get_movie_recommendations(user_id: int):
        pass