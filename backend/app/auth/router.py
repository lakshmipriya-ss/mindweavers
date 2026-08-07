from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..schemas.user import UserCreate, UserRead
from ..models import User
from ..database.database import get_db
from ..auth.security import get_password_hash, create_access_token, verify_password
from datetime import timedelta

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UserRead)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed = get_password_hash(user_in.password)
    db_user = User(email=user_in.email, hashed_password=hashed)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/login")
def login(form_data: UserCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.email).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = create_access_token({"sub": user.email}, expires_delta=timedelta(minutes=1440))
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/refresh")
def refresh(token: str = Depends(...)):
    # Placeholder: In a real app you'd verify a refresh token and issue a new access token.
    raise HTTPException(status_code=501, detail="Refresh not implemented")
