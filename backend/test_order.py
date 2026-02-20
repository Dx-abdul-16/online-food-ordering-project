import requests

def test_place_order():
    url = "http://127.0.0.1:5000/api/orders/place"
    payload = {
        "userId": 1,
        "restaurantId": 1,
        "items": [
            {"id": 1, "quantity": 1, "price": 160}
        ],
        "total": 200,
        "paymentMethod": "cod",
        "paymentId": None,
        "address": "Test Address",
        "latitude": 11.0168,
        "longitude": 76.9558
    }
    
    try:
        response = requests.post(url, json=payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    test_place_order()
