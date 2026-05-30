from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class User(BaseModel):
    id: Optional[str] = None   # Optional so frontend doesn’t need to send it
    username: str
    email: EmailStr
    password: str
    status: str
    failed_login_attempts: int
    lockout_expiry: Optional[datetime]
    created_at: datetime

    class Config:
        orm_mode = True


