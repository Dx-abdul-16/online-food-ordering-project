"""
seed_restaurants.py
────────────────────────────────────────────────────
Creates 3 restaurant user accounts + restaurants + menu items.
Run:  python seed_restaurants.py

Credentials Summary
───────────────────
1. Street Arabiya Coimbatore
   Login : arabiya@foodexpress.in  /  arabiya123
   Role  : hotel

2. Al-Bait Mandi House
   Login : albait@foodexpress.in  /  albait123
   Role  : hotel

3. Coimbatore Biriyani Palace
   Login : biriyani@foodexpress.in  /  biriyani123
   Role  : hotel
"""

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from db import get_db

# ── Helpers ──────────────────────────────────────────────────────────────────
def upsert_user(cursor, name, username, email, phone, password, role, address, lat, lng):
    cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
    row = cursor.fetchone()
    if row:
        print(f"  [skip] User already exists: {email}")
        return row[0]
    cursor.execute("""
        INSERT INTO users (name, username, email, phone, password, role, address, latitude, longitude, is_approved)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, 1)
    """, (name, username, email, phone, password, role, address, lat, lng))
    uid = cursor.lastrowid
    print(f"  [+] User created: {email}  (id={uid})")
    return uid


def upsert_restaurant(cursor, owner_id, name, cuisine, image, rating,
                       delivery_time, location, price_for_two, is_veg,
                       offer, lat, lng):
    cursor.execute("SELECT id FROM restaurants WHERE name = %s", (name,))
    row = cursor.fetchone()
    if row:
        print(f"  [skip] Restaurant already exists: {name}  (id={row[0]})")
        return row[0]
    cursor.execute("""
        INSERT INTO restaurants
          (owner_id, name, cuisine, image, rating, delivery_time, location,
           price_for_two, is_veg, offer, latitude, longitude)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
    """, (owner_id, name, cuisine, image, rating, delivery_time, location,
          price_for_two, is_veg, offer, lat, lng))
    rid = cursor.lastrowid
    print(f"  [+] Restaurant created: {name}  (id={rid})")
    return rid


def upsert_menu_item(cursor, restaurant_id, name, price, description, image, is_veg):
    cursor.execute(
        "SELECT id FROM menu_items WHERE restaurant_id = %s AND name = %s",
        (restaurant_id, name)
    )
    if cursor.fetchone():
        return  # already exists
    cursor.execute("""
        INSERT INTO menu_items (restaurant_id, name, price, description, image, is_veg)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (restaurant_id, name, price, description, image, is_veg))
    print(f"    [+] Menu item: {name}  ₹{price}")


# ── Data ──────────────────────────────────────────────────────────────────────

RESTAURANTS = [

    # ── 1. Street Arabiya ──────────────────────────────────────────────────
    {
        "user": {
            "name":     "Street Arabiya Owner",
            "username": "arabiya_owner",
            "email":    "arabiya@foodexpress.in",
            "phone":    "9629075139",
            "password": "arabiya123",
            "role":     "hotel",
            "address":  "Podanur Main Road, Coimbatore",
            "lat":      11.003621,
            "lng":      76.963882,
        },
        "restaurant": {
            "name":          "Street Arabiya",
            "cuisine":       "Arabic, Shawarma, Mandi",
            "image":         "https://images.unsplash.com/photo-1561626423-a51b45aef0a1?w=800&auto=format&fit=crop&q=60",
            "rating":        4.8,
            "delivery_time": "25-35 min",
            "location":      "Podanur, Coimbatore",
            "price_for_two": 400,
            "is_veg":        0,
            "offer":         "50% OFF up to ₹100",
            "lat":           11.003621,
            "lng":           76.963882,
        },
        "menu": [
            ("Chicken Shawarma",        149, "Juicy Arabic-style chicken in warm pita with garlic sauce",              "https://images.unsplash.com/photo-1561626423-a51b45aef0a1?w=800&auto=format&fit=crop&q=60", 0),
            ("Mutton Shawarma",         179, "Slow-cooked mutton with Arabic spices in pita bread",                  "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&auto=format&fit=crop&q=60", 0),
            ("Chicken Mandi",           349, "Fragrant rice with slow-roasted whole chicken, Yemeni style",           "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=60", 0),
            ("Mutton Mandi",            449, "Tender mutton on aromatic Basmati rice with saffron and spices",        "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&auto=format&fit=crop&q=60", 0),
            ("Afghani Alfaham",         399, "Whole grilled chicken marinated in Afghani spices, served with rice",   "https://images.unsplash.com/photo-1598515213692-b01a35a7f5d1?w=800&auto=format&fit=crop&q=60", 0),
            ("Chicken Kebab Platter",   299, "Assorted chicken kebabs with mint chutney and naan",                   "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800&auto=format&fit=crop&q=60", 0),
            ("Falafel Wrap",            129, "Crispy falafel in pita with tahini and fresh veggies",                  "https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?w=800&auto=format&fit=crop&q=60", 1),
            ("Hummus with Pita",         99, "Creamy Lebanese-style hummus served with warm pita bread",              "https://images.unsplash.com/photo-1598900438095-bef4a4c4d34a?w=800&auto=format&fit=crop&q=60", 1),
            ("Arabic Lemon Mint Juice",  79, "Freshly squeezed lemon with mint — a Street Arabiya signature",        "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&auto=format&fit=crop&q=60", 1),
        ],
    },

    # ── 2. Al-Bait Mandi House ─────────────────────────────────────────────
    {
        "user": {
            "name":     "Al-Bait Owner",
            "username": "albait_owner",
            "email":    "albait@foodexpress.in",
            "phone":    "9876543221",
            "password": "albait123",
            "role":     "hotel",
            "address":  "Sai Baba Colony, Coimbatore",
            "lat":      11.033921,
            "lng":      76.955882,
        },
        "restaurant": {
            "name":          "Al-Bait Mandi House",
            "cuisine":       "Arabic, Mandi, Kebabs",
            "image":         "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&auto=format&fit=crop&q=60",
            "rating":        4.7,
            "delivery_time": "30-40 min",
            "location":      "Sai Baba Colony, Coimbatore",
            "price_for_two": 600,
            "is_veg":        0,
            "offer":         "Free Delivery",
            "lat":           11.033921,
            "lng":           76.955882,
        },
        "menu": [
            ("Lamb Mandi (Full)",        899, "Full slow-roasted Yemeni lamb with Basmati rice and salad",            "https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&auto=format&fit=crop&q=60", 0),
            ("Lamb Mandi (Half)",        499, "Half portion of our signature Yemeni lamb Mandi",                     "https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&auto=format&fit=crop&q=60", 0),
            ("Chicken Mandi",            349, "Whole roasted chicken on fragrant Mandi rice",                        "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=60", 0),
            ("Mixed Grill Platter",      699, "Assorted kebabs — seekh, shish, chicken tikka with dips and bread",   "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=60", 0),
            ("Mutton Kabsa",             550, "Saudi-style Kabsa with mutton, rice, raisins and nuts",               "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&auto=format&fit=crop&q=60", 0),
            ("Prawn Machboos",           480, "Gulf-style spiced prawn rice with caramelised onion",                 "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=60", 0),
            ("Fattoush Salad",           149, "Fresh Lebanese bread salad with pomegranate dressing",                "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=60", 1),
            ("Baklava (6 pcs)",          199, "Crispy phyllo pastry with pistachio and honey",                       "https://images.unsplash.com/photo-1519915028121-7d3463d5b1d7?w=800&auto=format&fit=crop&q=60", 1),
            ("Karak Chai",                69, "Strong spiced tea with condensed milk, Gulf-style",                   "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&auto=format&fit=crop&q=60", 1),
        ],
    },

    # ── 3. Coimbatore Biriyani Palace ─────────────────────────────────────
    {
        "user": {
            "name":     "Biriyani Palace Owner",
            "username": "biriyani_owner",
            "email":    "biriyani@foodexpress.in",
            "phone":    "9345678901",
            "password": "biriyani123",
            "role":     "hotel",
            "address":  "RS Puram, Coimbatore",
            "lat":      11.007521,
            "lng":      76.953002,
        },
        "restaurant": {
            "name":          "Coimbatore Biriyani Palace",
            "cuisine":       "Biryani, South Indian, Tandoor",
            "image":         "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=60",
            "rating":        4.5,
            "delivery_time": "20-30 min",
            "location":      "RS Puram, Coimbatore",
            "price_for_two": 350,
            "is_veg":        0,
            "offer":         "20% OFF",
            "lat":           11.007521,
            "lng":           76.953002,
        },
        "menu": [
            ("Chicken Biryani",          220, "Seeraga samba rice with spicy chicken and caramelised onion",         "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=60", 0),
            ("Mutton Biryani",           299, "Slow-cooked mutton chunks layered with fragrant Basmati rice",        "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&auto=format&fit=crop&q=60", 0),
            ("Egg Biryani",              170, "Masala-crusted boiled eggs with seeraga samba rice",                  "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&auto=format&fit=crop&q=60", 0),
            ("Veg Biryani",              160, "Mixed vegetable biryani with fried onion and mint",                   "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=60", 1),
            ("Chicken 65",               199, "Dhaba-style deep-fried chicken with chilli and curry leaves",         "https://images.unsplash.com/photo-1598515213692-b01a35a7f5d1?w=800&auto=format&fit=crop&q=60", 0),
            ("Mutton Chukka",            259, "Dry-fried mutton with Chettinad spices and coconut",                  "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=60", 0),
            ("Paneer Butter Masala",     200, "Silky paneer in rich tomato-cream gravy with butter naan",            "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=60", 1),
            ("Tandoori Chicken (Half)",  249, "Half chicken marinated in yoghurt and tandoori spices, clay-oven baked","https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800&auto=format&fit=crop&q=60", 0),
            ("Parotta + Salna",           65, "Flaky layered parotta with spicy Chettinad salna",                   "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=800&auto=format&fit=crop&q=60", 1),
            ("Lassi (Sweet/Salt)",        60, "Chilled thick lassi — sweet or salted",                              "https://images.unsplash.com/photo-1560023907-5f339fb37b60?w=800&auto=format&fit=crop&q=60", 1),
        ],
    },
]

# ── Runner ────────────────────────────────────────────────────────────────────
def seed():
    conn = get_db()
    cursor = conn.cursor()

    try:
        for r in RESTAURANTS:
            print(f"\n{'─'*55}")
            print(f"  Setting up: {r['restaurant']['name']}")
            print(f"{'─'*55}")

            # 1. Create owner user
            uid = upsert_user(cursor, **r["user"])

            # 2. Create restaurant linked to user
            rd = r["restaurant"]
            rid = upsert_restaurant(
                cursor, uid,
                rd["name"], rd["cuisine"], rd["image"], rd["rating"],
                rd["delivery_time"], rd["location"], rd["price_for_two"],
                rd["is_veg"], rd["offer"], rd["lat"], rd["lng"]
            )

            # 3. Add menu items
            print(f"  Adding menu items...")
            for item in r["menu"]:
                upsert_menu_item(cursor, rid, *item)

        conn.commit()
        print(f"\n{'═'*55}")
        print("  ✅  All restaurants seeded successfully!")
        print(f"{'═'*55}")
        print("\n📋  Restaurant Login Credentials:")
        print("  1. Street Arabiya        → arabiya@foodexpress.in   / arabiya123")
        print("  2. Al-Bait Mandi House   → albait@foodexpress.in    / albait123")
        print("  3. Biriyani Palace       → biriyani@foodexpress.in  / biriyani123")
        print()

    except Exception as e:
        conn.rollback()
        print(f"\n❌  Error: {e}")
        import traceback; traceback.print_exc()
    finally:
        cursor.close()
        conn.close()


if __name__ == "__main__":
    seed()
