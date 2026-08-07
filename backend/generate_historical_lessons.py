import csv
import os

HISTORICAL_CSV = os.path.join(os.path.dirname(__file__), "historical_analysis_dataset.csv")

SAMPLE_LESSONS = [
    {"Disaster_Type": "Structural Fire", "Slow_Departments": "Water & Utility", "Critical_Lesson": "Check fire hydrant pressure in Sector 4 before deploying heavy ladders."},
    {"Disaster_Type": "Flash Flood", "Slow_Departments": "Traffic & Transit", "Critical_Lesson": "Activate elevated bypass highway immediately to prevent ambulance gridlock."},
    {"Disaster_Type": "Hazmat Leak", "Slow_Departments": "Public Health", "Critical_Lesson": "Deploy Level-A chemical suits before approaching within 300 meters."},
    {"Disaster_Type": "Multi-Vehicle Crash", "Slow_Departments": "Police", "Critical_Lesson": "Set up flare cordons 500m ahead on highway to stop secondary collisions."},
    {"Disaster_Type": "Earthquake", "Slow_Departments": "Structural Engineering", "Critical_Lesson": "Verify gas main shutoffs before using thermal cutting equipment."}
]

def init_historical_dataset():
    if not os.path.exists(HISTORICAL_CSV):
        with open(HISTORICAL_CSV, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=["Disaster_Type", "Slow_Departments", "Critical_Lesson"])
            writer.writeheader()
            writer.writerows(SAMPLE_LESSONS)

if __name__ == "__main__":
    init_historical_dataset()
    print("Historical analysis dataset generated successfully.")
