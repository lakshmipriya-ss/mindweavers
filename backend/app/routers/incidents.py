from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..schemas.incident import IncidentCreate, IncidentRead
from ..models import Incident
from ..database.database import get_db
from ..auth.security import get_current_user

router = APIRouter(prefix="/incidents", tags=["incidents"], dependencies=[Depends(get_current_user)])

@router.post("/create", response_model=IncidentRead)
def create_incident(payload: IncidentCreate, db: Session = Depends(get_db)):
    db_incident = Incident(**payload.dict())
    db.add(db_incident)
    db.commit()
    db.refresh(db_incident)
    return db_incident

@router.get("/all", response_model=List[IncidentRead])
def get_all(db: Session = Depends(get_db)):
    return db.query(Incident).all()

@router.get("/{incident_id}", response_model=IncidentRead)
def get_one(incident_id: int, db: Session = Depends(get_db)):
    inc = db.query(Incident).filter(Incident.id == incident_id).first()
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found")
    return inc

@router.patch("/{incident_id}", response_model=IncidentRead)
def update_incident(incident_id: int, payload: IncidentCreate, db: Session = Depends(get_db)):
    inc = db.query(Incident).filter(Incident.id == incident_id).first()
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found")
    for field, value in payload.dict(exclude_unset=True).items():
        setattr(inc, field, value)
    db.commit()
    db.refresh(inc)
    return inc

@router.delete("/{incident_id}")
def delete_incident(incident_id: int, db: Session = Depends(get_db)):
    inc = db.query(Incident).filter(Incident.id == incident_id).first()
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found")
    db.delete(inc)
    db.commit()
    return {"detail": "Incident deleted"}
