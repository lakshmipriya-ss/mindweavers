import json
import os
import csv
import re
from prompts import (
    DISPATCHER_SYSTEM_PROMPT,
    FIRE_AGENT_PROMPT,
    MEDICAL_AGENT_PROMPT,
    POLICE_AGENT_PROMPT,
    HAZMAT_AGENT_PROMPT,
    PUBLIC_WORKS_AGENT_PROMPT,
)

LOCAL_MODEL = "phi3.5:latest"

AGENT_PROMPTS = {
    "Fire": FIRE_AGENT_PROMPT,
    "Medical": MEDICAL_AGENT_PROMPT,
    "Police": POLICE_AGENT_PROMPT,
    "Hazmat": HAZMAT_AGENT_PROMPT,
    "Public Works": PUBLIC_WORKS_AGENT_PROMPT,
}

def load_historical_data(max_lessons: int = 10) -> str:
    """Loads historical disaster post-mortem lessons from CSV."""
    csv_file = os.path.join(os.path.dirname(__file__) or ".", "historical_analysis_dataset.csv")
    try:
        with open(csv_file, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            data = list(reader)

            seen = set()
            unique_lessons = []
            for row in data:
                key = (row.get("Disaster_Type", ""), row.get("Slow_Departments", ""))
                if key not in seen:
                    seen.add(key)
                    unique_lessons.append(row)
                if len(unique_lessons) >= max_lessons:
                    break

            historical_text = ""
            for row in unique_lessons:
                historical_text += f"- {row.get('Disaster_Type', 'Incident')}: {row.get('Critical_Lesson', 'Maintain rapid inter-agency communication.')}\n"
            return historical_text
    except FileNotFoundError:
        return "- Fire/Structural: Prioritize immediate perimeter lockdown before water deployment.\n- Flood/Inundation: Establish high-ground triage centers within 15 minutes.\n- Chemical Spill: Deploy Level-A decon suit teams prior to civilian extraction."

def _parse_json_from_response(content: str) -> dict:
    """Extract JSON object from string robustly."""
    if "```json" in content:
        content = content.split("```json")[1].split("```")[0].strip()
    elif "```" in content:
        parts = content.split("```")
        if len(parts) >= 3:
            content = parts[1].strip()

    start = content.find("{")
    end = content.rfind("}")
    if start != -1 and end != -1 and end > start:
        content = content[start : end + 1]

    try:
        return json.loads(content)
    except Exception:
        return {}

def rule_based_fallback(tweet_text: str) -> dict:
    """Fallback rule-based intelligence when Ollama LLM is offline."""
    lower = tweet_text.lower()
    
    incident_type = "Structural Fire"
    severity = "Severe"
    location = "Downtown Central District"
    priority = "Dispatch immediate fire, medical and police perimeter teams."
    
    if "flood" in lower or "water" in lower or "rain" in lower or "inundat" in lower:
        incident_type = "Flash Flood"
        severity = "Critical"
        priority = "Establish high-ground triage, deploy rescue boats & road diversion."
    elif "leak" in lower or "chemical" in lower or "gas" in lower or "toxic" in lower:
        incident_type = "Hazmat Chemical Leak"
        severity = "Critical"
        priority = "Enforce 500m evacuation zone, deploy Hazmat decon team & police blockade."
    elif "crash" in lower or "accident" in lower or "traffic" in lower or "pileup" in lower:
        incident_type = "Traffic Multi-Vehicle Crash"
        severity = "Moderate"
        priority = "Clear emergency green corridor, dispatch ambulances & tow trucks."
    elif "medical" in lower or "injured" in lower or "collapse" in lower:
        incident_type = "Mass Casualty Emergency"
        severity = "Severe"
        priority = "Dispatch 4 advanced ambulances, prioritize hospital bed reservation."

    # Extract location if mentioned
    loc_match = re.search(r'(?:at|in|near|on)\s+([A-Z][a-z0-9\s]+(?:St|Street|Ave|Avenue|Rd|Road|Blvd|Park|Bridge|Station|Sector|Zone|\d+))', tweet_text)
    if loc_match:
        location = loc_match.group(1).strip()

    return {
        "incident_type": incident_type,
        "severity": severity,
        "location": location,
        "strategic_priority": priority,
        "department_responses": {
            "Fire": {
                "recommended_units": 3 if "fire" in lower else 1,
                "action_summary": "Establish water supply lines and initiate search and rescue."
            },
            "Medical": {
                "ambulances": 4 if "injur" in lower or "medical" in lower else 2,
                "triage_level": "Red (Immediate)",
                "action_summary": "Set up field triage and pre-notify Metro Hospital."
            },
            "Police": {
                "patrol_units": 3,
                "action_summary": "Block incoming traffic and secure evacuation corridors."
            }
        },
        "historical_lessons": load_historical_data(3)
    }

def process_incident(tweet_text: str) -> dict:
    """Processes raw report string with LLM (Ollama) or falls back to rule-based multi-agent simulator."""
    try:
        import ollama
        response = ollama.chat(
            model=LOCAL_MODEL,
            messages=[
                {"role": "system", "content": DISPATCHER_SYSTEM_PROMPT},
                {"role": "user", "content": f"Emergency Tweet Report: '{tweet_text}'"},
            ],
            options={"temperature": 0.1}
        )
        parsed = _parse_json_from_response(response['message']['content'])
        if parsed and "incident_type" in parsed:
            parsed["historical_lessons"] = load_historical_data(3)
            return parsed
    except Exception:
        pass

    return rule_based_fallback(tweet_text)
