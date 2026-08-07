from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class UserCreate(BaseModel):
    email: EmailStr = Field(..., example="user@example.com")
    password: str = Field(..., min_length=6, example="strongpassword")

class UserRead(BaseModel):
    id: int
    email: EmailStr
    is_active: bool

    class Config:
        orm_mode = True
