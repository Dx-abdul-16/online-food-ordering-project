from flask import Blueprint, jsonify
from db import get_db

restaurant_bp = Blueprint("restaurant", __name__)

@restaurant_bp.route("/", methods=["GET"])
def get_restaurants():
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT * FROM restaurants")
        restaurants = cursor.fetchall()

        formatted_restaurants = []
        for r in restaurants:
            formatted_restaurants.append({
                "id": r.get("id"),
                "name": r.get("name"),
                "image": r.get("image"),
                "cuisine": r.get("cuisine"),
                "rating": r.get("rating"),
                "deliveryTime": r.get("delivery_time"),
                "location": r.get("location"),
                "latitude": r.get("latitude"),
                "longitude": r.get("longitude"),
                "priceForTwo": r.get("price_for_two"),
                "isVeg": bool(r.get("is_veg", False))
            })

        cursor.close()
        db.close()
        return jsonify(formatted_restaurants)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@restaurant_bp.route("/<int:id>", methods=["GET"])
def get_restaurant(id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    
    cursor.execute("SELECT * FROM restaurants WHERE id=%s", (id,))
    restaurant = cursor.fetchone()
    
    if not restaurant:
        cursor.close()
        db.close()
        return jsonify({"error": "Restaurant not found"}), 404
        
    
    cursor.execute("SELECT * FROM menu_items WHERE restaurant_id=%s", (id,))
    menu_items = cursor.fetchall()
    
    formatted_menu = []
    for item in menu_items:
        formatted_menu.append({
            "id": item["id"],
            "name": item["name"],
            "price": item["price"],
            "description": item["description"],
            "image": item["image"],
            "isVeg": bool(item["is_veg"])
        })
        
    formatted_restaurant = {
        "id": restaurant["id"],
        "name": restaurant["name"],
        "image": restaurant["image"],
        "cuisine": restaurant["cuisine"],
        "rating": restaurant["rating"],
        "deliveryTime": restaurant["delivery_time"],
        "location": restaurant["location"],
        "latitude": restaurant.get("latitude"),
        "longitude": restaurant.get("longitude"),
        "priceForTwo": restaurant["price_for_two"],
        "isVeg": bool(restaurant["is_veg"]),
        "menu": formatted_menu
    }
    
    cursor.close()
    db.close()
    
    return jsonify(formatted_restaurant)

# ---------------- OWNER MANAGEMENT ----------------

@restaurant_bp.route("/owner/<int:owner_id>", methods=["GET"])
def get_restaurant_by_owner(owner_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    
    cursor.execute("SELECT * FROM restaurants WHERE owner_id=%s", (owner_id,))
    restaurant = cursor.fetchone()
    
    if not restaurant:
        cursor.close()
        db.close()
        return jsonify({"success": False, "message": "No restaurant found for this owner"}), 404
        
    # Get Menu
    cursor.execute("SELECT * FROM menu_items WHERE restaurant_id=%s", (restaurant['id'],))
    menu_items = cursor.fetchall()
    
    formatted_menu = []
    for item in menu_items:
        formatted_menu.append({
            "id": item["id"],
            "name": item["name"],
            "price": item["price"],
            "description": item["description"],
            "image": item["image"],
            "isVeg": bool(item["is_veg"])
        })

    # Add menu to restaurant object
    restaurant['menu'] = formatted_menu

    cursor.close()
    db.close()
    
    return jsonify(restaurant)

from flask import request

@restaurant_bp.route("/menu/add", methods=["POST"])
def add_menu_item():
    data = request.json
    restaurant_id = data.get("restaurantId")
    name = data.get("name")
    price = data.get("price")
    description = data.get("description")
    image = data.get("image")
    is_veg = data.get("isVeg")
    
    db = get_db()
    cursor = db.cursor()
    
    try:
        cursor.execute(
            "INSERT INTO menu_items (restaurant_id, name, price, description, image, is_veg) VALUES (%s, %s, %s, %s, %s, %s)",
            (restaurant_id, name, price, description, image, is_veg)
        )
        db.commit()
        return jsonify({"success": True, "message": "Item added successfully"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        cursor.close()
        db.close()

# Route that matches frontend URL: POST /restaurants/menu/<restaurant_id>
@restaurant_bp.route("/menu/<int:restaurant_id>", methods=["POST"])
def add_menu_item_by_restaurant(restaurant_id):
    data = request.json
    name = data.get("name")
    price = data.get("price")
    description = data.get("description", "")
    image = data.get("image", "https://images.unsplash.com/photo-1546069901-ba9599a7e63c")
    is_veg = data.get("isVeg", False)
    
    db = get_db()
    cursor = db.cursor()
    
    try:
        cursor.execute(
            "INSERT INTO menu_items (restaurant_id, name, price, description, image, is_veg) VALUES (%s, %s, %s, %s, %s, %s)",
            (restaurant_id, name, price, description, image, is_veg)
        )
        db.commit()
        return jsonify({"success": True, "message": "Item added successfully", "id": cursor.lastrowid})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        cursor.close()
        db.close()

@restaurant_bp.route("/menu/delete/<int:item_id>", methods=["DELETE"])
def delete_menu_item(item_id):
    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute("DELETE FROM menu_items WHERE id = %s", (item_id,))
        db.commit()
        return jsonify({"success": True, "message": "Item deleted"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        cursor.close()
        db.close()

@restaurant_bp.route("/orders/<int:restaurant_id>", methods=["GET"])
def get_restaurant_orders(restaurant_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        # Get orders for this restaurant
        cursor.execute("""
            SELECT o.*, u.name as user_name, u.phone as user_phone
            FROM orders o
            JOIN users u ON o.user_id = u.id
            WHERE o.restaurant_id = %s
            ORDER BY o.created_at DESC
        """, (restaurant_id,))
        orders = cursor.fetchall()

        # For each order, get items
        for o in orders:
            cursor.execute("""
                SELECT oi.quantity, m.name
                FROM order_items oi
                JOIN menu_items m ON oi.menu_item_id = m.id
                WHERE oi.order_id = %s
            """, (o['id'],))
            o['items'] = cursor.fetchall()
            if o.get('created_at'):
                o['created_at'] = str(o['created_at'])

        return jsonify(orders)
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        cursor.close()
        db.close()

@restaurant_bp.route("/order/status", methods=["POST"])
def update_order_status():
    data = request.json
    order_id = data.get("orderId")
    status = data.get("status")
    
    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute("UPDATE orders SET status = %s WHERE id = %s", (status, order_id))
        db.commit()
        return jsonify({"success": True, "message": f"Order status updated to {status}"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        cursor.close()
        db.close()
