
import mysql.connector

def update_schema():
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="638638",
            database="food_ordering"
        )
        cursor = conn.cursor()

        # Add columns if they don't exist
        try:
            cursor.execute("ALTER TABLE restaurants ADD COLUMN latitude FLOAT")
            cursor.execute("ALTER TABLE restaurants ADD COLUMN longitude FLOAT")
            print("Restaurant location columns added.")
        except Exception as e:
            print("Restaurant columns might already exist:", e)

        try:
            cursor.execute("ALTER TABLE users ADD COLUMN latitude FLOAT")
            cursor.execute("ALTER TABLE users ADD COLUMN longitude FLOAT")
            cursor.execute("ALTER TABLE users ADD COLUMN address TEXT")
            print("User location columns added.")
        except Exception as e:
            print("User columns might already exist:", e)

        # Create Delivery Tracking table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS delivery_tracking (
            id INT AUTO_INCREMENT PRIMARY KEY,
            order_id INT NOT NULL,
            latitude FLOAT NOT NULL,
            longitude FLOAT NOT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
        )
        """)
        print("Delivery tracking table created.")
        
        # Insert sample data for testing
        cursor.execute("UPDATE restaurants SET latitude = 13.0827, longitude = 80.2707 WHERE id = 1")
        
        conn.commit()
        cursor.close()
        conn.close()
        print("Schema update successful.")
        
    except Exception as e:
        print("Schema update failed:", e)

if __name__ == "__main__":
    update_schema()
