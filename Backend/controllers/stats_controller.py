from fastapi import APIRouter
from schemas.response import ApiResponse
from services.dashboard_service import Dashboard_Service

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/{user_id}", response_model=ApiResponse)
def handle_get_dashboard(user_id: str) -> ApiResponse:
    return Dashboard_Service.get_dashboard(user_id)