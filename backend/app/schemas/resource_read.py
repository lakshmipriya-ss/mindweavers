from pydantic import BaseModel, Field
from typing import Optional, List

class ResourceRead(BaseModel):
    id: int
    department: str
    total: int
    available: int

    class Config:
        orm_mode = True

class ResourceUpdate(BaseModel):
    total: Optional[int] = None
    available: Optional[int] = None
