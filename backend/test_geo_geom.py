import requests
import json
API_KEY = "622381795a5c45e7980ea9cf54170eee"
waypoints = "13.0827,80.2707|9.9252,78.1198"
url = f"https://api.geoapify.com/v1/routing?waypoints={waypoints}&mode=drive&apiKey={API_KEY}"
res = requests.get(url)
data = res.json()
print(data['features'][0]['geometry']['type'])
coords = data['features'][0]['geometry']['coordinates']
print(str(coords)[:100])
