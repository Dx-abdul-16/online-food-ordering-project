from flask import Flask
from flask_mysqldb import MySQL
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

mysql = MySQL(app)

def test_db_connection():
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT DATABASE()")
        db = cur.fetchone()
        cur.close()
        print("✅ Database connected:", db)
    except Exception as e:
        print("❌ Database connection failed:", e)

def test_users_table():
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM users LIMIT 1")
        result = cur.fetchone()
        cur.close()
        print("✅ Users table accessible:", result)
    except Exception as e:
        print("❌ Users table error:", e)

if __name__ == "__main__":
    test_db_connection()
    test_users_table()
