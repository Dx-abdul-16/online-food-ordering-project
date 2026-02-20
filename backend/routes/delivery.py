
from flask import Blueprint, request, jsonify
from db import get_db
import datetime

delivery_bp = Blueprint("delivery", __name__)

# Update Delivery Location (Mock for now, normally sent by Driver App)
@delivery_bp.route("/location/update", methods=["POST"])
def update_location():
    data = request.json
    order_id = data.get("orderId")
    lat = data.get("latitude")
    lng = data.get("longitude")

    if not order_id or not lat or not lng:
        return jsonify({"success": False, "message": "Missing data"}), 400

    db = get_db()
    cursor = db.cursor()

    try:
        # Check if tracking exists for this order
        cursor.execute("SELECT id FROM delivery_tracking WHERE order_id = %s", (order_id,))
        tracking = cursor.fetchone()

        if tracking:
            cursor.execute(
                "UPDATE delivery_tracking SET latitude=%s, longitude=%s WHERE order_id=%s",
                (lat, lng, order_id)
            )
        else:
            cursor.execute(
                "INSERT INTO delivery_tracking (order_id, latitude, longitude) VALUES (%s, %s, %s)",
                (order_id, lat, lng)
            )
        
        db.commit()
        return jsonify({"success": True, "message": "Location updated"})
    except Exception as e:
        print(f"Error updating location: {e}")
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        cursor.close()
        db.close()

# Get Delivery Location
@delivery_bp.route("/location/<int:order_id>", methods=["GET"])
def get_location(order_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)

    try:
        cursor.execute("SELECT latitude, longitude, updated_at FROM delivery_tracking WHERE order_id = %s", (order_id,))
        location = cursor.fetchone()

        if location:
            return jsonify({
                "success": True, 
                "latitude": location['latitude'], 
                "longitude": location['longitude'],
                "updatedAt": location['updated_at']
            })
        else:
             # Default mock location if not found (simulating start)
            return jsonify({"success": False, "message": "Location not found, waiting for update"}), 404

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        cursor.close()
        db.close()
