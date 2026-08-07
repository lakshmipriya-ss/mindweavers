from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict

from ..schemas.incident import IncidentRead
from ..models import Incident
from ..database.database import get_db
from ..auth.security import get_current_user

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/statistics")
async def get_statistics(db: Session = Depends(get_db)) -> Dict[str, int]:
    total_incidents = db.query(Incident).count()
    open_incidents = db.query(Incident).filter(Incident.status == "open").count()
    processed_incidents = db.query(Incident).filter(Incident.status == "processed").count()
    return {
        "total_incidents": total_incidents,
        "open_incidents": open_incidents,
        "processed_incidents": processed_incidents,
    }

@router.get("/active")
async def get_active_incidents(db: Session = Depends(get_db)) -> List[IncidentRead]:
    active = db.query(Incident).filter(Incident.status != "resolved").all()
    return active

@router.get("/live")
async def get_live_state():
    # For a real implementation you could pull from Redis or an in‑memory cache.
    # Here we simply return a placeholder indicating the endpoint is alive.
    return {"message": "Live endpoint – connect via WebSocket at /simulation/ws for real‑time updates."}
