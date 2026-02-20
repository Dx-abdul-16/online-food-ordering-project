
import mysql.connector

def update_schema_admin_features():
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="638638",
            database="food_ordering"
        )
        cursor = conn.cursor()

        # 1. Add approval status to users
        try:
            cursor.execute("ALTER TABLE users ADD COLUMN is_approved BOOLEAN DEFAULT TRUE") 
            # Default TRUE for existing users, future logic can handle new registrants
            print("Added is_approved column to users table.")
        except Exception as e:
            print("Column is_approved might already exist:", e)

        # 2. Create Support Tickets Table
        try:
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS support_tickets (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id INT NOT NULL,
                    subject VARCHAR(200) NOT NULL,
                    message TEXT NOT NULL,
                    status VARCHAR(20) DEFAULT 'open',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                )
            """)
            print("Created support_tickets table.")
        except Exception as e:
            print("Error creating support_tickets:", e)

        # 3. Seed some mock support tickets
        try:
             # Get a user ID
            cursor.execute("SELECT id FROM users LIMIT 1")
            user = cursor.fetchone()
            if user:
                cursor.execute("INSERT INTO support_tickets (user_id, subject, message) VALUES (%s, %s, %s)", 
                               (user[0], "Payment Issue", "I paid but status is pending."))
                cursor.execute("INSERT INTO support_tickets (user_id, subject, message) VALUES (%s, %s, %s)", 
                               (user[0], "Late Delivery", "My order #123 was 30 mins late."))
                conn.commit()
                print("Seeded mock support tickets.")
        except Exception as e:
            print("Error seeding tickets:", e)

        conn.close()
        
    except Exception as e:
        print("Schema update failed:", e)

if __name__ == "__main__":
    update_schema_admin_features()
