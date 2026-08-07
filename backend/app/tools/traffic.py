import os
import httpx

class TrafficTool:
    """Calculate fastest route between two points.
    Uses the OpenStreetMap / OSRM public API if TRAFFIC_API_URL is set, otherwise returns a mock.
    """
    def __init__(self):
        self.base_url = os.getenv("TRAFFIC_API_URL", "https://router.project-osrm.org/route/v1/driving")

    def get_route(self, origin: str, destination: str) -> str:
        # Expect origin/destination as "lat,lon" strings. If no external service, mock.
        if not self.base_url:
            return f"[Mock] Fastest route from {origin} to {destination} is 12 mins"
        try:
            coords = f"{origin};{destination}"
            params = {"overview": "simplified", "alternatives": "false", "steps": "false"}
            url = f"{self.base_url}/{coords}"
            resp = httpx.get(url, params=params, timeout=5)
            resp.raise_for_status()
            data = resp.json()
            duration_sec = data["routes"][0]["duration"]
            mins = int(duration_sec // 60)
            return f"Fastest route from {origin} to {destination} is {mins} mins"
        except Exception as e:
            return f"[Error] Unable to calculate route: {e}"
