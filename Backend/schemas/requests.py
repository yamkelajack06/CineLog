from pydantic import BaseModel, EmailStr

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