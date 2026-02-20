
from flask import Blueprint, request, jsonify
from db import get_db

orders_bp = Blueprint("orders", __name__)

@orders_bp.route("/place", methods=["POST"])
def place_order():
    data = request.json
    
    user_id = data.get("userId")
    restaurant_id = data.get("restaurantId")
    items = data.get("items")
    total = data.get("total")
    payment_method = data.get("paymentMethod")
    address = data.get("address")
    fulfillment_mode = data.get("fulfillmentMode", "delivery")
    lat = data.get("latitude")
    lng = data.get("longitude")

    payment_id = data.get("paymentId") # Razorpay ID from frontend

    if not all([user_id, restaurant_id, items, total, payment_method]):
        return jsonify({"success": False, "message": "Missing order details"}), 400

    db = get_db()
    cursor = db.cursor()

    try:
        sql_order = """INSERT INTO orders (user_id, restaurant_id, total_amount, payment_method, payment_id, delivery_address, fulfillment_mode, latitude, longitude, status) 
                       VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, 'pending')"""
        cursor.execute(sql_order, (user_id, restaurant_id, total, payment_method, payment_id, address, fulfillment_mode, lat, lng))
        order_id = cursor.lastrowid


        sql_item = "INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES (%s, %s, %s, %s)"
        for item in items:
            cursor.execute(sql_item, (order_id, item['id'], item['quantity'], item['price']))

        db.commit()

        cursor.execute("SELECT latitude, longitude FROM restaurants WHERE id = %s", (restaurant_id,))
        rest_loc = cursor.fetchone()
        if rest_loc and rest_loc[0] is not None and rest_loc[1] is not None:
            cursor.execute(
                "INSERT INTO delivery_tracking (order_id, latitude, longitude) VALUES (%s, %s, %s)",
                (order_id, rest_loc[0], rest_loc[1])
            )
            db.commit()

        return jsonify({"success": True, "message": "Order placed successfully", "orderId": order_id})
    
    except Exception as e:
        import traceback
        traceback.print_exc()
        db.rollback()
        print(f"Order Error: {e}")
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        cursor.close()
        db.close()


@orders_bp.route("/<int:order_id>", methods=["GET"])
def get_order(order_id):
    """Fetch a single order with its items and restaurant info."""
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("""
            SELECT o.*, r.name as restaurant_name, r.image as restaurant_image,
                   r.latitude as restaurant_lat, r.longitude as restaurant_lng,
                   r.location as restaurant_location
            FROM orders o
            JOIN restaurants r ON o.restaurant_id = r.id
            WHERE o.id = %s
        """, (order_id,))
        order = cursor.fetchone()
        if not order:
            return jsonify({"success": False, "message": "Order not found"}), 404

        # Fetch order items
        cursor.execute("""
            SELECT oi.quantity, oi.price, m.name as item_name
            FROM order_items oi
            LEFT JOIN menu_items m ON oi.menu_item_id = m.id
            WHERE oi.order_id = %s
        """, (order_id,))
        items = cursor.fetchall()
        order['items'] = items

        # Convert datetime to string
        if order.get('created_at'):
            order['created_at'] = str(order['created_at'])

        return jsonify({"success": True, "order": order})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        cursor.close()
        db.close()


@orders_bp.route("/user/<int:user_id>", methods=["GET"])
def get_user_orders(user_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("""
            SELECT o.*, r.name as restaurant_name, r.image as restaurant_image
            FROM orders o
            JOIN restaurants r ON o.restaurant_id = r.id
            WHERE o.user_id = %s
            ORDER BY o.created_at DESC
        """, (user_id,))
        orders = cursor.fetchall()
        for o in orders:
            if o.get('created_at'):
                o['created_at'] = str(o['created_at'])
        return jsonify(orders)
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        cursor.close()
        db.close()
