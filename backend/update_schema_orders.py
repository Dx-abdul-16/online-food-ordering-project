
import mysql.connector

def update_schema_orders():
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="638638",
            database="food_ordering"
        )
        cursor = conn.cursor()

        try:
            cursor.execute("ALTER TABLE orders ADD COLUMN payment_method VARCHAR(50) DEFAULT 'cash'")
            print("Added payment_method column to orders table.")
        except mysql.connector.Error as err:
            print(f"Update failed (payment_method): {err}")

        try:
            cursor.execute("ALTER TABLE orders ADD COLUMN delivery_address TEXT")
            print("Added delivery_address column to orders table.")
        except mysql.connector.Error as err:
            print(f"Update failed (delivery_address): {err}")

        conn.commit()
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Connection failed: {e}")

if __name__ == "__main__":
    update_schema_orders()
