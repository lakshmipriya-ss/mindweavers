import os
import httpx

class WeatherTool:
    """Fetch current weather for a location.
    Uses OpenWeatherMap API if OPENWEATHER_API_KEY is set, otherwise returns a mock.
    """
    def __init__(self):
        self.api_key = os.getenv("OPENWEATHER_API_KEY")
        self.base_url = "https://api.openweathermap.org/data/2.5/weather"

    def get_weather(self, location: str) -> str:
        if not self.api_key:
            return f"[Mock] Sunny weather at {location}"
        params = {
            "q": location,
            "appid": self.api_key,
            "units": "metric",
        }
        try:
            resp = httpx.get(self.base_url, params=params, timeout=5)
            resp.raise_for_status()
            data = resp.json()
            description = data["weather"][0]["description"]
            temp = data["main"]["temp"]
            return f"{description.title()}, {temp}°C at {location}"
        except Exception as e:
            return f"[Error] Unable to fetch weather: {e}"
