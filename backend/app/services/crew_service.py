"""
crew_service.py — Production AI Integration.
Runs the real, 100% offline Phi3.5 multi-agent simulator locally.
Integrates with WebSockets and DB persistence for the React Dashboard.
"""
import asyncio
import os
import sys
from typing import Any, Callable, Dict, Optional
from sqlalchemy.orm import Session
from ..models import AgentLog, Incident
from datetime import datetime

# Add the parent backend directory to sys.path to import our custom agents.py
backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from agents import run_local_brain, run_sub_agent

AGENT_ICONS = {
    "Dispatcher": "🧠",
    "Fire": "🚒",
    "Medical": "🚑",
    "Police": "🚔",
    "Hazmat": "☣️",
    "Public Works": "🚧"
}

SEVERITY_MAP = {
    "Low": 3,
    "Medium": 5,
    "High": 7,
    "Critical": 9
}

async def run_crew(
    payload: Dict[str, Any],
    incident_id: int,
    db: Session,
    broadcast_fn: Optional[Callable] = None,
) -> Dict[str, Any]:
    """
    Run all real Phi3.5 AI agents sequentially, broadcasting progress at each step.
    Fully offline – powered by Ollama.
    """
    all_outputs: Dict[str, Any] = {}
    tweet_text = payload.get("text", "")

    # ── 1. Run Dispatcher (Local Brain) ───────────────────────────────
    role = "Dispatcher"
    icon = AGENT_ICONS.get(role, "🧠")
    
    if broadcast_fn:
        await broadcast_fn({
            "event": "agent_update",
            "incident_id": incident_id,
            "agent": role,
            "icon": icon,
            "status": "running",
        })
        
    # Run the real phi3.5 AI
    # We use asyncio.to_thread to prevent the AI blocking the FastAPI event loop
    analysis = await asyncio.to_thread(run_local_brain, tweet_text)
    all_outputs[role] = analysis
    
    # Save to DB
    log = AgentLog(
        incident_id=incident_id,
        agent_name=role,
        step="Strategic Dispatch Analysis",
        output=analysis,
        timestamp=datetime.utcnow(),
    )
    db.add(log)
    db.commit()

    if broadcast_fn:
        await broadcast_fn({
            "event": "agent_update",
            "incident_id": incident_id,
            "agent": role,
            "icon": icon,
            "status": "done",
            "output": analysis,
        })
        
    required_agencies = analysis.get("required_agencies", [])
    if not isinstance(required_agencies, list):
        required_agencies = ["Fire", "Medical", "Police"] # Fallback if AI hallucinates
    
    # ── 2. Run Department Sub-Agents ──────────────────────────────────
    for agency in required_agencies:
        role = agency
        icon = AGENT_ICONS.get(role, "🤖")
        
        if broadcast_fn:
            await broadcast_fn({
                "event": "agent_update",
                "incident_id": incident_id,
                "agent": role,
                "icon": icon,
                "status": "running",
            })
            
        action = await asyncio.to_thread(run_sub_agent, agency, analysis)
        all_outputs[role] = action
        
        log = AgentLog(
            incident_id=incident_id,
            agent_name=role,
            step=f"{agency} Tactical Plan",
            output=action,
            timestamp=datetime.utcnow(),
        )
        db.add(log)
        db.commit()

        if broadcast_fn:
            await broadcast_fn({
                "event": "agent_update",
                "incident_id": incident_id,
                "agent": role,
                "icon": icon,
                "status": "done",
                "output": action,
            })
            
    # ── 3. Update Incident with AI Data ───────────────────────────────
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if incident:
        incident.status = "processed"
        incident.type = analysis.get("incident_type", "Unknown")
        
        sev_str = analysis.get("severity", "Medium")
        incident.severity = SEVERITY_MAP.get(sev_str, 5)
        
        incident.location = analysis.get("location", "Unknown")
        
        cas_str = str(analysis.get("estimated_casualties", ""))
        incident.casualties = 10 if "Mass" in cas_str else (2 if "Few" in cas_str else 0)
        
        db.commit()
        db.refresh(incident)

    # ── 4. Build Final Result ─────────────────────────────────────────
    final_result = {
        "incident_id": incident_id,
        "classification": analysis,
        "agents": all_outputs,
        "coordinator": {
            "status": "ALL UNITS DISPATCHED", 
            "strategic_priority": analysis.get("strategic_priority", "")
        }
    }

    if broadcast_fn:
        await broadcast_fn({
            "event": "crew_result",
            "incident_id": incident_id,
            "output": final_result,
        })

    return final_result
