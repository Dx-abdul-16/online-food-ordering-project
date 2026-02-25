import os, sys, traceback
sys.path.append(r'd:\online-food-ordering\backend')
import db

def run():
    try:
        conn = db.get_db()
        cur = conn.cursor()
        
        # Test if columns exist, if not create them
        try:
            cur.execute("ALTER TABLE orders ADD COLUMN fulfillment_mode VARCHAR(50) DEFAULT 'delivery'")
        except Exception as e:
            print("fulfillment_mode:", e)
            
        try:
            cur.execute("ALTER TABLE orders ADD COLUMN latitude DOUBLE")
        except Exception as e:
            print("latitude:", e)
            
        try:
            cur.execute("ALTER TABLE orders ADD COLUMN longitude DOUBLE")
        except Exception as e:
            print("longitude:", e)
            
        try:
            cur.execute("ALTER TABLE orders ADD COLUMN delivery_address TEXT")
        except Exception as e:
            print("delivery_address:", e)
            
        try:
            cur.execute("ALTER TABLE orders ADD COLUMN payment_id VARCHAR(100)")
        except Exception as e:
            print("payment_id:", e)
        
        print("Done altering.")
        conn.commit()
    except Exception as e:
        traceback.print_exc()

if __name__ == "__main__":
    with open('output.txt', 'w') as f:
        sys.stdout = f
        sys.stderr = f
        run()
