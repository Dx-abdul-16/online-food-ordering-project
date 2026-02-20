from db import get_db

try:
    db = get_db()
    cursor = db.cursor()
    cursor.execute("DESCRIBE users")
    columns = cursor.fetchall()
    print("Users Table Schema:")
    for col in columns:
        print(col)
    cursor.close()
    db.close()
except Exception as e:
    print(f"Error: {e}")
