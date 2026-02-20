from db import get_db

def add_fulfillment_mode():
    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute("SHOW COLUMNS FROM orders LIKE 'fulfillment_mode'")
        if not cursor.fetchone():
            print("Adding fulfillment_mode column to orders table...")
            cursor.execute("ALTER TABLE orders ADD COLUMN fulfillment_mode VARCHAR(20) DEFAULT 'delivery' AFTER status")
            db.commit()
            print("Successfully added fulfillment_mode!")
        else:
            print("fulfillment_mode already exists.")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        cursor.close()
        db.close()

if __name__ == "__main__":
    add_fulfillment_mode()
