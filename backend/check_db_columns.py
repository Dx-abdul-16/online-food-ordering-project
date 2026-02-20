from db import get_db

def check_orders_columns():
    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute("DESCRIBE orders")
        columns = cursor.fetchall()
        print("Columns in 'orders' table:")
        for col in columns:
            print(col)
            
        cursor.execute("DESCRIBE order_items")
        columns = cursor.fetchall()
        print("\nColumns in 'order_items' table:")
        for col in columns:
            print(col)
            
    except Exception as e:
        print(f"Error: {e}")
    finally:
        cursor.close()
        db.close()

if __name__ == "__main__":
    check_orders_columns()
