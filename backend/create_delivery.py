from db import get_db

def create_delivery_partner():
    db = get_db()
    cursor = db.cursor()
    
    username = "delivery_pro"
    email = "delivery@foodexpress.com"
    password = "delivery123"
    role = "delivery"
    name = "Delivery Partner Pro"
    phone = "9876543210"
    
    try:
        # Check if user already exists
        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        if cursor.fetchone():
            print(f"User with email {email} already exists.")
            return

        print(f"Creating delivery partner: {name}")
        cursor.execute(
            "INSERT INTO users (username, email, password, role, name, phone, is_approved) VALUES (%s, %s, %s, %s, %s, %s, %s)",
            (username, email, password, role, name, phone, True) # Setting is_approved to True so they can login immediately
        )
        db.commit()
        print("Delivery partner created successfully!")
        print(f"Login Email: {email}")
        print(f"Login Password: {password}")
            
    except Exception as e:
        print(f"Error: {e}")
    finally:
        cursor.close()
        db.close()

if __name__ == "__main__":
    create_delivery_partner()
