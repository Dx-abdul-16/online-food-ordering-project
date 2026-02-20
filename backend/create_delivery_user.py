
import mysql.connector

def create_delivery_user():
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="638638",
            database="food_ordering"
        )
        cursor = conn.cursor()

        # Delivery User Details
        name = "Ramesh Delivery"
        username = "ramesh_delivery"
        email = "delivery@example.com"
        password = "password123" # Plain text to match current auth.py implementation
        phone = "9876543210"
        role = "delivery"
        is_approved = True 
        
        # Cleanup existing user if any
        try:
            cursor.execute("DELETE FROM users WHERE email = %s", (email,))
            conn.commit()
        except:
            pass

        try:
            cursor.execute("""
                INSERT INTO users (name, username, email, phone, password, role, is_approved)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (name, username, email, phone, password, role, is_approved))
            conn.commit()
            print(f"Delivery User Created Successfully!")
            print(f"Email: {email}")
            print(f"Password: {password}")
        except mysql.connector.Error as err:
            print(f"Error: {err}")

        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Connection failed: {e}")

if __name__ == "__main__":
    create_delivery_user()
