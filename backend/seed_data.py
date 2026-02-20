
import mysql.connector
from db import get_db

def seed_data():
    conn = get_db()
    cursor = conn.cursor()

    try:
        print("Seeding data...")

        # 1. Create Users
        # Restaurant Owner
        cursor.execute("SELECT id FROM users WHERE email = 'restaurant@example.com'")
        if not cursor.fetchone():
            cursor.execute("""
                INSERT INTO users (name, username, email, phone, password, role, address)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, ("Restaurant Owner", "rest_owner", "restaurant@example.com", "9876543210", "pass123", "hotel", "Anna Nagar, Chennai"))
            print("Restaurant user created: restaurant@example.com / pass123")
        
        # Normal User
        cursor.execute("SELECT id FROM users WHERE email = 'user@example.com'")
        if not cursor.fetchone():
            cursor.execute("""
                INSERT INTO users (name, username, email, phone, password, role, address, latitude, longitude)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, ("John Doe", "johndoe", "user@example.com", "9123456780", "pass123", "user", "T. Nagar, Chennai", 13.0418, 80.2341))
            print("Normal user created: user@example.com / pass123")

        # 2. Create Restaurant
        cursor.execute("SELECT id FROM restaurants WHERE name = 'Spicy Chettinad Kitchen'")
        existing_rest = cursor.fetchone()
        
        restaurant_id = None
        if not existing_rest:
            cursor.execute("""
                INSERT INTO restaurants (name, cuisine, image, rating, delivery_time, location, price_for_two, is_veg, offer, latitude, longitude)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                "Spicy Chettinad Kitchen", 
                "South Indian, Chettinad", 
                "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&auto=format&fit=crop&q=60", 
                4.5, 
                "30-40 min", 
                "Anna Nagar, Chennai", 
                500, 
                0, 
                "20% OFF",
                13.0827, 
                80.2707
            ))
            restaurant_id = cursor.lastrowid
            print("Restaurant created: Spicy Chettinad Kitchen")
        else:
            restaurant_id = existing_rest[0]
            print(f"Restaurant already exists (ID: {restaurant_id})")

        # 3. Add Menu Items
        if restaurant_id:
            items = [
                ("Chicken Biryani", 250, "Authentic Seeraga samba chicken biryani", "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=60", 0),
                ("Paneer Butter Masala", 180, "Creamy paneer gravy with butter", "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=60", 1),
                ("Mutton Chukka", 320, "Spicy dry mutton fry", "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=60", 0),
                ("Parotta", 25, "Flaky layered parotta", "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=800&auto=format&fit=crop&q=60", 1)
            ]

            for item in items:
                cursor.execute("SELECT id FROM menu_items WHERE restaurant_id = %s AND name = %s", (restaurant_id, item[0]))
                if not cursor.fetchone():
                    cursor.execute("""
                        INSERT INTO menu_items (restaurant_id, name, price, description, image, is_veg)
                        VALUES (%s, %s, %s, %s, %s, %s)
                    """, (restaurant_id, item[0], item[1], item[2], item[3], item[4]))
                    print(f"Added menu item: {item[0]}")

        conn.commit()
        print("Data seeding completed successfully!")

    except Exception as e:
        print(f"Error seeding data: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    seed_data()
