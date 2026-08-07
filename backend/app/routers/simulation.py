from fastapi import APIRouter, Depends, HTTPException, status, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
import asyncio
from typing import Dict, Any, List

from ..schemas.incident import IncidentCreate, IncidentRead
from ..models import Incident, AgentLog
from ..database.database import get_db
from ..auth.security import get_current_user
from ..services.crew_service import run_crew
from ..websocket.manager import ConnectionManager

router = APIRouter(prefix="/simulation", tags=["simulation"])

# Global simulation state (in‑memory for the demo; in production you could store in Redis)
simulation_running = False
manager = ConnectionManager()

@router.post("/start")
async def start_simulation(db: Session = Depends(get_db)):
    global simulation_running
    if simulation_running:
        raise HTTPException(status_code=400, detail="Simulation already running")
    simulation_running = True
    return {"status": "started"}

@router.post("/pause")
async def pause_simulation():
    global simulation_running
    if not simulation_running:
        raise HTTPException(status_code=400, detail="Simulation not running")
    simulation_running = False
    return {"status": "paused"}

@router.post("/reset")
async def reset_simulation(db: Session = Depends(get_db)):
    global simulation_running
    simulation_running = False
    # Delete all incidents and logs – caution in prod!
    db.query(Incident).delete()
    db.query(AgentLog).delete()
    db.commit()
    await manager.broadcast({"event": "simulation_reset"})
    return {"status": "reset"}

@router.post("/mock-twitter")
async def mock_twitter(payload: Dict[str, Any], db: Session = Depends(get_db)):
    """Endpoint hit by n8n's Mock Twitter workflow.
    It creates an Incident, runs the CrewAI crew, stores AgentLogs, and pushes updates via WebSocket.
    """
    # 1️⃣ Persist raw tweet as Incident (minimal fields; Crew will enrich later)
    incident = Incident(tweet_text=payload.get("text", ""), status="open")
    db.add(incident)
    db.commit()
    db.refresh(incident)
    
    # Broadcast new incident arrival
    await manager.broadcast({"event": "new_incident", "incident_id": incident.id, "text": incident.tweet_text})

    # Wrapper to automatically attach incident_id to agent updates
    async def broadcast_fn(msg: dict):
        msg["incident_id"] = incident.id
        await manager.broadcast(msg)

    # 2️⃣ Run CrewAI orchestration (non‑blocking for demo – we await it here)
    crew_result = await run_crew(payload, incident.id, db, broadcast_fn=broadcast_fn)

    # 3️⃣ Broadcast final result to all WS clients
    await manager.broadcast({"event": "crew_result", "incident_id": incident.id, "output": crew_result})

    return {"status": "processed", "incident_id": incident.id, "crew_output": crew_result}


@router.get("/incidents")
async def list_incidents(db: Session = Depends(get_db)) -> List[Dict]:
    """Return all incidents with their agent logs for dashboard initial load."""
    incidents = db.query(Incident).order_by(Incident.id.desc()).limit(50).all()
    result = []
    for inc in incidents:
        logs = db.query(AgentLog).filter(AgentLog.incident_id == inc.id).all()
        result.append({
            "id": inc.id,
            "tweet": inc.tweet_text,
            "status": inc.status,
            "agents": [
                {"agent": log.agent_name, "output": log.output}
                for log in logs
            ],
        })
    return result


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """Persistent WebSocket connection for the real-time dashboard."""
    await manager.connect(websocket)
    try:
        # Send a welcome/handshake message
        await manager.send_personal_message(
            {"event": "connected", "message": "DisasterFlow live feed connected."},
            websocket,
        )
        while True:
            # Keep alive – dashboard pushes come from broadcast_fn
            await asyncio.sleep(10)
            await manager.send_personal_message({"event": "ping"}, websocket)
    except WebSocketDisconnect:
        await manager.disconnect(websocket)
    except Exception:
        await manager.disconnect(websocket)
