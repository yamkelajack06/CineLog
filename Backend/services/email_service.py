from schemas.response import ApiResponse
from schemas.user import User
from schemas.token import Token
from utilities.email_utils import Email_Utils


class Email_Service:
    #store and track pending tokens
    pending_tokens:list[Token] = []

    #sends verification email to user
    @staticmethod
    def send_verification_email(user: User, token:Token) -> ApiResponse:
        SENDER_EMAIL = "mjaaathedev@gmail.com"
        MESSAGE = ""
        TOKEN_TYPE = "Verification Token"
        token = Email_Utils.generate_token()

        result = Email_Utils.send_email(SENDER_EMAIL, user.email, MESSAGE, TOKEN_TYPE, token.raw_token,token.expiry)

        if result.status_code != 200:
            return ApiResponse(status = "error", message = "sending email failed}", data = result.json)
        else:
            #store the token and keep track of it
            Email_Service.pending_tokens.append(token)

            #schedule the deletion of the token after expiry period has passed

    #handles the resending of an email token
    @staticmethod
    def resend_verification_email(user: User, token:Token) -> ApiResponse:
        pass