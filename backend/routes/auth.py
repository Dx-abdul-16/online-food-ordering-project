from flask import Blueprint, request, jsonify
from db import get_db
import requests
import random
import string

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.json

    username = data.get("username")
    email = data.get("email")
    phone = data.get("phone")
    password = data.get("password")
    role = data.get("role", "user")

    db = get_db()
    cursor = db.cursor()

    try:
        cursor.execute(
            "INSERT INTO users (username, email, phone, password, role) VALUES (%s,%s,%s,%s,%s)",
            (username, email, phone, password, role)
        )
        db.commit()
        return jsonify({"success": True, "message": "User registered"})
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

    cursor.execute(
        "SELECT id, username, role, name FROM users WHERE email=%s AND password=%s",
        (email, password)
    )

    user = cursor.fetchone()

    cursor.close()
    db.close()

    if user:
        return jsonify({
            "success": True,
            "message": "Login successful",
            "user": {
                "id": user['id'],
                "username": user['username'],
                "role": user['role'],
                "name": user['name'] if user['name'] else ""
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

    email = None
    name = None

    try:
        if firebase_auth:
            # Verify the Firebase Token
            from firebase_admin import auth as firebase_auth_admin
            try:
                decoded_token = firebase_auth_admin.verify_id_token(token)
                uid = decoded_token.get("uid")
                email = decoded_token.get("email")
                name = decoded_token.get("name")
                print(f"DEBUG: Token UID: {uid}, Email: {email}, Name: {name}", flush=True)
                
                # If email is missing in token, fetch from Firebase user record
                if not email and uid:
                    user_record = firebase_auth_admin.get_user(uid)
                    print(f"DEBUG: Fetched UserRecord: {vars(user_record)}", flush=True)
                    email = user_record.email
                    name = name or user_record.display_name
                    print(f"DEBUG: Fetched Record Email: {email}, Name: {name}", flush=True)
            except Exception as e:
                import traceback
                traceback.print_exc()
                print(f"Firebase Token Verification Failed: {e}")
                return jsonify({"success": False, "message": f"Firebase Verification Failed: {str(e)}"}), 401
        else:
            # Standard Google Verify
            google_res = requests.get(f"https://oauth2.googleapis.com/tokeninfo?id_token={token}")
            google_data = google_res.json()
            if "error" in google_data:
                 return jsonify({"success": False, "message": "Invalid Google Token"}), 400
            email = google_data.get("email")
            name = google_data.get("name")

        if not email:
            return jsonify({"success": False, "message": "Email not found"}), 400

        # Check if user exists
        db = get_db()
        cursor = db.cursor(dictionary=True)

        cursor.execute("SELECT id, username, role, name FROM users WHERE email=%s", (email,))
        user = cursor.fetchone()

        if user:
            # Login existing user - ensure they are a regular 'user'
            if user['role'] != 'user':
                return jsonify({
                    "success": False, 
                    "message": f"This Google account is linked to a {user['role']} profile. Please use email and password to access the specialized dashboard."
                }), 403

            if not user['name'] and name:
                cursor.execute("UPDATE users SET name=%s WHERE id=%s", (name, user['id']))
                db.commit()

            return jsonify({
                "success": True,
                "message": "Login successful",
                "user": {
                    "id": user['id'],
                    "username": user['username'],
                    "role": user['role'],
                    "name": name if name else user['name']
                }
            })
        else:
            # Register new user
            username = email.split("@")[0]
            password = ''.join(random.choices(string.ascii_letters + string.digits, k=12))
            role = "user"

            cursor.execute(
                "INSERT INTO users (username, email, password, role, name) VALUES (%s,%s,%s,%s,%s)",
                (username, email, password, role, name)
            )
            db.commit()
            user_id = cursor.lastrowid

            return jsonify({
                "success": True,
                "message": "User registered via Google",
                "user": {
                    "id": user_id,
                    "username": username,
                    "role": role,
                    "name": name
                }
            })

    except Exception as e:
        print(f"Auth Error: {e}")
        return jsonify({"success": False, "message": str(e)}), 500

# ---------------- PASSWORD RESET (MOCK) ----------------
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
        # Check if user exists
        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()

        if not user:
            return jsonify({"success": False, "message": "User not found"}), 404

        # Update password
        cursor.execute("UPDATE users SET password = %s WHERE email = %s", (new_password, email))
        db.commit()

        return jsonify({"success": True, "message": "Password reset successfully"})

    except Exception as e:
        print(f"Reset Password Error: {e}")
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        cursor.close()
        db.close()
