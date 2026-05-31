from pydantic import BaseModel, EmailStr

class ResendTokenRequest(BaseModel):
    email: EmailStr