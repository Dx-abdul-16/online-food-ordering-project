
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

@delivery_bp.route("/available_orders", methods=["GET"])
def get_available_orders():
    """Fetch recent orders for the delivery driver."""
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        query = """
            SELECT o.id, o.restaurant_id, o.total_amount, o.status, o.delivery_address, 
                   o.latitude as user_lat, o.longitude as user_lng, o.created_at,
                   r.name as restaurant_name, r.location as restaurant_address, 
                   r.latitude as restaurant_lat, r.longitude as restaurant_lng
            FROM orders o
            JOIN restaurants r ON o.restaurant_id = r.id
            WHERE o.status IN ('pending', 'confirmed', 'preparing', 'on_the_way')
            ORDER BY o.created_at DESC LIMIT 5
        """
        cursor.execute(query)
        orders = cursor.fetchall()
        for o in orders:
            if o.get('created_at'):
                o['created_at'] = str(o['created_at'])
        return jsonify({"success": True, "orders": orders})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        cursor.close()
        db.close()

@delivery_bp.route("/update_status", methods=["POST"])
def update_order_status():
    """Update order status by delivery driver."""
    data = request.json
    order_id = data.get("orderId")
    status = data.get("status")

    if not order_id or not status:
        return jsonify({"success": False, "message": "Missing orderId or status"}), 400

    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute("UPDATE orders SET status = %s WHERE id = %s", (status, order_id))
        db.commit()
        return jsonify({"success": True, "message": f"Order status updated to {status}"})
    except Exception as e:
        db.rollback()
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        cursor.close()
        db.close()


