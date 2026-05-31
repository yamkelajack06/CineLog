from fastapi import APIRouter
from schemas.response import ApiResponse
from schemas.user import User
from schemas.requests import ResendTokenRequest
from services.register import Register
from services.email_service import Email_Service
from database.database import Database

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=ApiResponse)
async def handle_registration(user: User) -> ApiResponse:
    # Register the user in the database
    register_result = Register.register_user(user)

    # Return immediately if registration failed
    if register_result.status == "error":
        return register_result

    # Fetch the newly created user ID from the database
    user_query = Database.query(
        "SELECT id FROM users WHERE email = :email", 
        {"email": user.email}
    )
    
    # Update the user object with the fetched ID
    if user_query.status == "success" and user_query.data:
        user.id = user_query.data[0]["id"]
    else:
        return ApiResponse(status="error", message="Registration succeeded, but failed to initialize email verification.")

    # Send the verification email asynchronously
    email_result = await Email_Service.send_verification_email(user)

    # Handle email sending failure
    if email_result.status == "error":
        return ApiResponse(status="success", message="User registered successfully, but failed to send verification email. Please request a new token.")

    # Return final success response
    return ApiResponse(status="success", message="User registered successfully. Please check your email for the verification token.")


@router.post("/resend-token", response_model=ApiResponse)
async def handle_resend_token(request: ResendTokenRequest) -> ApiResponse:
    # Look up the user by their email address
    user_query = Database.query(
        "SELECT id, username, email, status FROM users WHERE email = :email",
        {"email": request.email}
    )

    # Return a generic message to prevent email enumeration attacks
    if user_query.status != "success" or not user_query.data:
        return ApiResponse(status="success", message="If that email is registered, a new token has been sent.")

    user_data = user_query.data[0]

    # Prevent sending tokens to accounts that are already verified
    if user_data["status"] == "verified":
        return ApiResponse(status="error", message="This account is already verified.")

    # Reconstruct the user object for the email service
    target_user = User(
        id=user_data["id"],
        username=user_data["username"],
        email=user_data["email"]
    )

    # Trigger the email service to resend the token
    return await Email_Service.resend_verification_email(target_user)