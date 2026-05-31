from datetime import datetime
from schemas.user import UserInDB
from schemas.response import ApiResponse
from utilities.general_utils import General_Utils
from database.database import Database

class Login:

    @staticmethod
    def login_user(email: str, password: str) -> ApiResponse:
        try:
            # Fetch user by email
            result = Database.query(
                "SELECT id, username, email, password_hash, status, failed_login_attempts, lockout_expiry FROM users WHERE email = :email",
                {"email": email}
            )

            # User not found
            if result.status != "success" or not result.data:
                return ApiResponse(status="error", message="Invalid email or password")

            user_data = result.data[0]

            # Check if account is locked
            if user_data["lockout_expiry"] and datetime.now() < user_data["lockout_expiry"]:
                remaining = int((user_data["lockout_expiry"] - datetime.now()).total_seconds() / 60)
                return ApiResponse(status="error", message=f"Account locked. Try again in {remaining} minutes")

            # Check if account is verified
            if user_data["status"] == "unverified":
                return ApiResponse(status="error", message="Please verify your account before logging in")

            # Check password
            if not General_Utils.verify_string(password, user_data["password_hash"]):
                # Increment failed login attempts
                new_attempts = user_data["failed_login_attempts"] + 1

                # Lock account after 5 failed attempts
                if new_attempts >= 5:
                    Database.query(
                        "UPDATE users SET failed_login_attempts = :attempts, lockout_expiry = NOW() + INTERVAL '1 hour' WHERE id = :id",
                        {"attempts": new_attempts, "id": user_data["id"]}
                    )
                    return ApiResponse(status="error", message="Too many failed attempts. Account locked for 1 hour")

                Database.query(
                    "UPDATE users SET failed_login_attempts = :attempts WHERE id = :id",
                    {"attempts": new_attempts, "id": user_data["id"]}
                )
                return ApiResponse(status="error", message="Invalid email or password")

            # Reset failed attempts on successful login
            Database.query(
                "UPDATE users SET failed_login_attempts = 0, lockout_expiry = NULL WHERE id = :id",
                {"id": user_data["id"]}
            )

            # Build and return user object
            user = UserInDB(
                id=user_data["id"],
                username=user_data["username"],
                email=user_data["email"],
                password_hash=user_data["password_hash"],
                status=user_data["status"],
                failed_login_attempts=0,
                lockout_expiry=None,
                created_at=user_data.get("created_at")
            )

            return ApiResponse(status="success", message="Login successful", data=user.model_dump())

        except Exception as e:
            return ApiResponse(status="error", message=str(e))