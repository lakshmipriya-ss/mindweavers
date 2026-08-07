from pydantic import BaseModel, Field
from typing import Optional, List, Dict

class IncidentCreate(BaseModel):
    tweet_text: str = Field(..., example="Massive fire at downtown mall!")
    type: Optional[str] = None
    severity: Optional[int] = None
    location: Optional[str] = None
    casualties: Optional[int] = None
    required_agents: Optional[List[str]] = None

class IncidentRead(BaseModel):
    id: int
    tweet_text: str
    type: Optional[str]
    severity: Optional[int]
    location: Optional[str]
    casualties: Optional[int]
    required_agents: Optional[List[str]]
    status: str
    created_at: str
    updated_at: str

    class Config:
        orm_mode = True
