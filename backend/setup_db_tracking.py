import os, sys, traceback
sys.path.append(r'd:\online-food-ordering\backend')
import db

def setup_db():
    conn = db.get_db()
    cur = conn.cursor()

    print("Checking and creating tables...")

    cur.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        restaurant_id INT NOT NULL,
        total_amount FLOAT NOT NULL,
        payment_method VARCHAR(50),
        payment_id VARCHAR(100),
        status VARCHAR(50) DEFAULT 'pending',
        delivery_address TEXT,
        fulfillment_mode VARCHAR(50) DEFAULT 'delivery',
        latitude DOUBLE,
        longitude DOUBLE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
    )
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        menu_item_id INT NOT NULL,
        quantity INT NOT NULL,
        price FLOAT NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE
    )
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS delivery_tracking (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        latitude DOUBLE,
        longitude DOUBLE,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    )
    """)

    # Attempt to add columns to restaurants as well if missing
    try:
        cur.execute("ALTER TABLE restaurants ADD COLUMN latitude DOUBLE DEFAULT 11.0168")
        cur.execute("ALTER TABLE restaurants ADD COLUMN longitude DOUBLE DEFAULT 76.9558")
    except Exception:
        pass

    conn.commit()
    print("All necessary tables created/verified!")

if __name__ == "__main__":
    try:
        setup_db()
    except Exception as e:
        traceback.print_exc()

