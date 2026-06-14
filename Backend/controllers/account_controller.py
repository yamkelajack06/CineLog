from fastapi import APIRouter, Depends, HTTPException
from schemas.response import ApiResponse
from schemas.requests import (
    UpdateUsernameRequest,
    UpdateEmailRequest,
    UpdatePasswordRequest,
    DeleteAccountRequest,
)
from services.account_service import Account_Service

from utilities.auth_middleware import get_current_user

router = APIRouter(prefix="/account", tags=["Account"])


def _require_self(user_id: str, current_user: dict) -> None:
    # ensure user can only modify their own account
    if current_user["sub"] != user_id:
        raise HTTPException(status_code=403, detail="Access denied")


@router.get("/{user_id}", response_model=ApiResponse)
def handle_get_profile(user_id: str, current_user: dict = Depends(get_current_user)) -> ApiResponse:
    _require_self(user_id, current_user)
    return Account_Service.get_profile(user_id)


@router.patch("/{user_id}/username", response_model=ApiResponse)
def handle_update_username(user_id: str, request: UpdateUsernameRequest, current_user: dict = Depends(get_current_user)) -> ApiResponse:
    _require_self(user_id, current_user)
    return Account_Service.update_username(user_id, request.username)


@router.patch("/{user_id}/email", response_model=ApiResponse)
def handle_update_email(user_id: str, request: UpdateEmailRequest, current_user: dict = Depends(get_current_user)) -> ApiResponse:
    _require_self(user_id, current_user)
    return Account_Service.update_email(user_id, request.email)


@router.patch("/{user_id}/password", response_model=ApiResponse)
def handle_update_password(user_id: str, request: UpdatePasswordRequest, current_user: dict = Depends(get_current_user)) -> ApiResponse:
    _require_self(user_id, current_user)
    return Account_Service.update_password(user_id, request.current_password, request.new_password)


@router.delete("/{user_id}", response_model=ApiResponse)
def handle_delete_account(user_id: str, request: DeleteAccountRequest, current_user: dict = Depends(get_current_user)) -> ApiResponse:
    _require_self(user_id, current_user)
    return Account_Service.delete_account(user_id, request.password)

