"""
End-to-end test script for the Multi-Agent Disaster Response Simulator.
Tests the Dispatcher + all 5 Sub-Agents (Fire, Medical, Police, Hazmat, Public Works)
running 100% offline on Phi4-mini via Ollama.
"""
import json
import time
from agents import process_incident

TEST_TWEETS = [
    {
        "label": "TEST 1: Simple Medical Emergency",
        "tweet": "My neighbor just collapsed in their garden on Oak Street, I think it's a stroke! Please send help!"
    },
    {
        "label": "TEST 2: Multi-Agency Fire + Rescue",
        "tweet": "Huge fire at the shopping mall on Market Square! People are running out screaming, some are trapped inside on the 2nd floor!"
    },
    {
        "label": "TEST 3: Critical Chemical Spill (Hazmat)",
        "tweet": "EMERGENCY! A tanker truck carrying chemicals just overturned on Highway 7! There's a green cloud of gas spreading and people nearby are coughing and vomiting!"
    },
    {
        "label": "TEST 4: Infrastructure Failure",
        "tweet": "A massive sinkhole just opened up on Bridge Road! A bus fell into it and the water pipes underneath have burst! The whole road is flooding!"
    },
    {
        "label": "TEST 5: Earthquake (Multi-Agency Critical)",
        "tweet": "EARTHQUAKE! Buildings are crumbling downtown! Fires breaking out everywhere, roads are cracked, people are trapped under rubble! This is catastrophic!"
    }
]

def run_tests():
    print("=" * 80)
    print("DISASTER RESPONSE MULTI-AGENT SIMULATOR - FULL TEST")
    print(f"Model: phi4-mini (100% Offline)")
    print("=" * 80)
    
    results = []
    
    for i, test in enumerate(TEST_TWEETS):
        print(f"\n{'=' * 80}")
        print(f"{test['label']}")
        print(f"Tweet: \"{test['tweet']}\"")
        print(f"{'=' * 80}")
        
        start_time = time.time()
        result = process_incident(test["tweet"])
        elapsed = time.time() - start_time
        
        print(f"\n--- DISPATCHER ANALYSIS ---")
        print(f"  Incident Type: {result['incident_type']}")
        print(f"  Severity: {result['severity']}")
        print(f"  Location: {result['location']}")
        print(f"  Estimated Casualties: {result.get('estimated_casualties', 'N/A')}")
        print(f"  Strategic Priority: {result['strategic_priority']}")
        
        print(f"\n--- AGENT ACTIONS ---")
        for action in result.get("actions", []):
            print(f"\n  [{action['agency']} Agent]:")
            action_data = action['action']
            if isinstance(action_data, dict):
                for key, value in action_data.items():
                    print(f"    {key}: {value}")
            else:
                print(f"    {action_data}")
        
        print(f"\n--- AGENT COMMUNICATION LOG ---")
        for log in result.get("agent_logs", []):
            print(f"  > {log}")
        
        print(f"\n  Total processing time: {elapsed:.2f} seconds")
        print(f"  Agencies involved: {len(result.get('actions', []))}")
        
        results.append({
            "test": test["label"],
            "processing_time_seconds": round(elapsed, 2),
            "result": result
        })
    
    # Save full results to a JSON file
    with open("test_results.json", "w") as f:
        json.dump(results, f, indent=2)
    
    print(f"\n\n{'=' * 80}")
    print("ALL TESTS COMPLETE!")
    print(f"{'=' * 80}")
    print(f"\nFull results saved to: test_results.json")
    
    # Print summary table
    print(f"\n{'Test':<45} {'Time (s)':<12} {'Agencies':<10} {'Severity'}")
    print("-" * 80)
    for r in results:
        res = r["result"]
        print(f"{r['test']:<45} {r['processing_time_seconds']:<12} {len(res.get('actions', [])):<10} {res.get('severity', 'N/A')}")

if __name__ == "__main__":
    run_tests()
