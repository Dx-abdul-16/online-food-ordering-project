
from flask import Blueprint, jsonify, request
from db import get_db

admin_bp = Blueprint("admin", __name__)

# --- GLOBAL STATS ---
@admin_bp.route("/stats", methods=["GET"])
def get_stats():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        # 1. Total Revenue (Sum of all orders)
        cursor.execute("SELECT SUM(total_amount) as revenue FROM orders")
        rev = cursor.fetchone()['revenue'] or 0
        
        # 2. Total Orders
        cursor.execute("SELECT COUNT(*) as count FROM orders")
        orders = cursor.fetchone()['count']
        
        # 3. Total Users
        cursor.execute("SELECT COUNT(*) as count FROM users WHERE role = 'user'")
        users = cursor.fetchone()['count']
        
        # 4. Total Restaurants
        cursor.execute("SELECT COUNT(*) as count FROM restaurants")
        restaurants = cursor.fetchone()['count']
        
        return jsonify({
            "revenue": float(rev),
            "orders": orders,
            "users": users,
            "restaurants": restaurants
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        db.close()

@admin_bp.route("/orders", methods=["GET"])
def get_all_orders():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("""
            SELECT o.*, u.name as user_name, r.name as restaurant_name
            FROM orders o
            JOIN users u ON o.user_id = u.id
            JOIN restaurants r ON o.restaurant_id = r.id
            ORDER BY o.created_at DESC
            LIMIT 50
        """)
        orders = cursor.fetchall()
        for o in orders:
            if o.get('created_at'):
                o['created_at'] = str(o['created_at'])
        return jsonify(orders)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        db.close()

# --- DELIVERY PARTNERS ---

@admin_bp.route("/partners", methods=["GET"])
def get_partners():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    # Fetch where role is 'delivery'
    cursor.execute("SELECT id, name, email, phone, is_approved FROM users WHERE role = 'delivery'")
    partners = cursor.fetchall()
    
    # Format boolean for JSON
    for p in partners:
        p['is_approved'] = bool(p['is_approved'])

    cursor.close()
    db.close()
    return jsonify(partners)

@admin_bp.route("/approve-partner/<int:id>", methods=["POST"])
def approve_partner(id):
    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute("UPDATE users SET is_approved = TRUE WHERE id = %s", (id,))
        db.commit()
        return jsonify({"success": True, "message": "Partner approved"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        cursor.close()
        db.close()

@admin_bp.route("/deny-partner/<int:id>", methods=["DELETE"])
def deny_partner(id):
    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute("DELETE FROM users WHERE id = %s", (id,))
        db.commit()
        return jsonify({"success": True, "message": "Partner denied/removed"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        cursor.close()
        db.close()

# --- RESTAURANTS ---
@admin_bp.route("/restaurants", methods=["GET"])
def get_all_restaurants():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT id, name, location, cuisine, rating FROM restaurants")
    restaurants = cursor.fetchall()
    cursor.close()
    db.close()
    return jsonify(restaurants)

@admin_bp.route("/restaurant/<int:id>", methods=["DELETE"])
def delete_restaurant(id):
    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute("DELETE FROM restaurants WHERE id = %s", (id,))
        db.commit()
        return jsonify({"success": True, "message": "Restaurant removed"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        cursor.close()
        db.close()

@admin_bp.route("/restaurant/add", methods=["POST"])
def add_restaurant():
    data = request.json
    # Basic adding logic (Admin adding manually)
    name = data.get("name")
    cuisine = data.get("cuisine")
    location = data.get("location")
    image = data.get("image")
    
    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute(
            "INSERT INTO restaurants (name, cuisine, location, image) VALUES (%s, %s, %s, %s)",
            (name, cuisine, location, image)
        )
        db.commit()
        return jsonify({"success": True, "message": "Restaurant added"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        cursor.close()
        db.close()

# --- SUPPORT TICKETS ---
@admin_bp.route("/support", methods=["GET"])
def get_tickets():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT t.id, t.subject, t.message, t.status, t.created_at, u.name as user_name, u.email as user_email
        FROM support_tickets t
        JOIN users u ON t.user_id = u.id
        ORDER BY t.created_at DESC
    """)
    tickets = cursor.fetchall()
    cursor.close()
    db.close()
    return jsonify(tickets)

@admin_bp.route("/support/resolve/<int:id>", methods=["POST"])
def resolve_ticket(id):
    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute("UPDATE support_tickets SET status = 'resolved' WHERE id = %s", (id,))
        db.commit()
        return jsonify({"success": True, "message": "Ticket marked resolved"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        cursor.close()
        db.close()
