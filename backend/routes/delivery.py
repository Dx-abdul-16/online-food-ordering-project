
from flask import Blueprint, request, jsonify
from db import get_db
import datetime
import hashlib
import json

delivery_bp = Blueprint("delivery", __name__)

# --- Go Online / Offline ---
@delivery_bp.route("/go-online", methods=["POST"])
def go_online():
    """Mark delivery partner as online and start sharing location"""
    data = request.json
    partner_id = data.get("partnerId")
    lat = data.get("latitude")
    lng = data.get("longitude")

    if not partner_id:
        return jsonify({"success": False, "message": "Missing partnerId"}), 400

    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute("""
            UPDATE users SET is_online = TRUE, live_latitude = %s, live_longitude = %s 
            WHERE id = %s AND role = 'delivery'
        """, (lat, lng, partner_id))
        db.commit()
        return jsonify({"success": True, "message": "You are now online"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        cursor.close()
        db.close()

@delivery_bp.route("/go-offline", methods=["POST"])
def go_offline():
    """Mark delivery partner as offline"""
    data = request.json
    partner_id = data.get("partnerId")

    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute("""
            UPDATE users SET is_online = FALSE 
            WHERE id = %s AND role = 'delivery'
        """, (partner_id,))
        db.commit()
        return jsonify({"success": True, "message": "You are now offline"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        cursor.close()
        db.close()

# --- Update Live Location (continuous) ---
@delivery_bp.route("/location/update", methods=["POST"])
def update_location():
    data = request.json
    order_id = data.get("orderId")
    partner_id = data.get("partnerId")
    lat = data.get("latitude")
    lng = data.get("longitude")

    if not lat or not lng:
        return jsonify({"success": False, "message": "Missing location data"}), 400

    db = get_db()
    cursor = db.cursor()

    try:
        # Always update the delivery partner's live location
        if partner_id:
            cursor.execute("""
                UPDATE users SET live_latitude=%s, live_longitude=%s, is_online=TRUE
                WHERE id=%s AND role='delivery'
            """, (lat, lng, partner_id))

        # If tracking a specific order, update delivery_tracking too
        if order_id:
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

# --- Get Delivery Location for a specific order ---
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
                "updatedAt": str(location['updated_at']) if location.get('updated_at') else None
            })
        else:
            return jsonify({"success": False, "message": "Location not found"}), 404

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        cursor.close()
        db.close()

# --- Get Nearby Delivery Partners (for customers) ---
@delivery_bp.route("/nearby", methods=["GET"])
def get_nearby_partners():
    """Get all online delivery partners for customer view"""
    lat = request.args.get("lat", type=float)
    lng = request.args.get("lng", type=float)

    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("""
            SELECT id, name, live_latitude, live_longitude, last_location_update
            FROM users 
            WHERE role = 'delivery' 
              AND is_online = TRUE 
              AND is_approved = TRUE
              AND live_latitude IS NOT NULL 
              AND live_longitude IS NOT NULL
        """)
        partners = cursor.fetchall()
        
        # Calculate simple distance and sort by nearest
        if lat and lng:
            for p in partners:
                p_lat = float(p['live_latitude'])
                p_lng = float(p['live_longitude'])
                # Simple Euclidean distance (good enough for nearby check)
                p['distance'] = ((p_lat - lat) ** 2 + (p_lng - lng) ** 2) ** 0.5
            partners.sort(key=lambda x: x.get('distance', 999))
        
        for p in partners:
            if p.get('last_location_update'):
                p['last_location_update'] = str(p['last_location_update'])

        return jsonify({"success": True, "partners": partners})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        cursor.close()
        db.close()

# --- Available Orders for Delivery Partners ---
@delivery_bp.route("/available_orders", methods=["GET"])
def get_available_orders():
    """Fetch orders that delivery partners can accept"""
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        query = """
            SELECT o.id, o.restaurant_id, o.total_amount, o.status, o.delivery_address, 
                   o.latitude as user_lat, o.longitude as user_lng, o.created_at,
                   o.delivery_partner_id, o.qr_hash,
                   r.name as restaurant_name, r.location as restaurant_address, 
                   r.latitude as restaurant_lat, r.longitude as restaurant_lng
            FROM orders o
            JOIN restaurants r ON o.restaurant_id = r.id
            WHERE o.status IN ('pending', 'confirmed', 'preparing', 'on_the_way')
            ORDER BY o.created_at DESC LIMIT 10
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

# --- Accept / Decline Order ---
@delivery_bp.route("/accept-order", methods=["POST"])
def accept_order():
    """Delivery partner accepts an order"""
    data = request.json
    order_id = data.get("orderId")
    partner_id = data.get("partnerId")

    if not order_id or not partner_id:
        return jsonify({"success": False, "message": "Missing orderId or partnerId"}), 400

    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        # Check if order is already taken
        cursor.execute("SELECT delivery_partner_id, status FROM orders WHERE id = %s", (order_id,))
        order = cursor.fetchone()
        if not order:
            return jsonify({"success": False, "message": "Order not found"}), 404
        
        if order['delivery_partner_id'] and order['delivery_partner_id'] != partner_id:
            return jsonify({"success": False, "message": "Order already assigned to another partner"}), 409

        # Generate QR hash for this order
        qr_data = f"FOODEXPRESS-ORDER-{order_id}-{partner_id}-{datetime.datetime.now().isoformat()}"
        qr_hash = hashlib.sha256(qr_data.encode()).hexdigest()[:16].upper()

        cursor.execute("""
            UPDATE orders 
            SET delivery_partner_id = %s, status = 'on_the_way', qr_hash = %s
            WHERE id = %s
        """, (partner_id, qr_hash, order_id))
        db.commit()

        return jsonify({
            "success": True, 
            "message": "Order accepted! Navigate to restaurant for pickup.",
            "qrHash": qr_hash
        })
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        cursor.close()
        db.close()

@delivery_bp.route("/decline-order", methods=["POST"])
def decline_order():
    """Delivery partner declines an order"""
    data = request.json
    order_id = data.get("orderId")
    partner_id = data.get("partnerId")

    # Just log the decline - order remains available for others
    return jsonify({"success": True, "message": "Order declined. It will be offered to other partners."})

# --- QR Scanner: Verify pickup ---
@delivery_bp.route("/verify-pickup", methods=["POST"])
def verify_pickup():
    """Delivery partner scans QR code at restaurant to verify pickup"""
    data = request.json
    order_id = data.get("orderId")
    qr_hash = data.get("qrHash")
    partner_id = data.get("partnerId")

    if not order_id or not qr_hash:
        return jsonify({"success": False, "message": "Missing orderId or qrHash"}), 400

    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("SELECT qr_hash, delivery_partner_id FROM orders WHERE id = %s", (order_id,))
        order = cursor.fetchone()
        
        if not order:
            return jsonify({"success": False, "message": "Order not found"}), 404
        
        if order['qr_hash'] != qr_hash:
            return jsonify({"success": False, "message": "Invalid QR code! Does not match this order."}), 400

        cursor.execute("""
            UPDATE orders SET status = 'on_the_way', picked_up_at = NOW()
            WHERE id = %s
        """, (order_id,))
        db.commit()

        return jsonify({"success": True, "message": "Pickup verified! Navigate to customer now."})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        cursor.close()
        db.close()

# --- Customer confirms delivery ---
@delivery_bp.route("/confirm-delivery", methods=["POST"])
def confirm_delivery():
    """Customer scans QR and confirms received / not received"""
    data = request.json
    order_id = data.get("orderId")
    qr_hash = data.get("qrHash")
    confirmed = data.get("confirmed", True)  # true = received, false = not_received

    if not order_id or not qr_hash:
        return jsonify({"success": False, "message": "Missing orderId or qrHash"}), 400

    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("SELECT qr_hash FROM orders WHERE id = %s", (order_id,))
        order = cursor.fetchone()
        
        if not order:
            return jsonify({"success": False, "message": "Order not found"}), 404
        
        if order['qr_hash'] != qr_hash:
            return jsonify({"success": False, "message": "Invalid QR code!"}), 400

        status = "received" if confirmed else "not_received"
        new_order_status = "delivered" if confirmed else "on_the_way"

        cursor.execute("""
            UPDATE orders SET customer_confirmed = %s, status = %s, delivered_at = %s
            WHERE id = %s
        """, (status, new_order_status, datetime.datetime.now() if confirmed else None, order_id))
        db.commit()

        msg = "Order marked as received! Thank you!" if confirmed else "Order marked as not received. Support has been notified."
        return jsonify({"success": True, "message": msg})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        cursor.close()
        db.close()

# --- Update Order Status ---
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
        if status == "delivered":
            cursor.execute("UPDATE orders SET status = %s, delivered_at = NOW() WHERE id = %s", (status, order_id))
        else:
            cursor.execute("UPDATE orders SET status = %s WHERE id = %s", (status, order_id))
        db.commit()
        return jsonify({"success": True, "message": f"Order status updated to {status}"})
    except Exception as e:
        db.rollback()
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        cursor.close()
        db.close()

# --- Get QR code data for an order ---
@delivery_bp.route("/qr/<int:order_id>", methods=["GET"])
def get_qr_data(order_id):
    """Get QR code data for an order (for customer/delivery partner)"""
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("SELECT id, qr_hash, status, customer_confirmed FROM orders WHERE id = %s", (order_id,))
        order = cursor.fetchone()
        if not order or not order.get('qr_hash'):
            return jsonify({"success": False, "message": "QR not generated yet"}), 404
        
        return jsonify({
            "success": True,
            "orderId": order['id'],
            "qrHash": order['qr_hash'],
            "status": order['status'],
            "customerConfirmed": order['customer_confirmed']
        })
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        cursor.close()
        db.close()
