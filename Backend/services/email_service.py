from schemas.response import ApiResponse
from schemas.user import User

class Email_Service:
    @staticmethod
    #sends verification email to user
    def send_verification_email(user: User) -> ApiResponse:
        pass