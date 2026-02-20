from db import get_db

try:
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SHOW TABLES")
    tables = cursor.fetchall()
    print("Tables:", tables)
    cursor.close()
    db.close()
except Exception as e:
    print(f"Error: {e}")
