import requests
import time

def check_url(url, description):
    print(f"Checking {description} at {url}...")
    try:
        response = requests.get(url, timeout=5)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            print("Response Length:", len(response.text))
            try:
                print("JSON Response:", response.json()[:1]) # Print first item if list
            except:
                print("Response is not JSON")
        elif response.status_code == 308:
             print("Redirect (308) to:", response.headers.get('Location'))
        else:
            print("Response:", response.text[:200])
        return True
    except Exception as e:
        print(f"Error checking {url}: {e}")
        return False


check_url("http://127.0.0.1:5000/api/restaurants", "Backend Restaurants (No Slash)")
check_url("http://127.0.0.1:5000/api/restaurants/", "Backend Restaurants (With Slash)")


check_url("http://localhost:8080/api/restaurants/", "Frontend Proxy (With Slash)")
check_url("http://localhost:8080", "Frontend Root")
