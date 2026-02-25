from flask import Flask
from flask_cors import CORS
from routes.auth import auth_bp
from routes.admin import admin_bp
from routes.restaurant import restaurant_bp
from routes.upload import upload_bp
from routes.orders import orders_bp
from routes.delivery import delivery_bp
import firebase_admin
from firebase_admin import credentials
import os

# Initialize Firebase Admin
base_dir = os.path.dirname(os.path.abspath(__file__))
cred_path = os.path.join(base_dir, 'firebase-service-account.json')
if os.path.exists(cred_path):
    if not firebase_admin._apps:
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
else:
    print("Warning: firebase-service-account.json not found. Firebase features will be disabled.")

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = os.path.join(os.getcwd(), 'uploads')
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

CORS(app)
app.register_blueprint(admin_bp,      url_prefix="/api/admin")
app.register_blueprint(auth_bp,       url_prefix="/api/auth")
app.register_blueprint(restaurant_bp, url_prefix="/api/restaurants")
app.register_blueprint(upload_bp,     url_prefix="/api/uploads")
app.register_blueprint(orders_bp,     url_prefix="/api/orders")
app.register_blueprint(delivery_bp,   url_prefix="/api/delivery")

@app.route("/")
def home():
    return {"status": "FoodExpress Backend running ✓"}

@app.route("/debug")
def debug_route():
    try:
        from db import get_db
        conn = get_db()
        cur = conn.cursor(dictionary=True)
        cur.execute("SELECT id FROM users")
        res = cur.fetchall()
        return {"users": res}
    except Exception as e:
        return {"error": str(e)}
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
