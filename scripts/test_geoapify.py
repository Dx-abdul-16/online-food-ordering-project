import requests
import json

API_KEY = "622381795a5c45e7980ea9cf54170eee"

def test_routing():
    # Chennai to Madurai
    waypoints = "13.0827,80.2707|9.9252,78.1198"
    url = f"https://api.geoapify.com/v1/routing?waypoints={waypoints}&mode=drive&apiKey={API_KEY}"
    
    print("Testing Geoapify Routing API...")
    res = requests.get(url)
    if res.status_code == 200:
        data = res.json()
        distance = data['features'][0]['properties']['distance'] / 1000 # in km
        time = data['features'][0]['properties']['time'] / 60 # in min
        print(f"Success! Route found. Distance: {distance:.2f} km, Time: {time:.2f} mins")
    else:
        print(f"Routing Error: {res.status_code}")
        print(res.text)

def test_reverse_geocoding():
    # Coimbatore Lat Lng
    lat = 11.0168
    lng = 76.9558
    url = f"https://api.geoapify.com/v1/geocode/reverse?lat={lat}&lon={lng}&apiKey={API_KEY}"
    
    print("\nTesting Geoapify Reverse Geocoding API...")
    res = requests.get(url)
    if res.status_code == 200:
        data = res.json()
        address = data['features'][0]['properties']['formatted']
        print(f"Success! Address found: {address}")
    else:
        print(f"Geocoding Error: {res.status_code}")
        print(res.text)

if __name__ == "__main__":
    test_routing()
    test_reverse_geocoding()
