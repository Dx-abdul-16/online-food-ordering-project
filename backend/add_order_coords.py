from db import get_db

def add_order_coords():
    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute("SHOW COLUMNS FROM orders LIKE 'latitude'")
        if not cursor.fetchone():
            print("Adding latitude and longitude to orders table...")
            cursor.execute("ALTER TABLE orders ADD COLUMN latitude FLOAT, ADD COLUMN longitude FLOAT")
            db.commit()
            print("Successfully added coordinates!")
        else:
            print("Coordinates already exist.")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        cursor.close()
        db.close()

if __name__ == "__main__":
    add_order_coords()
