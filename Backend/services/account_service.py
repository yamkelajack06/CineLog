from schemas.response import ApiResponse
from database.database import Database
from utilities.general_utils import General_Utils


class Account_Service:

    # update the user's display name
    @staticmethod
    def update_username(user_id: str, new_username: str) -> ApiResponse:
        try:
            # check if username is already taken by someone else
            conflict = Database.query(
                "SELECT id FROM users WHERE username = :username AND id != :user_id",
                {"username": new_username.strip().lower(), "user_id": user_id}
            )

            if conflict.status == "success" and conflict.data:
                return ApiResponse(status="error", message="Username already taken")

            result = Database.query(
                "UPDATE users SET username = :username WHERE id = :user_id",
                {"username": new_username.strip().lower(), "user_id": user_id}
            )

            if result.status != "success" or result.data == 0:
                return ApiResponse(status="error", message="Failed to update username")

            return ApiResponse(status="success", message="Username updated successfully")

        except Exception as e:
            return ApiResponse(status="error", message=str(e))

    # update the user's email address
    @staticmethod
    def update_email(user_id: str, new_email: str) -> ApiResponse:
        try:
            # check if email is already registered to another account
            conflict = Database.query(
                "SELECT id FROM users WHERE email = :email AND id != :user_id",
                {"email": new_email, "user_id": user_id}
            )

            if conflict.status == "success" and conflict.data:
                return ApiResponse(status="error", message="Email already registered to another account")

            result = Database.query(
                "UPDATE users SET email = :email, status = 'unverified' WHERE id = :user_id",
                {"email": new_email, "user_id": user_id}
            )

            if result.status != "success" or result.data == 0:
                return ApiResponse(status="error", message="Failed to update email")

            # email change requires re-verification
            return ApiResponse(status="success", message="Email updated. Please verify your new email address.")

        except Exception as e:
            return ApiResponse(status="error", message=str(e))

    # update the user's password after verifying the current one
    @staticmethod
    def update_password(user_id: str, current_password: str, new_password: str) -> ApiResponse:
        try:
            # fetch the current password hash to verify against
            result = Database.query(
                "SELECT password_hash FROM users WHERE id = :user_id",
                {"user_id": user_id}
            )

            if result.status != "success" or not result.data:
                return ApiResponse(status="error", message="User not found")

            stored_hash = result.data[0]["password_hash"]

            if not General_Utils.verify_string(current_password, stored_hash):
                return ApiResponse(status="error", message="Current password is incorrect")

            new_hash = General_Utils.hash_string(new_password)

            update = Database.query(
                "UPDATE users SET password_hash = :password_hash WHERE id = :user_id",
                {"password_hash": new_hash, "user_id": user_id}
            )

            if update.status != "success":
                return ApiResponse(status="error", message="Failed to update password")

            return ApiResponse(status="success", message="Password updated successfully")

        except Exception as e:
            return ApiResponse(status="error", message=str(e))

    # permanently delete the user and all associated data
    @staticmethod
    def delete_account(user_id: str, password: str) -> ApiResponse:
        try:
            # require password confirmation before deletion
            result = Database.query(
                "SELECT password_hash FROM users WHERE id = :user_id",
                {"user_id": user_id}
            )

            if result.status != "success" or not result.data:
                return ApiResponse(status="error", message="User not found")

            stored_hash = result.data[0]["password_hash"]

            if not General_Utils.verify_string(password, stored_hash):
                return ApiResponse(status="error", message="Incorrect password")

            # delete all user data in dependency order 
            Database.query("DELETE FROM watch_logs WHERE user_id = :user_id", {"user_id": user_id})
            Database.query("DELETE FROM watchlist_entries WHERE user_id = :user_id", {"user_id": user_id})
            Database.query("DELETE FROM verification_tokens WHERE user_id = :user_id", {"user_id": user_id})
            Database.query("DELETE FROM password_reset_tokens WHERE user_id = :user_id", {"user_id": user_id})

            # delete the user record last
            delete_user = Database.query(
                "DELETE FROM users WHERE id = :user_id",
                {"user_id": user_id}
            )

            if delete_user.status != "success" or delete_user.data == 0:
                return ApiResponse(status="error", message="Failed to delete account")

            return ApiResponse(status="success", message="Account deleted successfully")

        except Exception as e:
            return ApiResponse(status="error", message=str(e))

    # fetch public profile info for a user
    @staticmethod
    def get_profile(user_id: str) -> ApiResponse:
        try:
            result = Database.query(
                "SELECT id, username, email, status, created_at FROM users WHERE id = :user_id",
                {"user_id": user_id}
            )

            if result.status != "success" or not result.data:
                return ApiResponse(status="error", message="User not found")

            return ApiResponse(status="success", data=result.data[0])

        except Exception as e:
            return ApiResponse(status="error", message=str(e))