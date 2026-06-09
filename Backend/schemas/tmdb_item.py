from pydantic import BaseModel
from typing import Optional

class TmdbItemCreate(BaseModel):
    tmdb_id: int
    type: str
    title: str
    poster_url: Optional[str] = None
    release_year: Optional[int] = None
    overview: Optional[str] = None