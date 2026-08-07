import requests, json
url = 'http://127.0.0.1:8000/simulation/mock-twitter'
payload = {"text": "Fire at Main St, 2 injured"}
resp = requests.post(url, json=payload)
print('Status:', resp.status_code)
print('Response:', resp.text)
