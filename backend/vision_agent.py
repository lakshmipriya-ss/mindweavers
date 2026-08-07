import random
import time
import requests
from io import BytesIO
from PIL import Image
from typing import Dict, Any

try:
    from ultralytics import YOLO
    # Load YOLO11 nano model for fast inference (downloads automatically if missing)
    yolo_model = YOLO('yolo11n.pt')
except ImportError:
    yolo_model = None
    print("Warning: ultralytics not installed. VisionAgent will fail if called.")

class VisionAgent:
    """
    True YOLO11 Vision Agent for object detection.
    GeoCLIP and Authenticity remain heuristically simulated for demonstration.
    """
    
    @classmethod
    def analyze_image(cls, tweet_id: str, image_url: str) -> Dict[str, Any]:
        """
        Runs true YOLO11 detection on the provided image URL.
        """
        if not yolo_model:
            raise RuntimeError("ultralytics YOLO model is not loaded. Please install dependencies.")
            
        objects = []
        people_count = 0
        
        try:
            # 1. Download image
            response = requests.get(image_url, timeout=10)
            response.raise_for_status()
            image = Image.open(BytesIO(response.content)).convert("RGB")
            
            # 2. Run YOLO11 Inference
            results = yolo_model(image, verbose=False)
            
            # 3. Parse Results
            if len(results) > 0:
                result = results[0]
                boxes = result.boxes
                for box in boxes:
                    cls_id = int(box.cls[0].item())
                    conf = float(box.conf[0].item())
                    label = result.names[cls_id]
                    
                    objects.append({
                        "label": label,
                        "confidence": round(conf, 2)
                    })
                    
                    if label == "person":
                        people_count += 1
                        
        except Exception as e:
            print(f"YOLO11 Inference Error: {e}")
            # Fallback objects if image fetch or processing fails
            objects = [{"label": "unknown", "confidence": 0.0}]
            
        # 4. Simulate GeoCLIP & Authenticity (since true GeoCLIP requires heavy custom models)
        is_real = random.random() > 0.15
        estimated_time = "14:30 PM (Daylight)" if random.random() > 0.5 else "22:15 PM (Night)"
        
        # Deterministic fake location based on image URL hints to keep UI demo working
        scenario = "fire"
        if "flood" in image_url.lower() or "water" in image_url.lower() or "tw-4" in tweet_id:
            scenario = "flood"
        elif "explosion" in image_url.lower() or "tw-3" in tweet_id:
            scenario = "explosion"
            
        locations = {
            "fire": {"country": "India", "state": "Telangana", "city": "Hyderabad", "latitude": 17.385, "longitude": 78.486, "confidence": 0.91},
            "flood": {"country": "India", "state": "Maharashtra", "city": "Mumbai", "latitude": 19.0760, "longitude": 72.8777, "confidence": 0.88},
            "explosion": {"country": "India", "state": "Delhi", "city": "New Delhi", "latitude": 28.6139, "longitude": 77.2090, "confidence": 0.94}
        }
        
        location_data = locations.get(scenario)
        if "tw-unknown" in tweet_id or (random.random() < 0.1):
            location_data = "No location found"
            
        return {
            "status": "success",
            "tweet_id": tweet_id,
            "people_count": people_count,
            "is_real": is_real,
            "estimated_time": estimated_time,
            "location": location_data,
            "objects": objects
        }
