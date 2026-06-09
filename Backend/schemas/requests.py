from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class ResendTokenRequest(BaseModel):
    email: EmailStr

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class VerifyTokenRequest(BaseModel):
    email: EmailStr
    token: str

class PasswordResetRequestRequest(BaseModel):
    email: EmailStr

class PasswordResetVerifyRequest(BaseModel):
    email: EmailStr
    token: str
    new_password: str

class AddToWatchlistRequest(BaseModel):
    tmdb_id: int
    status: str = "want_to_watch"
    # tmdb item data to cache locally
    title: str
    poster_url: Optional[str] = None
    release_year: Optional[int] = None
    overview: Optional[str] = None
    media_type: str = "movie"

class UpdateWatchlistRequest(BaseModel):
    status: str

class LogWatchRequest(BaseModel):
    tmdb_id: int
    date_watched: Optional[datetime] = None