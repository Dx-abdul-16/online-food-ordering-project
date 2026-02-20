from db import get_db

def add_payment_id_column():
    db = get_db()
    cursor = db.cursor()
    try:
        # Check if column exists
        cursor.execute("SHOW COLUMNS FROM orders LIKE 'payment_id'")
        result = cursor.fetchone()
        
        if not result:
            print("Adding payment_id column to orders table...")
            cursor.execute("ALTER TABLE orders ADD COLUMN payment_id VARCHAR(255) NULL AFTER payment_method")
            db.commit()
            print("Column added successfully!")
        else:
            print("payment_id column already exists.")
            
    except Exception as e:
        print(f"Error: {e}")
    finally:
        cursor.close()
        db.close()

if __name__ == "__main__":
    add_payment_id_column()
