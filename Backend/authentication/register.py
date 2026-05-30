from database.database import Database
from schemas.response import ApiResponse
from schemas.user import User 
from utilities.database_utils import Database_Utils
from utilities.general_utils import General_Utils

class Register:
    @staticmethod
    def register_user(user:User) -> ApiResponse:
        try:
            #first check if the user exists
            exists:bool| ApiResponse = Database_Utils.check_user_exists(user)

            #if an error occurred return immediately
            if isinstance(exists, ApiResponse):
                return ApiResponse(status = "error", message = "Registration failed, please try again")

            #if not register the user in the database
            if not exists:
                #create user record in the database
                result:ApiResponse = Database.query(
                    "INSERT INTO users (id, username, email, password_hash) VALUES  (:id,:username,:email, :password_hash)",
                    {
                        "id": General_Utils.generate_random_id(), 
                        "username": user.username,
                        "email":user.email,
                        "password_hash": General_Utils.hash_string(user.password) 
                    }
                )

                if result.status == "success":
                    return ApiResponse(status = "success", message = "User registered successfully")
                else:
                    # Map known DB errors to friendly messages for the user
                    if "duplicate key value" in result.message and "users_email_key" in result.message:
                        return ApiResponse(status="error", message="Email already registered")
                    elif "duplicate key value" in result.message and "users_username_key" in result.message:
                        return ApiResponse(status="error", message="Username already taken")
                    else:
                        return ApiResponse(status="error", message="Registration failed, please try again")
                    
        except Exception as e:
            return ApiResponse(status = "error", message = str(e))