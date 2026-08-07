from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any, List, Optional
import uvicorn
import os
from agents import process_incident, load_historical_data
from vision_agent import VisionAgent

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
    vision_context: Optional[dict] = None

class VisionInput(BaseModel):
    tweet_id: str
    media_url: str

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
        # If vision context is provided, we append it to the text for the LLM / fallback
        enhanced_text = tweet.text
        if tweet.vision_context:
            enhanced_text += f" | Vision AI Data: {tweet.vision_context}"
            
        result = process_incident(enhanced_text, tweet.vision_context)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/vision/analyze")
def analyze_vision_endpoint(vision_req: VisionInput):
    """
    YOLO11 and GeoCLIP analysis of tweet image.
    """
    try:
        result = VisionAgent.analyze_image(vision_req.tweet_id, vision_req.media_url)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/historical_lessons")
def get_historical_lessons():
    return {"lessons": load_historical_data(max_lessons=15)}

if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
