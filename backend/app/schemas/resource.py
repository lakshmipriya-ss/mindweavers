from pydantic import BaseModel, Field
from typing import Optional

class ResourceBase(BaseModel):
    department: str = Field(..., example="fire")
    total: int = Field(..., ge=0)
    available: int = Field(..., ge=0)

class ResourceCreate(ResourceBase):
    pass

class ResourceRead(ResourceBase):
    id: int

    class Config:
        orm_mode = True
