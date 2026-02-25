import mysql.connector
import os

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass  # In production (e.g. Railway), environment variables are injected automatically
def get_db():
    return mysql.connector.connect(
        host=os.getenv("MYSQLHOST", "localhost"),
        user=os.getenv("MYSQLUSER", "root"),
        password=os.getenv("MYSQLPASSWORD", "638638"),
        database=os.getenv("MYSQLDATABASE", "food_ordering"),
        port=int(os.getenv("MYSQLPORT", 3306)),
        use_pure=True  # Use pure-Python driver to avoid C-extension fido_callback error
    )
