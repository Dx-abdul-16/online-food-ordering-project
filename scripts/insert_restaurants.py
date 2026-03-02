import os, sys, traceback
sys.path.append(r'd:\online-food-ordering\backend')
import db

def run():
    conn = db.get_db()
    cur = conn.cursor()

    # Add missing columns if they don't exist
    for col_sql in [
        "ALTER TABLE restaurants ADD COLUMN offer VARCHAR(100)",
        "ALTER TABLE restaurants ADD COLUMN owner_id INT",
    ]:
        try:
            cur.execute(col_sql)
        except:
            pass

    # Ensure latitude/longitude columns exist (they should from setup_db_tracking)
    try: cur.execute("ALTER TABLE restaurants ADD COLUMN latitude DOUBLE DEFAULT 11.0168")
    except: pass
    try: cur.execute("ALTER TABLE restaurants ADD COLUMN longitude DOUBLE DEFAULT 76.9558")
    except: pass

    restaurants = [
        (1, "Taj Mahal Kitchen", "North Indian, Mughlai",
         "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop",
         4.5, "25-30 min", "Andheri West", 500, False, "20% OFF", 13.0827, 80.2707, None),

        (2, "Green Leaf Restaurant", "South Indian, Pure Veg",
         "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400&h=300&fit=crop",
         4.3, "20-25 min", "Bandra", 350, True, "Free Delivery", 11.0168, 76.9558, None),

        (3, "Spicy Chettinad Kitchen", "South Indian, Chettinad",
         "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&auto=format&fit=crop&q=60",
         4.5, "30-40 min", "Anna Nagar, Chennai", 500, False, "20% OFF", 13.0827, 80.2707, 2),

        (4, "Street Arabiya", "Arabic, Shawarma, Mandi",
         "https://images.unsplash.com/photo-1561626423-a51b45aef0a1?w=800&auto=format&fit=crop&q=60",
         4.8, "25-35 min", "Podanur, Coimbatore", 400, False, "50% OFF up to ₹100", 11.0036, 76.9639, 6),

        (5, "Al-Bait Mandi House", "Arabic, Mandi, Kebabs",
         "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&auto=format&fit=crop&q=60",
         4.7, "30-40 min", "Sai Baba Colony, Coimbatore", 600, False, "Free Delivery", 11.0339, 76.9559, 7),

        (6, "Coimbatore Biriyani Palace", "Biryani, South Indian, Tandoor",
         "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=60",
         4.5, "20-30 min", "RS Puram, Coimbatore", 350, False, "20% OFF", 11.0075, 76.953, 8),
    ]

    for r in restaurants:
        rid, name, cuisine, image, rating, dt, loc, p2, veg, offer, lat, lng, oid = r
        print(f"Inserting/Updating restaurant {rid}: {name} ...")
        try:
            cur.execute("""
                INSERT INTO restaurants (id, name, cuisine, image, rating, delivery_time, location, price_for_two, is_veg, offer, latitude, longitude, owner_id)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON DUPLICATE KEY UPDATE
                    name=VALUES(name), cuisine=VALUES(cuisine), image=VALUES(image),
                    rating=VALUES(rating), delivery_time=VALUES(delivery_time),
                    location=VALUES(location), price_for_two=VALUES(price_for_two),
                    is_veg=VALUES(is_veg), offer=VALUES(offer),
                    latitude=VALUES(latitude), longitude=VALUES(longitude),
                    owner_id=VALUES(owner_id)
            """, (rid, name, cuisine, image, rating, dt, loc, p2, veg, offer, lat, lng, oid))
        except Exception as e:
            print(f"  Error: {e}")

    conn.commit()
    print("Done inserting all restaurants.")

if __name__ == "__main__":
    try:
        run()
    except Exception as e:
        traceback.print_exc()
