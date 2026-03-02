import os, sys, traceback
sys.path.append(r'd:\online-food-ordering\backend')
import db

def run():
    try:
        conn = db.get_db()
        cur = conn.cursor()
        
        # Test if user 4 exists, if not create it
        cur.execute("SELECT id FROM users WHERE id = 4")
        if not cur.fetchone():
            print("User 4 not found. Inserting...")
            cur.execute("""
            INSERT INTO users (id, name, email, password, phone, role) 
            VALUES (4, 'customer', 'customer@example.com', 'password', '1234567890', 'user')
            """)
            conn.commit()
            print("User 4 inserted.")
        else:
            print("User 4 already exists.")
            
    except Exception as e:
        traceback.print_exc()

if __name__ == "__main__":
    run()
