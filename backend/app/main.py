import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, incidents, resources, simulation, dashboard
from .core import config, logger as logger_module
from .middleware.request_id import RequestIdMiddleware

# Structured JSON logger (configured in app.core.logger)
logger = logger_module.logger

app = FastAPI(
    title="DisasterFlow Production API",
    version="1.0.0",
    description="Real‑time disaster response simulator with CrewAI agents.",
)

# Middleware to attach a unique request ID to every request
app.add_middleware(RequestIdMiddleware)

# CORS – tighten for production; replace with your real dashboard origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(incidents.router)
app.include_router(resources.router)
app.include_router(simulation.router)
app.include_router(dashboard.router)

# Startup event – create DB tables if they don't exist
@app.on_event("startup")
async def on_startup():
    from .database.database import engine, Base
    logger.info("Creating database tables if needed...")
    Base.metadata.create_all(bind=engine)
    logger.info("Startup complete.")

# Simple health‑check endpoint
@app.get("/health")
async def health_check():
    return {"status": "ok"}
