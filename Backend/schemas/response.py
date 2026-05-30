from pydantic import BaseModel
from typing import Any, Optional

class ApiResponse(BaseModel):
    status: str # "success" or "error"
    message: Optional[str] = None
    data: Optional[Any] = None
