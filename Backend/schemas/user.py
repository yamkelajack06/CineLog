from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserInDB(UserBase):
    id: str
    password_hash: str
    status: str = "unverified"
    failed_login_attempts: int = 0
    lockout_expiry: Optional[datetime] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


