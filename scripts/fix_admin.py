import os, sys
from dotenv import load_dotenv

env_path = os.path.join(os.path.dirname(__file__), "backend", ".env")
load_dotenv(env_path)
sys.path.append(os.path.join(os.path.dirname(__file__), "backend"))
import db

def run_fix():
    print("Connecting to Aiven database...")
    conn = db.get_db()
    cur = conn.cursor()
    
    print("Creating support_tickets table...")
    
    try:
        cur.execute("""
        CREATE TABLE IF NOT EXISTS support_tickets (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            subject VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            status ENUM('open', 'resolved') DEFAULT 'open',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
        """)
        print("✅ Added 'support_tickets' table.")
    except Exception as e:
        print("❌ Error adding table:", e)

    conn.commit()
    cur.close()
    conn.close()
    print("\n✅ Admin missing tables fixed!")

if __name__ == "__main__":
    run_fix()
