from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class WatchlistEntry(BaseModel):
    id: str
    user_id: str
    tmdb_id: int
    status: str = "want_to_watch"
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class WatchlistEntryCreate(BaseModel):
    tmdb_id: int
    status: str = "want_to_watch"

class WatchlistEntryUpdate(BaseModel):
    status: str

class WatchLog(BaseModel):
    id: str
    user_id: str
    tmdb_id: int
    date_watched: Optional[datetime] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True