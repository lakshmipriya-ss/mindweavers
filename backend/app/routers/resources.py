from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from ..schemas.resource import ResourceCreate, ResourceBase
from ..schemas.resource_read import ResourceRead, ResourceUpdate
from ..models import Resource
from ..database.database import get_db
from ..auth.security import get_current_user

router = APIRouter(prefix="/resources", tags=["resources"], dependencies=[Depends(get_current_user)])

@router.get("/", response_model=List[ResourceRead])
def get_all_resources(db: Session = Depends(get_db)):
    return db.query(Resource).all()

@router.get("/{resource_id}", response_model=ResourceRead)
def get_resource(resource_id: int, db: Session = Depends(get_db)):
    res = db.query(Resource).filter(Resource.id == resource_id).first()
    if not res:
        raise HTTPException(status_code=404, detail="Resource not found")
    return res

@router.patch("/{resource_id}", response_model=ResourceRead)
def update_resource(resource_id: int, payload: ResourceUpdate, db: Session = Depends(get_db)):
    res = db.query(Resource).filter(Resource.id == resource_id).first()
    if not res:
        raise HTTPException(status_code=404, detail="Resource not found")
    if payload.total is not None:
        res.total = payload.total
    if payload.available is not None:
        res.available = payload.available
    db.commit()
    db.refresh(res)
    return res
