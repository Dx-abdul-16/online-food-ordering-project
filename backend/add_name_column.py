import mysql.connector
from db import get_db

def add_name_column():
    try:
        db = get_db()
        cursor = db.cursor()
        
        # Check if 'name' column exists
        cursor.execute("DESCRIBE users")
        columns = [col[0] for col in cursor.fetchall()]
        
        if 'name' not in columns:
            print("Adding 'name' column to users table...")
            cursor.execute("ALTER TABLE users ADD COLUMN name VARCHAR(100) AFTER id")
            db.commit()
            print("Column added successfully.")
        else:
            print("'name' column already exists.")
            
        cursor.close()
        db.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    add_name_column()
