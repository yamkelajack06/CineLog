from fastapi import Header, HTTPException
from services.jwt_service import JWT_Service


def get_current_user(authorization: str = Header(...)) -> dict:
    """
    Extracts and validates the Bearer token.
    Raises 401 if missing or invalid, so no route logic needs to handle it.
    """
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header format")

    token = authorization.removeprefix("Bearer ").strip()
    payload = JWT_Service.decode_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    return payload