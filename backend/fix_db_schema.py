from db import get_db

def inspect_orders_table():
    db = get_db()
    cursor = db.cursor()
    cursor.execute("DESCRIBE orders")
    columns = [row[0] for row in cursor.fetchall()]
    print(f"Orders columns: {columns}")
    
    required_in_sql = ['user_id', 'restaurant_id', 'total_amount', 'payment_method', 'payment_id', 'delivery_address', 'status']
    for col in required_in_sql:
        if col not in columns:
            print(f"CRITICAL MISSING COLUMN: {col}")
            
    cursor.execute("DESCRIBE order_items")
    columns_items = [row[0] for row in cursor.fetchall()]
    print(f"OrderItems columns: {columns_items}")
    
    required_items = ['order_id', 'menu_item_id', 'quantity', 'price']
    for col in required_items:
        if col not in columns_items:
            print(f"CRITICAL MISSING COLUMN in order_items: {col}")

if __name__ == "__main__":
    inspect_orders_table()
