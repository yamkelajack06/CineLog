import asyncio
from datetime import datetime, timedelta
from schemas.response import ApiResponse
from schemas.user import UserInDB
from schemas.token import Token
from services.token_service import Token_Service
from database.database import Database
class Email_Service:
    #store and track pending verification and reset tokens separately
    pending_verification_tokens: dict[str, Token] = {}
    pending_reset_tokens: dict[str, Token] = {}

    #sends verification email to user
    @staticmethod
    async def send_verification_email(user: UserInDB) -> ApiResponse:
        TOKEN_TYPE = "Verification Token"
        token = Token_Service.generate_token(user)
        now = datetime.now()
        expiry_str = (now + timedelta(minutes=5)).strftime("%Y-%m-%d %H:%M:%S")
        result = Token_Service.send_email(user.email, TOKEN_TYPE, token.raw_token,expiry_str)

        if result.status_code != 200:
            return ApiResponse(status = "error", message = "sending email failed", data = result.json())
        else:
            #store and track valid tokens
            Email_Service.pending_verification_tokens[user.id] = token

            # Save to database
            Database.query(
                "INSERT INTO verification_tokens (id, user_id, token_hash, expires_at) VALUES (:id, :user_id, :token_hash, :expiry)",
                {
                    "id": token.id,
                    "user_id": token.user_id,
                    "token_hash": token.token_hash,
                    "expiry": token.expiry
                }
            )

            asyncio.create_task(Email_Service.expire_token(user.id, token.raw_token))
            return ApiResponse(status="success", message="Verification email sent")

    #handles the resending of an email token
    @staticmethod
    async def resend_verification_email(user: UserInDB) -> ApiResponse:
        now = datetime.now()
        state = Email_Service.pending_verification_tokens.get(user.id)

        # send email if the user has no pending ones
        if not state:
            return await Email_Service.send_verification_email(user)

        if state:
            # check lockout
            if state.locked_until and now < state.locked_until:
                remaining = int((state.locked_until - now).total_seconds() / 60)
                return ApiResponse(status="error", message=f"Account locked. Try again in {remaining} minutes")

            # check 2 minute cooldown period
            if (now - state.last_request).total_seconds() < 120:
                return ApiResponse(status="error", message="Please wait 2 minutes before requesting a new token")

            # check max requests
            if state.request_count >= 3:
                state.locked_until = now + timedelta(hours=1)
                state.request_count = 0
                return ApiResponse(status="error", message="Too many requests. Account locked for 1 hour")

            # delete the old token and send new one
            Email_Service.pending_verification_tokens.pop(user.id, None)
            Database.query("DELETE FROM verification_tokens WHERE user_id = :user_id", {"user_id": user.id})
            return await Email_Service.send_verification_email(user)
        
    @staticmethod
    async def expire_token(user_id: str, raw_token: str):
        await asyncio.sleep(300)
        current_token = Email_Service.pending_verification_tokens.get(user_id)

        # Only delete if it's the exact same token that started this timer
        if current_token and current_token.raw_token == raw_token:
            Email_Service.pending_verification_tokens.pop(user_id, None)
            Database.query("DELETE FROM verification_tokens WHERE user_id = :user_id", {"user_id": user_id})
    
    #sends password reset email to user
    @staticmethod
    async def send_reset_token(user: UserInDB) -> ApiResponse:
        TOKEN_TYPE = "Password Reset Token"
        token = Token_Service.generate_token(user)
        now = datetime.now()
        expiry_str = (now + timedelta(minutes=5)).strftime("%Y-%m-%d %H:%M:%S")
        result = Token_Service.send_reset_email(user.email, TOKEN_TYPE, token.raw_token, expiry_str)

        if result.status_code != 200:
            return ApiResponse(status = "error", message = "sending email failed", data = result.json())
        else:
            #store and track valid tokens
            Email_Service.pending_reset_tokens[user.id] = token

            # Save to database
            Database.query(
                "INSERT INTO password_reset_tokens (id, user_id, token_hash, expires_at) VALUES (:id, :user_id, :token_hash, :expiry)",
                {
                    "id": token.id,
                    "user_id": token.user_id,
                    "token_hash": token.token_hash,
                    "expiry": token.expiry
                }
            )

            asyncio.create_task(Email_Service.expire_reset_token(user.id, token.raw_token))
            return ApiResponse(status="success", message="Password reset email sent")

    #handles the resending of a password reset token
    @staticmethod
    async def resend_reset_token(user: UserInDB) -> ApiResponse:
        now = datetime.now()
        state = Email_Service.pending_reset_tokens.get(user.id)

        # send email if the user has no pending ones
        if not state:
            return await Email_Service.send_reset_token(user)

        if state:
            # check lockout
            if state.locked_until and now < state.locked_until:
                remaining = int((state.locked_until - now).total_seconds() / 60)
                return ApiResponse(status="error", message=f"Account locked. Try again in {remaining} minutes")

            # check 2 minute cooldown period
            if (now - state.last_request).total_seconds() < 120:
                return ApiResponse(status="error", message="Please wait 2 minutes before requesting a new token")

            # check max requests
            if state.request_count >= 3:
                state.locked_until = now + timedelta(hours=1)
                state.request_count = 0
                return ApiResponse(status="error", message="Too many requests. Account locked for 1 hour")

            # delete the old token and send new one
            Email_Service.pending_reset_tokens.pop(user.id, None)
            Database.query("DELETE FROM password_reset_tokens WHERE user_id = :user_id", {"user_id": user.id})
            return await Email_Service.send_reset_token(user)

    @staticmethod
    async def expire_reset_token(user_id: str, raw_token: str):
        await asyncio.sleep(300)
        current_token = Email_Service.pending_reset_tokens.get(user_id)

        # Only delete if it's the exact same token that started this timer
        if current_token and current_token.raw_token == raw_token:
            Email_Service.pending_reset_tokens.pop(user_id, None)
            Database.query("DELETE FROM password_reset_tokens WHERE user_id = :user_id", {"user_id": user_id})