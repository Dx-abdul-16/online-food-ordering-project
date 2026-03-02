import os, sys, traceback
sys.path.append(r'd:\online-food-ordering\backend')

try:
    import db
    from flask import Flask, request, jsonify

    app = Flask(__name__)
    from routes.orders import orders_bp

    app.register_blueprint(orders_bp, url_prefix="/api/orders")

    with app.test_client() as client:
        resp = client.post('/api/orders/place', json={
            "userId": 1,
            "restaurantId": 1,
            "items": [
                {"id": 1, "quantity": 2, "price": 100}
            ],
            "total": 200,
            "paymentMethod": "cod",
            "address": "test address",
            "fulfillmentMode": "delivery",
            "latitude": 11.0,
            "longitude": 77.0
        })
        with open('tester_log.txt', 'w') as f:
            f.write(f"STATUS: {resp.status_code}\n")
            f.write(f"RESPONSE: {resp.get_data(as_text=True)}\n")
except Exception as e:
    with open('tester_log.txt', 'w') as f:
        f.write(traceback.format_exc())
