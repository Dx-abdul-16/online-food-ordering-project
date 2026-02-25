import os, sys, traceback
sys.path.append(r'd:\online-food-ordering\backend')
import db

def run():
    conn = db.get_db()
    cur = conn.cursor()

    # ensure columns exist
    try: cur.execute("ALTER TABLE users ADD COLUMN username VARCHAR(50)")
    except: pass
    try: cur.execute("ALTER TABLE users ADD COLUMN latitude DOUBLE")
    except: pass
    try: cur.execute("ALTER TABLE users ADD COLUMN longitude DOUBLE")
    except: pass
    try: cur.execute("ALTER TABLE users ADD COLUMN address TEXT")
    except: pass
    try: cur.execute("ALTER TABLE users ADD COLUMN status INT DEFAULT 1")
    except: pass
    
    # Increase password length just in case
    try: cur.execute("ALTER TABLE users MODIFY COLUMN password VARCHAR(255)")
    except: pass

    data_raw = """1	Admin		admin@gmail.com		Admin@123456	admin	2026-02-10 20:01:08				1
2	rest_owner	Restaurant Owner	restaurant@example.com	9876543210	pass123	hotel	2026-02-18 23:38:50			Anna Nagar, Chennai	1
3	johndoe	John Doe	user@example.com	9123456780	pass123	user	2026-02-18 23:38:50	13.0418	80.2341	T. Nagar, Chennai	1
5	ramesh_delivery	Ramesh Delivery	delivery@example.com	9876543210	password123	delivery	2026-02-19 00:08:05				1
6	arabiya_owner	Street Arabiya Owner	arabiya@foodexpress.in	9629075139	arabiya123	hotel	2026-02-20 18:08:23	11.0036	76.9639	Podanur Main Road, Coimbatore	1
7	albait_owner	Al-Bait Owner	albait@foodexpress.in	9876543221	albait123	hotel	2026-02-20 18:08:23	11.0339	76.9559	Sai Baba Colony, Coimbatore	1
8	biriyani_owner	Biriyani Palace Owner	biriyani@foodexpress.in	9345678901	biriyani123	hotel	2026-02-20 18:08:23	11.0075	76.953	RS Puram, Coimbatore	1
9	delivery_pro	Delivery Partner Pro	delivery@foodexpress.com	9876543210	delivery123	delivery	2026-02-20 21:34:01				1"""

    lines = data_raw.split('\n')
    for line in lines:
        if not line.strip(): continue
        parts = line.split('\t')
        
        while len(parts) < 12:
            parts.append('')
            
        uid = int(parts[0]) if parts[0].strip() else None
        username = parts[1].strip()
        name = parts[2].strip()
        email = parts[3].strip()
        phone = parts[4].strip()
        pwd = parts[5].strip()
        role = parts[6].strip()
        created_at = parts[7].strip()
        lat = float(parts[8]) if parts[8].strip() else None
        lng = float(parts[9]) if parts[9].strip() else None
        address = parts[10].strip()
        status = int(parts[11]) if parts[11].strip() else 1

        print(f"Inserting {username} ({email}) ...")
        try:
            cur.execute("""
            INSERT INTO users (id, username, name, email, phone, password, role, created_at, latitude, longitude, address, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE 
                username=VALUES(username), name=VALUES(name), phone=VALUES(phone), 
                password=VALUES(password), role=VALUES(role), created_at=VALUES(created_at),
                latitude=VALUES(latitude), longitude=VALUES(longitude), 
                address=VALUES(address), status=VALUES(status)
            """, (uid, username, name, email, phone, pwd, role, created_at, lat, lng, address, status))
        except Exception as e:
            print(f"Error inserting {username}: {e}")

    conn.commit()
    print("Done inserting all users.")

if __name__ == "__main__":
    try:
        run()
    except Exception as e:
        traceback.print_exc()
        
