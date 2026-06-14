from fastapi import APIRouter, Depends, HTTPException
from schemas.response import ApiResponse
from services.stats_service import Dashboard_Service
from utilities.auth_middleware import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/{user_id}", response_model=ApiResponse)
def handle_get_dashboard(user_id: str, current_user: dict = Depends(get_current_user)) -> ApiResponse:
    # ensure user can only access their own dashboard
    if current_user["sub"] != user_id:
        raise HTTPException(status_code=403, detail="Access denied")
    return Dashboard_Service.get_dashboard(user_id)

