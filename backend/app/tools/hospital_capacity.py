import os
import httpx

class HospitalCapacityTool:
    """Check hospital ICU bed availability.
    If HOSPITAL_API_URL is set, query that service; otherwise return a mock.
    Expected API response: {"hospital": "Name", "available_icu": 5}
    """
    def __init__(self):
        self.base_url = os.getenv("HOSPITAL_API_URL")

    def get_capacity(self, hospital_name: str) -> str:
        if not self.base_url:
            return f"[Mock] {hospital_name} has 8 ICU beds available"
        try:
            resp = httpx.get(f"{self.base_url}/capacity", params={"hospital": hospital_name}, timeout=5)
            resp.raise_for_status()
            data = resp.json()
            icu = data.get("available_icu", "unknown")
            return f"{hospital_name} has {icu} ICU beds available"
        except Exception as e:
            return f"[Error] Unable to fetch hospital capacity: {e}"
