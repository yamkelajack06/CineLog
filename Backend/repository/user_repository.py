from schemas.response import ApiResponse
from database.database import Database
from schemas.user import UserBase

class User_Repository:
    
    @staticmethod
    def check_user_exists(user: UserBase) -> bool | ApiResponse:
        try:
            result = Database.query(
                "SELECT 1 FROM users WHERE username = :username OR email = :email",
                {
                    "username": user.username,
                    "email": user.email
                }
            )

            if result.status != "success":
                return ApiResponse(status="error", message=result.message)

            return bool(result.data)  # True if user exists, False if not

        except Exception as e:
            return ApiResponse(status="error", message=str(e))

