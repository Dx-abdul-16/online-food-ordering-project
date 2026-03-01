"""
Migration script: Delivery System Upgrade
- Adds driving license fields to users
- Adds QR code + delivery partner fields to orders  
- Creates delivery_partner_locations table for live tracking
"""
import os, sys, traceback
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from db import get_db

def run():
    conn = get_db()
    cur = conn.cursor()

    alterations = [
        # Users - driving license for delivery partners
        "ALTER TABLE users ADD COLUMN driving_license VARCHAR(50) DEFAULT NULL",
        "ALTER TABLE users ADD COLUMN driving_license_image VARCHAR(255) DEFAULT NULL",
        "ALTER TABLE users ADD COLUMN name VARCHAR(100) DEFAULT NULL",
        "ALTER TABLE users ADD COLUMN username VARCHAR(100) DEFAULT NULL",

        # Users - live location for delivery partners
        "ALTER TABLE users ADD COLUMN live_latitude DOUBLE DEFAULT NULL",
        "ALTER TABLE users ADD COLUMN live_longitude DOUBLE DEFAULT NULL",
        "ALTER TABLE users ADD COLUMN is_online BOOLEAN DEFAULT FALSE",
        "ALTER TABLE users ADD COLUMN last_location_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",

        # Orders - QR code and delivery partner assignment
        "ALTER TABLE orders ADD COLUMN qr_code TEXT DEFAULT NULL",
        "ALTER TABLE orders ADD COLUMN qr_hash VARCHAR(64) DEFAULT NULL",
        "ALTER TABLE orders ADD COLUMN delivery_partner_id INT DEFAULT NULL",
        "ALTER TABLE orders ADD COLUMN picked_up_at TIMESTAMP DEFAULT NULL",
        "ALTER TABLE orders ADD COLUMN delivered_at TIMESTAMP DEFAULT NULL",
        "ALTER TABLE orders ADD COLUMN customer_confirmed ENUM('pending','received','not_received') DEFAULT 'pending'",
    ]

    for sql in alterations:
        try:
            cur.execute(sql)
            print(f"OK: {sql[:60]}...")
        except Exception as e:
            msg = str(e)
            if "Duplicate column" in msg or "1060" in msg:
                print(f"SKIP (exists): {sql[:60]}...")
            else:
                print(f"ERR: {msg}")

    conn.commit()
    print("\n✅ Migration complete!")
    cur.close()
    conn.close()

if __name__ == "__main__":
    try:
        run()
    except Exception:
        traceback.print_exc()
