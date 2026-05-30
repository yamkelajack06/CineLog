import asyncio
from datetime import datetime, timedelta
from schemas.response import ApiResponse
from schemas.user import User
from schemas.token import Token
from utilities.email_utils import Email_Utils
from database.database import Database


class Email_Service:
    #store and track pending tokens
    pending_tokens: dict[str, Token] = {}

    #sends verification email to user
    @staticmethod
    async def send_verification_email(user: User) -> ApiResponse:
        SENDER_EMAIL = "mjaaathedev@gmail.com"
        TOKEN_TYPE = "Verification Token"
        token = Email_Utils.generate_token(user)
        now = datetime.now()
        expiry_str = (now + timedelta(minutes=5)).strftime("%Y-%m-%d %H:%M:%S")
        result = Email_Utils.send_email(SENDER_EMAIL, user.email, TOKEN_TYPE, token.raw_token,expiry_str)

        if result.status_code != 200:
            return ApiResponse(status = "error", message = "sending email failed", data = result.json())
        else:
            #store and track valid tokens
            Email_Service.pending_tokens[user.id] = token
            asyncio.create_task(Email_Service.expire_token(user.id))
            return ApiResponse(status="success", message="Verification email sent")

    #handles the resending of an email token
    @staticmethod
    async def resend_verification_email(user: User) -> ApiResponse:
        now = datetime.now()
        state = Email_Service.pending_tokens.get(user.id)

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
            Email_Service.pending_tokens.pop(user.id, None)
            return await Email_Service.send_verification_email(user)
        
    @staticmethod
    async def expire_token(user_id: str):
        await asyncio.sleep(300)
        Email_Service.pending_tokens.pop(user_id, None)