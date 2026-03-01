import os, sys
from dotenv import load_dotenv

# Load the backend .env file explicitly
env_path = os.path.join(os.path.dirname(__file__), "backend", ".env")
load_dotenv(env_path)

sys.path.append(os.path.join(os.path.dirname(__file__), "backend"))
import db

def run_fix():
    print("Connecting to Aiven database...")
    conn = db.get_db()
    cur = conn.cursor()
    
    print("Fixing missing columns...")
    
    try:
        cur.execute("ALTER TABLE users ADD COLUMN is_approved BOOLEAN DEFAULT FALSE")
        print("✅ Added 'is_approved' to users table.")
    except Exception as e:
        if "Duplicate column" in str(e):
            print("✔️ 'is_approved' already exists in users.")
        else:
            print("❌ Error adding is_approved:", e)

    try:
        cur.execute("ALTER TABLE restaurants ADD COLUMN owner_id INT DEFAULT NULL")
        print("✅ Added 'owner_id' to restaurants table.")
    except Exception as e:
        if "Duplicate column" in str(e):
            print("✔️ 'owner_id' already exists in restaurants.")
        else:
            print("❌ Error adding owner_id:", e)
            
    try:
        cur.execute("ALTER TABLE users AUTO_INCREMENT = 20")
        print("✅ Fixed AUTO_INCREMENT for users table.")
    except Exception as e:
        pass

    conn.commit()
    cur.close()
    conn.close()
    print("\n✅ All database fixes completed!")

if __name__ == "__main__":
    run_fix()
