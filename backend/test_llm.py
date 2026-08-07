import json
from agents import process_incident

tests = [
    "hyderabad storm",
    "delhi earthquake",
    "mumbai flood heavy rain",
    "chennai tsunami warning",
    "fire at andheri market",
]

for t in tests:
    print(f"\n{'='*60}")
    print(f"INPUT: {t}")
    result = process_incident(t)
    print(f"  TYPE: {result.get('incident_type')}")
    print(f"  SEVERITY: {result.get('severity')}")
    print(f"  LOCATION: {result.get('location')}")
