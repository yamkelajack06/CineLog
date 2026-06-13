from fastapi import APIRouter
from schemas.response import ApiResponse
from schemas.requests import (
    UpdateUsernameRequest,
    UpdateEmailRequest,
    UpdatePasswordRequest,
    DeleteAccountRequest,
)
from services.account_service import Account_Service

router = APIRouter(prefix="/account", tags=["Account"])


@router.get("/{user_id}", response_model=ApiResponse)
def handle_get_profile(user_id: str) -> ApiResponse:
    return Account_Service.get_profile(user_id)


@router.patch("/{user_id}/username", response_model=ApiResponse)
def handle_update_username(user_id: str, request: UpdateUsernameRequest) -> ApiResponse:
    return Account_Service.update_username(user_id, request.username)


@router.patch("/{user_id}/email", response_model=ApiResponse)
def handle_update_email(user_id: str, request: UpdateEmailRequest) -> ApiResponse:
    return Account_Service.update_email(user_id, request.email)


@router.patch("/{user_id}/password", response_model=ApiResponse)
def handle_update_password(user_id: str, request: UpdatePasswordRequest) -> ApiResponse:
    return Account_Service.update_password(user_id, request.current_password, request.new_password)


@router.delete("/{user_id}", response_model=ApiResponse)
def handle_delete_account(user_id: str, request: DeleteAccountRequest) -> ApiResponse:
    return Account_Service.delete_account(user_id, request.password)