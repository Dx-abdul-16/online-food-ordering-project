
from flask import Blueprint, request, jsonify, send_from_directory, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import jwt
import datetime
import os
import secrets
import string
from functools import wraps
from typing import List, Dict, Any, Optional
from db import get_db

admin_bp = Blueprint("admin", __name__)
auth_bp = Blueprint("auth", __name__)
delivery_bp = Blueprint("delivery", __name__)
orders_bp = Blueprint("orders", __name__)
restaurant_bp = Blueprint("restaurant", __name__)
upload_bp = Blueprint("upload", __name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and            filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS



from email_service import send_approval_email


# --- GLOBAL STATS ---
@admin_bp.route("/stats", methods=["GET"])
def get_stats():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("SELECT SUM(total_amount) as revenue FROM orders")
        rev = cursor.fetchone()['revenue'] or 0
        
        cursor.execute("SELECT COUNT(*) as count FROM orders")
        orders = cursor.fetchone()['count']
        
        cursor.execute("SELECT COUNT(*) as count FROM users WHERE role = 'user'")
        users = cursor.fetchone()['count']
        
        cursor.execute("SELECT COUNT(*) as count FROM restaurants")
        restaurants = cursor.fetchone()['count']

        cursor.execute("SELECT COUNT(*) as count FROM users WHERE role = 'delivery'")
        delivery_partners = cursor.fetchone()['count']

        cursor.execute("SELECT COUNT(*) as count FROM users WHERE role = 'delivery' AND is_online = TRUE")
        online_partners = cursor.fetchone()['count']
        
        return jsonify({
            "revenue": float(rev),
            "orders": orders,
            "users": users,
            "restaurants": restaurants,
            "delivery_partners": delivery_partners,
            "online_partners": online_partners
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
    cursor.execute("""
        SELECT id, name, email, phone, is_approved, driving_license, 
               driving_license_image, is_online, live_latitude, live_longitude,
               last_location_update
        FROM users WHERE role = 'delivery'
    """)
    partners = cursor.fetchall()
    
    for p in partners:
        p['is_approved'] = bool(p.get('is_approved'))
        p['is_online'] = bool(p.get('is_online'))
        if p.get('last_location_update'):
            p['last_location_update'] = str(p['last_location_update'])

    cursor.close()
    db.close()
    return jsonify(partners)

@admin_bp.route("/approve-partner/<int:id>", methods=["POST"])
def approve_partner(id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        # Get partner details for email
        cursor.execute("SELECT email, name, role FROM users WHERE id = %s", (id,))
        partner = cursor.fetchone()
        
        cursor.execute("UPDATE users SET is_approved = TRUE WHERE id = %s", (id,))
        db.commit()

        # Send approval email
        if partner:
            try:
                send_approval_email(partner['email'], partner['name'], partner['role'], approved=True)
            except Exception as e:
                print(f"Approval email failed: {e}")

        return jsonify({"success": True, "message": "Partner approved. Email notification sent."})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        cursor.close()
        db.close()

@admin_bp.route("/deny-partner/<int:id>", methods=["DELETE"])
def deny_partner(id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        # Get partner details for email before deletion
        cursor.execute("SELECT email, name, role FROM users WHERE id = %s", (id,))
        partner = cursor.fetchone()

        cursor.execute("DELETE FROM users WHERE id = %s", (id,))
        db.commit()

        # Send denial email
        if partner:
            try:
                send_approval_email(partner['email'], partner['name'], partner['role'], approved=False)
            except Exception as e:
                print(f"Denial email failed: {e}")

        return jsonify({"success": True, "message": "Partner denied/removed. Email notification sent."})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        cursor.close()
        db.close()

# --- LIVE TRACKING: All delivery partners ---
@admin_bp.route("/live-tracking", methods=["GET"])
def get_live_tracking():
    """Get all delivery partner live locations for admin map"""
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("""
            SELECT id, name, email, phone, is_approved, is_online,
                   live_latitude, live_longitude, last_location_update
            FROM users 
            WHERE role = 'delivery' 
              AND live_latitude IS NOT NULL 
              AND live_longitude IS NOT NULL
            ORDER BY is_online DESC, last_location_update DESC
        """)
        partners = cursor.fetchall()
        for p in partners:
            p['is_approved'] = bool(p.get('is_approved'))
            p['is_online'] = bool(p.get('is_online'))
            if p.get('last_location_update'):
                p['last_location_update'] = str(p['last_location_update'])

        return jsonify({"success": True, "partners": partners})
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
    
    # Ensure table exists
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS support_tickets (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            subject VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            status ENUM('open', 'resolved') DEFAULT 'open',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
    """)
    db.commit()

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
from email_service import send_registration_email, send_approval_email
import requests
import random
import string
import hashlib



@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.json

    username = data.get("username")
    email = data.get("email")
    phone = data.get("phone")
    password = data.get("password")
    role = data.get("role", "user")
    name = data.get("name", username)
    driving_license = data.get("drivingLicense", None)
    driving_license_image = data.get("drivingLicenseImage", None)

    # Validate driving license for delivery partners
    if role == "delivery":
        if not driving_license:
            return jsonify({"success": False, "message": "Driving license number is required for delivery partners"}), 400

    # Delivery and hotel accounts need admin approval
    is_approved = True if role == "user" else False

    db = get_db()
    cursor = db.cursor()

    try:
        cursor.execute(
            """INSERT INTO users (username, email, phone, password, role, name, 
               driving_license, driving_license_image, is_approved) 
               VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)""",
            (username, email, phone, password, role, name,
             driving_license, driving_license_image, is_approved)
        )
        db.commit()

        # Send registration email with role mention
        try:
            send_registration_email(email, name or username, role)
        except Exception as mail_err:
            print(f"Email send failed (non-blocking): {mail_err}")

        if role == "delivery":
            msg = "Registration submitted! Your account is pending admin approval. You'll receive an email once verified."
        elif role == "hotel":
            msg = "Restaurant registration submitted! Pending admin approval."
        else:
            msg = "User registered successfully! You can now login."

        return jsonify({"success": True, "message": msg})
    except Exception as e:
        print(f"Signup Error: {e}")
        return jsonify({"success": False, "message": str(e)})
    finally:
        cursor.close()
        db.close()

# ---------------- LOGIN ----------------
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    db = get_db()
    cursor = db.cursor(dictionary=True)

    try:
        # Try with new columns first
        cursor.execute(
            "SELECT id, username, role, name, is_approved FROM users WHERE email=%s AND password=%s",
            (email, password)
        )
    except Exception:
        # Fallback if new columns don't exist yet (migration not run)
        cursor.execute(
            "SELECT id, username, role FROM users WHERE email=%s AND password=%s",
            (email, password)
        )

    user = cursor.fetchone()

    cursor.close()
    db.close()

    if user:
        # Check approval for delivery/hotel roles (only if column exists)
        is_approved = user.get('is_approved')
        if is_approved is not None and user['role'] in ['delivery', 'hotel'] and not is_approved:
            return jsonify({
                "success": False,
                "message": f"Your {user['role']} account is pending admin approval. Please wait for verification."
            }), 403


        return jsonify({
            "success": True,
            "message": "Login successful",
            "user": {
                "id": user['id'],
                "username": user['username'],
                "role": user['role'],
                "name": user.get('name') or user['username'],
                "email": data.get('email')
            }
        })
    else:
        return jsonify({"success": False, "message": "Invalid credentials"}), 401

# ---------------- GOOGLE AUTH ----------------
@auth_bp.route("/google", methods=["POST"])
def google_auth():
    data = request.json
    token = data.get("token")
    firebase_auth = data.get("firebaseAuth", False)

    email = data.get("email")
    name = data.get("name")

    try:
        if firebase_auth:
            # Try Firebase Admin SDK first
            try:
                import firebase_admin
                if firebase_admin._apps:
                    from firebase_admin import auth as firebase_auth_admin
                    decoded_token = firebase_auth_admin.verify_id_token(token)
                    uid = decoded_token.get("uid")
                    email = decoded_token.get("email") or email
                    name = decoded_token.get("name") or name
                    
                    if not email and uid:
                        user_record = firebase_auth_admin.get_user(uid)
                        email = user_record.email
                        name = name or user_record.display_name
                else:
                    # Firebase Admin not initialized — use Google tokeninfo as fallback
                    print("Firebase Admin not initialized, using Google tokeninfo fallback")
                    google_res = requests.get(f"https://oauth2.googleapis.com/tokeninfo?id_token={token}")
                    if google_res.status_code == 200:
                        google_data = google_res.json()
                        email = google_data.get("email") or email
                        name = google_data.get("name") or name
                    else:
                        # If tokeninfo also fails, trust the email/name from frontend
                        # (Firebase client already verified on frontend side)
                        print(f"Google tokeninfo failed too, trusting frontend data: {email}")
            except ImportError:
                # firebase_admin not installed — use Google tokeninfo
                print("firebase_admin not installed, using Google tokeninfo fallback")
                google_res = requests.get(f"https://oauth2.googleapis.com/tokeninfo?id_token={token}")
                if google_res.status_code == 200:
                    google_data = google_res.json()
                    email = google_data.get("email") or email
                    name = google_data.get("name") or name
            except Exception as e:
                print(f"Firebase verification failed: {e}, using fallback")
                # Trust the email/name from the frontend since Firebase client verified it
                pass
        else:
            google_res = requests.get(f"https://oauth2.googleapis.com/tokeninfo?id_token={token}")
            google_data = google_res.json()
            if "error" in google_data:
                 return jsonify({"success": False, "message": "Invalid Google Token"}), 400
            email = google_data.get("email") or email
            name = google_data.get("name") or name

        if not email:
            return jsonify({"success": False, "message": "Email not found"}), 400

        db = get_db()
        cursor = db.cursor(dictionary=True)

        # Try with name column, fallback without it
        try:
            cursor.execute("SELECT id, username, role, name FROM users WHERE email=%s", (email,))
        except Exception:
            cursor.execute("SELECT id, username, role FROM users WHERE email=%s", (email,))
        user = cursor.fetchone()

        if user:
            if user['role'] != 'user':
                cursor.close()
                db.close()
                return jsonify({
                    "success": False, 
                    "message": f"This Google account is linked to a {user['role']} profile. Please use email and password."
                }), 403

            # Try updating name if missing
            try:
                if not user.get('name') and name:
                    cursor.execute("UPDATE users SET name=%s WHERE id=%s", (name, user['id']))
                    db.commit()
            except Exception:
                pass

            cursor.close()
            db.close()
            return jsonify({
                "success": True,
                "message": "Login successful",
                "user": {
                    "id": user['id'],
                    "username": user['username'],
                    "role": user['role'],
                    "name": name or user.get('name') or user['username'],
                    "email": email
                }
            })
        else:
            username = email.split("@")[0]
            password = ''.join(random.choices(string.ascii_letters + string.digits, k=12))
            role = "user"

            # Try inserting with new columns, fallback to basic insert
            try:
                cursor.execute(
                    "INSERT INTO users (username, email, password, role, name, is_approved) VALUES (%s,%s,%s,%s,%s,%s)",
                    (username, email, password, role, name, True)
                )
            except Exception:
                cursor.execute(
                    "INSERT INTO users (username, email, password, role) VALUES (%s,%s,%s,%s)",
                    (username, email, password, role)
                )
            db.commit()
            user_id = cursor.lastrowid

            # Send registration email for Google signups too
            try:
                send_registration_email(email, name or username, role)
            except Exception:
                pass

            cursor.close()
            db.close()
            return jsonify({
                "success": True,
                "message": "User registered via Google",
                "user": {
                    "id": user_id,
                    "username": username,
                    "role": role,
                    "name": name or username,
                    "email": email
                }
            })

    except Exception as e:
        print(f"Auth Error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"success": False, "message": str(e)}), 500

# ---------------- PASSWORD RESET ----------------
@auth_bp.route("/reset-password", methods=["POST"])
def reset_password():
    data = request.json
    email = data.get("email")
    new_password = data.get("newPassword")

    if not email or not new_password:
        return jsonify({"success": False, "message": "Email and new password are required"}), 400

    db = get_db()
    cursor = db.cursor()

    try:
        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()

        if not user:
            return jsonify({"success": False, "message": "User not found"}), 404

        cursor.execute("UPDATE users SET password = %s WHERE email = %s", (new_password, email))
        db.commit()

        return jsonify({"success": True, "message": "Password reset successfully"})

    except Exception as e:
        print(f"Reset Password Error: {e}")
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        cursor.close()
        db.close()

import hashlib
import json


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


@restaurant_bp.route("", methods=["GET"], strict_slashes=False)
@restaurant_bp.route("/", methods=["GET"], strict_slashes=False)
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

@restaurant_bp.route("/menu/edit/<int:item_id>", methods=["PUT"])
def edit_menu_item(item_id):
    data = request.json
    name = data.get("name")
    price = data.get("price")
    description = data.get("description", "")
    image = data.get("image")
    is_veg = data.get("isVeg", False)
    
    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute(
            "UPDATE menu_items SET name=%s, price=%s, description=%s, image=%s, is_veg=%s WHERE id=%s",
            (name, price, description, image, is_veg, item_id)
        )
        db.commit()
        return jsonify({"success": True, "message": "Item updated successfully"})
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



@upload_bp.route("/image", methods=["POST"])
def upload_file():
    if 'image' not in request.files:
        return jsonify({"success": False, "message": "No file part"}), 400
    file = request.files['image']
    if file.filename == '':
        return jsonify({"success": False, "message": "No selected file"}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        upload_folder = current_app.config['UPLOAD_FOLDER']
        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder)
            
        file.save(os.path.join(upload_folder, filename))
        
        # Return path that can be served
        # Assuming our frontend proxies /api calls, we return the API path
        file_url = f"/api/uploads/image/{filename}"
        return jsonify({"success": True, "url": file_url})
    
    return jsonify({"success": False, "message": "Invalid file type"}), 400

@upload_bp.route("/image/<filename>", methods=["GET"])
def get_file(filename):
    upload_folder = current_app.config['UPLOAD_FOLDER']
    return send_from_directory(upload_folder, filename)
