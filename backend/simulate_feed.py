import requests
import json
import time
import random
from datetime import datetime, timezone

# URL of your FastAPI backend
API_URL = "http://localhost:8000/api/simulate"

# Synthetic dataset of disaster tweets (The "Live" trigger data)
SYNTHETIC_TWEETS = [
    {
        "text": "OMG! Huge car crash on Main St. Someone is trapped in the burning car! #emergency",
    },
    {
        "text": "Just saw a guy steal a purse near Central Park and run away.",
    },
    {
        "text": "My grandpa is having severe chest pains at home on 5th Ave, please hurry!",
    },
    {
        "text": "Massive explosion at the old warehouse down in the Industrial District! Flames are massive! #Fire",
    },
    {
        "text": "I smell a really strong chemical odor near the Water Treatment Plant, and my eyes are burning. People are starting to panic.",
    },
    {
        "text": "A water main just burst on 5th Avenue and the whole street is flooding! Cars are getting stuck.",
    },
    {
        "text": "Huge earthquake just shook the whole city! Buildings are collapsing downtown. We need help everywhere!",
    }
]

def simulate_live_feed():
    print("Starting Synthetic Live Disaster Feed...")
    print("Sending tweets to the Multi-Agent Simulator API...\n")
    
    for i, tweet_data in enumerate(SYNTHETIC_TWEETS):
        # Construct the payload matching the FastAPI Tweet model
        payload = {
            "id": f"t_{i:03d}",
            "text": tweet_data["text"],
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        print(f"[{datetime.now().strftime('%H:%M:%S')}] 🚨 NEW TWEET 🚨")
        print(f"Text: \"{payload['text']}\"")
        
        try:
            # Send the tweet to the API
            response = requests.post(API_URL, json=payload)
            
            if response.status_code == 200:
                result = response.json()
                print("\n✅ AGENT RESPONSE RECEIVED:")
                print(f"  Incident Type: {result.get('incident_type')}")
                print(f"  Severity: {result.get('severity')}")
                print(f"  Strategic Priority: {result.get('strategic_priority')}")
                print("  Actions:")
                for action in result.get('actions', []):
                    print(f"    - {action['agency']} Agent: {action['action']}")
                print("-" * 50)
            else:
                print(f"❌ Error: API returned status code {response.status_code}")
                print(response.text)
                
        except requests.exceptions.ConnectionError:
            print("❌ Error: Could not connect to the API. Is your FastAPI server running on port 8000?")
            break
            
        # Wait a few seconds before the next disaster (simulate real-time)
        wait_time = random.randint(5, 10)
        print(f"\nWaiting {wait_time} seconds before next report...\n")
        time.sleep(wait_time)

if __name__ == "__main__":
    simulate_live_feed()
