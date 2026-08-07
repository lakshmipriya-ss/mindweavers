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
    """Extract JSON object from string robustly. Handles malformed LLM output."""
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

    # Attempt 1: Direct parse
    try:
        return json.loads(content)
    except Exception:
        pass

    # Attempt 2: Fix common LLM JSON mistakes
    try:
        # Remove trailing commas before } or ]
        fixed = re.sub(r',\s*([}\]])', r'\1', content)
        # Truncate long values that break JSON (e.g. severity with extra explanation)
        # Find values that contain unescaped quotes or are too long
        fixed = re.sub(r'"([^"]{100,})"', lambda m: '"' + m.group(1)[:80].rstrip() + '"', fixed)
        return json.loads(fixed)
    except Exception:
        pass

    # Attempt 3: Extract key-value pairs manually with regex
    try:
        result = {}
        for key in ['incident_type', 'severity', 'location', 'strategic_priority']:
            match = re.search(rf'"{key}"\s*:\s*"([^"]+?)"', content)
            if match:
                result[key] = match.group(1).strip()
        if result.get('incident_type'):
            return result
    except Exception:
        pass

    return {}

def _extract_location(text: str) -> str:
    """Extract location from free-form text using multiple strategies."""
    # Strategy 1: Case-insensitive "in/at/near <Location>" patterns
    loc_match = re.search(r'(?:in|at|near|from|around)\s+([A-Za-z][A-Za-z\s,]+?)(?:\.|,|\s*$|\s+(?:and|but|with|where|during|after|before|buildings|people|houses|massive|heavy|severe|storm|flood|fire|earthquake))', text, re.IGNORECASE)
    if loc_match:
        loc = loc_match.group(1).strip().rstrip(',. ')
        # Capitalize each word for clean display
        return loc.title()

    # Strategy 2: Find proper nouns OR standalone words that look like place names
    exclude = {'fire', 'flood', 'earthquake', 'tsunami', 'cyclone', 'storm', 'medical', 'emergency',
               'massive', 'severe', 'critical', 'help', 'people', 'trapped', 'injured', 'buildings',
               'collapsed', 'destroyed', 'heavy', 'report', 'breaking', 'news', 'alert', 'update',
               'just', 'the', 'many', 'several', 'multiple', 'rescue', 'damage', 'water', 'rain',
               'wind', 'hail', 'lightning', 'thunder', 'warning', 'major', 'minor'}
    words = text.split()
    candidates = []
    for w in words:
        clean = w.strip('.,!?;:()[]')
        if clean and clean.lower() not in exclude and len(clean) > 2:
            # Accept capitalized words OR words that don't match disaster keywords
            if clean[0].isupper() or (clean.isalpha() and clean.lower() not in exclude):
                candidates.append(clean.title())
    
    # Filter: keep only words that aren't common English words (likely place names)
    common_words = {'are', 'was', 'has', 'had', 'been', 'being', 'very', 'much', 'all', 'any',
                    'some', 'more', 'most', 'than', 'then', 'also', 'only', 'can', 'will',
                    'due', 'lot', 'big', 'hit', 'need', 'needed', 'now', 'get', 'got'}
    place_candidates = [c for c in candidates if c.lower() not in common_words]
    
    if place_candidates:
        return ', '.join(place_candidates[:3])

    return "Location not specified in report"

def rule_based_fallback(tweet_text: str, vision_context: dict = None) -> dict:
    """Fallback rule-based intelligence when Ollama LLM is offline."""
    lower = tweet_text.lower()
    
    incident_type = "Structural Fire"
    severity = "Severe"
    priority = "Dispatch immediate fire, medical and police perimeter teams."
    
    if vision_context:
        # Utilize vision context if LLM is offline
        if isinstance(vision_context.get("location"), dict):
            location = f"{vision_context['location'].get('city', '')}, {vision_context['location'].get('state', '')}"
        
        objects = [obj.get("label", "") for obj in vision_context.get("objects", [])]
        if "building" in objects and "person" in objects:
            severity = "Critical (People Trapped)"
        
        if vision_context.get("people_count", 0) > 3:
            priority = f"Mass extraction required. Detectors found {vision_context['people_count']} people."
            
    if "storm" in lower or "hail" in lower or "wind" in lower or "thunder" in lower or "lightning" in lower:
        incident_type = "Severe Storm"
        severity = "Severe"
        priority = "Issue IMD weather warning. Shelter all outdoor personnel. Secure loose structures. Pre-position NDRF teams."
    elif "earthquake" in lower or "quake" in lower or "seismic" in lower or "tremor" in lower:
        incident_type = "Earthquake"
        severity = "Critical"
        priority = "Deploy NDRF urban search-and-rescue teams. Establish forward triage. Check structural integrity of surrounding buildings."
    elif "tsunami" in lower or "tidal" in lower:
        incident_type = "Tsunami"
        severity = "Critical"
        priority = "Immediate coastal evacuation to high ground. Activate INCOIS early warning sirens. Deploy Navy and Coast Guard."
    elif "cyclone" in lower or "hurricane" in lower or "typhoon" in lower:
        incident_type = "Cyclone"
        severity = "Critical"
        priority = "Evacuate coastal settlements. Open relief shelters. Pre-position NDRF battalions."
    elif "flood" in lower or "water" in lower or "rain" in lower or "inundat" in lower:
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
    elif "medical" in lower or "injured" in lower or "collapse" in lower or "trapped" in lower:
        incident_type = "Mass Casualty Emergency"
        severity = "Severe"
        priority = "Dispatch 4 advanced ambulances, prioritize hospital bed reservation."
    elif "fire" in lower or "burn" in lower or "blaze" in lower or "smoke" in lower:
        incident_type = "Structural Fire"
        severity = "Severe"
        priority = "Dispatch fire tenders, establish water relay. Evacuate adjacent buildings."

    # Smart location extraction
    location = _extract_location(tweet_text)

    return {
        "incident_type": incident_type,
        "severity": severity,
        "location": location,
        "latitude": 13.0827 if "chennai" in lower else 40.7128,
        "longitude": 80.2707 if "chennai" in lower else -74.0060,
        "strategic_priority": priority,
        "department_responses": {
            "Fire": {
                "recommended_units": 3 if "fire" in lower else 1,
                "action_summary": "Establish water supply lines and initiate search and rescue."
            },
            "Medical": {
                "ambulances": 4 if "injur" in lower or "medical" in lower or "trapped" in lower else 2,
                "triage_level": "Red (Immediate)",
                "action_summary": "Set up field triage and pre-notify Metro Hospital."
            },
            "Police": {
                "patrol_units": 3,
                "action_summary": "Block incoming traffic and secure evacuation corridors."
            }
        },
        "historical_lessons": load_historical_data(3),
        "flowchart_mermaid": "graph TD\\n  A[Incident Detected] --> B[Assess Severity]\\n  B --> C{High Severity?}\\n  C -->|Yes| D[AI Commander]\\n  D --> E[Police Agent]\\n  D --> F[Hospital Agent]\\n  D --> G[Traffic Predicting Engine]\\n  F --> H[Call Ambulance]\\n  E --> I[Establish Perimeter]\\n  G --> J[Reroute Traffic]"
    }

# Toggle this to True if you want to use the local Ollama LLM (Note: can take 1-5 minutes per incident)
USE_LLM = True

def process_incident(tweet_text: str, vision_context: dict = None) -> dict:
    """Processes raw report string with LLM (Ollama) or falls back to rule-based multi-agent simulator."""
    if USE_LLM:
        try:
            import ollama
            print(f"[LLM] Calling phi3.5 with: '{tweet_text[:80]}...'")
            response = ollama.chat(
                model=LOCAL_MODEL,
                messages=[
                    {"role": "system", "content": DISPATCHER_SYSTEM_PROMPT},
                    {"role": "user", "content": f"Emergency Tweet Report: '{tweet_text}'"},
                ],
                options={"temperature": 0.1}
            )
            raw_content = response['message']['content']
            print(f"[LLM] Raw response: {raw_content[:200]}...")
            parsed = _parse_json_from_response(raw_content)
            print(f"[LLM] Parsed JSON keys: {list(parsed.keys()) if parsed else 'NONE'}")
            if parsed and "incident_type" in parsed:
                # Ensure location is populated — if LLM says Unknown, try extracting from text
                if not parsed.get("location") or parsed["location"].lower() in ("unknown", "unknown location", "not specified"):
                    parsed["location"] = _extract_location(tweet_text)
                parsed["historical_lessons"] = load_historical_data(3)
                print(f"[LLM] SUCCESS — returning LLM result: {parsed.get('incident_type')} / {parsed.get('severity')} / {parsed.get('location')}")
                return parsed
            else:
                print(f"[LLM] FAILED to parse — falling back to rule-based engine")
        except Exception as e:
            print(f"[LLM] EXCEPTION: {e} — falling back to rule-based engine")
    
    result = rule_based_fallback(tweet_text)
    print(f"[FALLBACK] Returning: {result.get('incident_type')} / {result.get('severity')} / {result.get('location')}")
    return result

    return rule_based_fallback(tweet_text, vision_context)

def run_local_brain(tweet_text: str) -> dict:
    """Equivalent to the old process_incident but also ensures required_agencies is populated."""
    analysis = process_incident(tweet_text)
    
    # Determine required agencies based on text and severity
    agencies = ["Police"]
    lower = tweet_text.lower()
    if "fire" in lower or "smoke" in lower or "burn" in lower:
        agencies.append("Fire")
    if "medical" in lower or "injur" in lower or "casualt" in lower or "hurt" in lower:
        agencies.append("Medical")
    if "spill" in lower or "chemical" in lower or "gas" in lower or "toxic" in lower:
        agencies.append("Hazmat")
    if "flood" in lower or "road" in lower or "debris" in lower or "tree" in lower:
        agencies.append("Public Works")
        
    if "Fire" not in agencies and "Medical" not in agencies:
        agencies.append("Fire")
        agencies.append("Medical")
        
    analysis["required_agencies"] = agencies
    return analysis

def run_sub_agent(agency: str, analysis: dict) -> dict:
    """Runs a sub-agent for the given agency based on the initial analysis."""
    if USE_LLM:
        try:
            import ollama
            system_prompt = AGENT_PROMPTS.get(agency, "You are a tactical emergency responder.")
            
            # Give the agent the context
            context_str = json.dumps(analysis)
            response = ollama.chat(
                model=LOCAL_MODEL,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"Formulate a tactical plan based on this incident analysis:\n{context_str}"},
                ],
                options={"temperature": 0.1}
            )
            parsed = _parse_json_from_response(response['message']['content'])
            if parsed and "action_summary" in parsed:
                return parsed
        except Exception:
            pass
        
    # Fallback to rule-based sub-agent response
    fb = rule_based_fallback(analysis.get("tweet_text", analysis.get("location", "Incident")))
    agency_resp = fb.get("department_responses", {}).get(agency, {})
    if not agency_resp:
        agency_resp = {"action_summary": f"Deploying standard {agency} response team."}
    return agency_resp
