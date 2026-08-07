from fastapi import APIRouter, HTTPException, status

router = APIRouter()

@router.post("/login")
async def login(username: str, password: str):
    # Simple placeholder authentication – replace with real auth logic in production
    if username == "admin" and password == "admin":
        return {"access_token": "dummy-token", "token_type": "bearer"}
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
