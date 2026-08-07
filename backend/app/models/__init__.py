from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database.database import Base
import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    # Relationships
    incidents = relationship("Incident", back_populates="reporter")

class Incident(Base):
    __tablename__ = "incidents"
    id = Column(Integer, primary_key=True, index=True)
    tweet_text = Column(String, nullable=False)
    type = Column(String, nullable=True)
    severity = Column(Integer, nullable=True)
    location = Column(String, nullable=True)
    casualties = Column(Integer, nullable=True)
    required_agents = Column(JSON, nullable=True)  # list of strings e.g., ["fire","medical"]
    status = Column(String, default="open")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    reporter_id = Column(Integer, ForeignKey("users.id"))
    reporter = relationship("User", back_populates="incidents")
    # Agent logs relationship
    agent_logs = relationship("AgentLog", back_populates="incident", cascade="all, delete-orphan")

class Resource(Base):
    __tablename__ = "resources"
    id = Column(Integer, primary_key=True, index=True)
    department = Column(String, nullable=False)  # fire, police, medical, hospital
    total = Column(Integer, nullable=False)
    available = Column(Integer, nullable=False)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class FireUnit(Base):
    __tablename__ = "fire_units"
    id = Column(Integer, primary_key=True, index=True)
    unit_name = Column(String, nullable=False)
    status = Column(String, default="idle")
    location = Column(String, nullable=True)

class PoliceUnit(Base):
    __tablename__ = "police_units"
    id = Column(Integer, primary_key=True, index=True)
    unit_name = Column(String, nullable=False)
    status = Column(String, default="idle")
    location = Column(String, nullable=True)

class Ambulance(Base):
    __tablename__ = "ambulances"
    id = Column(Integer, primary_key=True, index=True)
    vehicle_id = Column(String, nullable=False)
    status = Column(String, default="idle")
    location = Column(String, nullable=True)

class Hospital(Base):
    __tablename__ = "hospitals"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    icu_beds_total = Column(Integer, nullable=False)
    icu_beds_available = Column(Integer, nullable=False)
    address = Column(String, nullable=True)

class AgentLog(Base):
    __tablename__ = "agent_logs"
    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(Integer, ForeignKey("incidents.id"))
    agent_name = Column(String, nullable=False)
    step = Column(String, nullable=False)
    output = Column(JSON, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    incident = relationship("Incident", back_populates="agent_logs")

class SimulationLog(Base):
    __tablename__ = "simulation_logs"
    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(Integer, ForeignKey("incidents.id"), nullable=True)
    event = Column(String, nullable=False)
    payload = Column(JSON, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

class TrafficRoute(Base):
    __tablename__ = "traffic_routes"
    id = Column(Integer, primary_key=True, index=True)
    route_name = Column(String, nullable=False)
    congestion_level = Column(Integer, nullable=False)  # 0–10
    suggested_action = Column(String, nullable=True)

class HospitalCapacity(Base):
    __tablename__ = "hospital_capacity"
    id = Column(Integer, primary_key=True, index=True)
    hospital_id = Column(Integer, ForeignKey("hospitals.id"))
    icu_beds_available = Column(Integer, nullable=False)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True, index=True)
    message = Column(String, nullable=False)
    severity = Column(Integer, default=1)  # 1–5
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    read = Column(Boolean, default=False)
