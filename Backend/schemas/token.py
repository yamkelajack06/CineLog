from pydantic import BaseModel
from datetime import datetime

class Token(BaseModel):
    id: int
    user_id:int
    token_hash:str
    raw_token:str
    expiry: datetime
    request_count: int = 1
    last_request: datetime = datetime.now()
    locked_until: datetime | None = None
