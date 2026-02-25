from db import get_db

def init_db():
    db = get_db()
    cursor = db.cursor()

    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS restaurants (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        cuisine VARCHAR(100),
        image VARCHAR(255),
        rating FLOAT DEFAULT 0.0,
        delivery_time VARCHAR(50),
        location VARCHAR(100),
        price_for_two INT,
        is_veg BOOLEAN DEFAULT FALSE
    )
    """)

   
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS menu_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        restaurant_id INT NOT NULL,
        name VARCHAR(100) NOT NULL,
        price FLOAT NOT NULL,
        description VARCHAR(255),
        image VARCHAR(255),
        is_veg BOOLEAN DEFAULT TRUE,
        FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
    )
    """)

    cursor.execute("SELECT COUNT(*) FROM restaurants")
    count = cursor.fetchone()[0]

    if count == 0:
        print("Seeding data...")
       
        cursor.execute("""
            INSERT INTO restaurants (name, cuisine, image, rating, delivery_time, location, price_for_two, is_veg)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            "Taj Mahal Kitchen", "North Indian, Mughlai", 
            "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop",
            4.5, "25-30 min", "Andheri West", 500, False
        ))
        r1_id = cursor.lastrowid

      
        menu_items_r1 = [
            ("Butter Chicken", 350, "Rich and creamy tomato gravy with tender chicken pieces.", "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=200&h=200&fit=crop", False),
            ("Garlic Naan", 40, "Soft bread topped with garlic and butter.", "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=200&h=200&fit=crop", True),
            ("Chicken Biryani", 280, "Aromatic basmati rice cooked with spices and chicken.", "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&h=200&fit=crop", False),
            ("Paneer Tikka Masala", 250, "Marinated paneer cheese served in a spiced gravy.", "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200&h=200&fit=crop", True)
        ]
        
        for item in menu_items_r1:
            cursor.execute("""
                INSERT INTO menu_items (restaurant_id, name, price, description, image, is_veg)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (r1_id, *item))

       
        cursor.execute("""
            INSERT INTO restaurants (name, cuisine, image, rating, delivery_time, location, price_for_two, is_veg)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            "Green Leaf Restaurant", "South Indian, Pure Veg", 
            "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400&h=300&fit=crop",
            4.3, "20-25 min", "Bandra", 350, True
        ))
        r2_id = cursor.lastrowid
        
        menu_items_r2 = [
             ("Masala Dosa", 120, "Crispy crepe filled with spiced potato mix.", "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=200&h=200&fit=crop", True),
             ("Idli Sambar", 80, "Steamed rice cakes served with lentil soup.", "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=200&h=200&fit=crop", True),
             ("Uttapam", 140, "Thick savory pancake with vegetable toppings.", "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=200&h=200&fit=crop", True)
        ]
        
        for item in menu_items_r2:
            cursor.execute("""
                INSERT INTO menu_items (restaurant_id, name, price, description, image, is_veg)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (r2_id, *item))

        db.commit()
        print("Tables created and data seeded successfully.")
    else:
        print("Tables already exist and have data.")
        
    cursor.close()
    db.close()

if __name__ == "__main__":
    init_db()
