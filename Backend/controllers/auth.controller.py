from fastapi import APIRouter
from schemas.response import ApiResponse
from schemas.user import UserCreate, UserInDB
from schemas.requests import (
    ResendTokenRequest,
    VerifyTokenRequest,
    PasswordResetRequestRequest,
    PasswordResetVerifyRequest,
    LoginRequest,
)
from authentication.register import Register
from services.email_service import Email_Service
from database.database import Database
from authentication.login import Login
from utilities.email_utils import Email_Utils
from authentication.password_reset import PasswordReset

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=ApiResponse)
async def handle_registration(user: UserCreate) -> ApiResponse:
    # Register the user in the database
    register_result:ApiResponse = Register.register_user(user)

    # Return immediately if registration failed
    if register_result.status == "error":
        return register_result

    # Fetch the newly created user ID from the database
    user_query:ApiResponse = Database.query(
        "SELECT id, password_hash FROM users WHERE email = :email", 
        {"email": user.email}
    )
    
    # Update the user object with the fetched ID
    if user_query.status == "success" and user_query.data:
        db_user = UserInDB(
            id=user_query.data[0]["id"],
            username=user.username,
            email=user.email,
            password_hash=user_query.data[0]["password_hash"]
        )
    else:
        return ApiResponse(status="error", message="Registration succeeded, but failed to initialize email verification.")

    # Send the verification email asynchronously
    email_result = await Email_Service.send_verification_email(db_user)

    # Handle email sending failure
    if email_result.status == "error":
        return ApiResponse(status="success", message="User registered successfully, but failed to send verification email. Please request a new token.")

    # Return final success response
    return ApiResponse(status="success", message="User registered successfully. Please check your email for the verification token.")


@router.post("/resend-token", response_model=ApiResponse)
async def handle_resend_token(request: ResendTokenRequest) -> ApiResponse:
    # Look up the user by their email address
    user_query = Database.query(
        "SELECT id, username, email, status, password_hash FROM users WHERE email = :email",
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
    target_user = UserInDB(
        id=user_data["id"],
        username=user_data["username"],
        email=user_data["email"],
        password_hash=user_data["password_hash"]
    )

    # Trigger the email service to resend the token
    return await Email_Service.resend_verification_email(target_user)

@router.post("/verify-token", response_model=ApiResponse)
async def handle_verify_token(request: VerifyTokenRequest) -> ApiResponse:
    user_query = Database.query(
        "SELECT id, status FROM users WHERE TRIM(email) = TRIM(:email)",
        {"email": request.email}
    )
    
    if user_query.status != "success" or not user_query.data:
        return ApiResponse(status="error", message="User not found.")

    user_data = user_query.data[0]

    if user_data["status"] == "verified":
        return ApiResponse(status="error", message="Account is already verified.")

    # This returns a boolean (True/False)
    is_valid = Email_Utils.verify_token(user_data["id"], request.token)

    # Check the boolean directly
    if is_valid:
        update_query = Database.query(
            "UPDATE users SET status = 'verified' WHERE id = :id", #Update using ID
            {"id": user_data["id"]}
        )
        
        if update_query.status != "success":
            return ApiResponse(status="error", message="Token verified, but failed to update account status.")

        # Return a proper ApiResponse
        return ApiResponse(status="success", message="Account verified successfully.")
        
    # Return a proper ApiResponse if the token is invalid
    return ApiResponse(status="error", message="Invalid or expired token.")

@router.post("/login", response_model=ApiResponse)
async def handle_login(request: LoginRequest) -> ApiResponse:
    return Login.login_user(request.email, request.password)

@router.post("/request-password-reset", response_model=ApiResponse)
async def handle_request_password_reset(request: PasswordResetRequestRequest) -> ApiResponse:
    # Request a password reset token
    return await PasswordReset.request_reset(request.email)

@router.post("/reset-password", response_model=ApiResponse)
async def handle_reset_password(request: PasswordResetVerifyRequest) -> ApiResponse:
    # Reset the password with a valid token
    return PasswordReset.reset_password(request.email, request.token, request.new_password)
