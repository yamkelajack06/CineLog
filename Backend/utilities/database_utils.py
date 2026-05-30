from schemas.response import ApiResponse
from database.database import Database
from schemas.user import User

class Database_Utils:
    
    @staticmethod
    def check_user_exists(user:User) -> bool:
        pass

    def generate_unique_id() -> int:
        pass

    def hash_password(password:str) -> str:
        pass