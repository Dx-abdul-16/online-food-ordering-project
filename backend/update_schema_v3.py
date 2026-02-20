
import mysql.connector

def update_schema_restaurant_owner():
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="638638",
            database="food_ordering"
        )
        cursor = conn.cursor()

        # Add owner_id to restaurants table
        try:
            cursor.execute("ALTER TABLE restaurants ADD COLUMN owner_id INT")
            cursor.execute("ALTER TABLE restaurants ADD FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL")
            print("Added owner_id column to restaurants table.")
        except Exception as e:
            print("Column owner_id might already exist:", e)

        # Link the seeded restaurant to the seeded restaurant owner
        try:
            # Get ID of 'restaurant@example.com'
            cursor.execute("SELECT id FROM users WHERE email = 'restaurant@example.com'")
            user = cursor.fetchone()
            
            # Get ID of 'Spicy Chettinad Kitchen'
            cursor.execute("SELECT id FROM restaurants WHERE name = 'Spicy Chettinad Kitchen'")
            rest = cursor.fetchone()

            if user and rest:
                user_id = user[0]
                rest_id = rest[0]
                cursor.execute("UPDATE restaurants SET owner_id = %s WHERE id = %s", (user_id, rest_id))
                conn.commit()
                print(f"Linked Restaurant Owner (ID: {user_id}) to Restaurant (ID: {rest_id})")
            else:
                print("Could not find seeded user or restaurant to link.")

        except Exception as e:
            print("Error linking owner:", e)
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print("Schema update failed:", e)

if __name__ == "__main__":
    update_schema_restaurant_owner()
