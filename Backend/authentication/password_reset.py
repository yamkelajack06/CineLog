from datetime import datetime
from schemas.user import UserInDB
from schemas.response import ApiResponse
from utilities.general_utils import General_Utils
from utilities.email_utils import Email_Utils
from services.email_service import Email_Service
from database.database import Database

class PasswordReset:

    @staticmethod
    async def request_reset(email: str) -> ApiResponse:
        try:
            # Fetch user by email
            result:ApiResponse = Database.query(
                "SELECT id, username, email, password_hash, status FROM users WHERE email = :email",
                {"email": email}
            )

            # Return generic message to prevent email enumeration attacks
            if result.status != "success" or not result.data:
                return ApiResponse(status="success", message="If that email is registered, a password reset token has been sent.")

            user_data = result.data[0]

            # Check if user is verified
            if user_data["status"] == "unverified":
                return ApiResponse(status="error", message="Please verify your account before requesting a password reset.")

            # Reconstruct the user object for the email service
            target_user = UserInDB(
                id=user_data["id"],
                username=user_data["username"],
                email=user_data["email"],
                password_hash=user_data["password_hash"],
                status=user_data["status"]
            )

            # Trigger the email service to send reset token
            return await Email_Service.send_reset_token(target_user)

        except Exception as e:
            return ApiResponse(status="error", message=str(e))

    @staticmethod
    def reset_password(email: str, token: str, new_password: str) -> ApiResponse:
        try:
            # Fetch user by email
            result:ApiResponse = Database.query(
                "SELECT id, status FROM users WHERE TRIM(email) = TRIM(:email)",
                {"email": email}
            )

            # User not found
            if result.status != "success" or not result.data:
                return ApiResponse(status="error", message="User not found.")

            user_data = result.data[0]
            user_id = user_data["id"]

            # Verify the reset token
            is_valid = Email_Utils.verify_reset_token(user_id, token)

            if not is_valid:
                return ApiResponse(status="error", message="Invalid or expired token.")

            # Hash the new password
            new_password_hash:str = General_Utils.hash_string(new_password)

            # Update the password in the database
            update_query:ApiResponse = Database.query(
                "UPDATE users SET password_hash = :password_hash WHERE id = :id",
                {
                    "id": user_id,
                    "password_hash": new_password_hash
                }
            )

            if update_query.status != "success":
                return ApiResponse(status="error", message="Password reset failed. Please try again.")

            # Account remains verified after successful reset
            return ApiResponse(status="success", message="Password reset successfully. You can now log in with your new password.")

        except Exception as e:
            return ApiResponse(status="error", message=str(e))
