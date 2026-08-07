from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any, List, Optional
import uvicorn
import os
from agents import process_incident, load_historical_data

app = FastAPI(title="Mindweavers Disaster Response Multi-Agent API")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TweetInput(BaseModel):
    id: str
    text: str
    timestamp: Optional[str] = "Just now"

class SimulationResponse(BaseModel):
    incident_type: str
    severity: str
    location: str
    latitude: Optional[float] = 0.0
    longitude: Optional[float] = 0.0
    strategic_priority: str = "Standard response"
    department_responses: Optional[dict] = {}
    historical_lessons: Optional[str] = ""
    flowchart_mermaid: Optional[str] = ""

@app.get("/")
def read_root():
    return {"status": "online", "message": "Mindweavers Multi-Agent Emergency Response API"}

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "disasterflow-backend"}

@app.post("/process_incident", response_model=SimulationResponse)
def process_incident_endpoint(tweet: TweetInput):
    """
    Main multi-agent pipeline: takes raw disaster report, runs triage,
    queries domain agents (Fire, Medical, Police, Hazmat, Public Works),
    and synthesizes coordinator strategic directives.
    """
    try:
        result = process_incident(tweet.text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/historical_lessons")
def get_historical_lessons():
    return {"lessons": load_historical_data(max_lessons=15)}

if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
