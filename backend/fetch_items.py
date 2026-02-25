import os, sys, json
sys.path.append(r'd:\online-food-ordering\backend')
import db

conn = db.get_db()
cur = conn.cursor(dictionary=True)
cur.execute("SELECT id, name, restaurant_id FROM menu_items")
res = cur.fetchall()

cur.execute("SELECT id, name FROM users")
res2 = cur.fetchall()

with open(r'd:\online-food-ordering\backend\items.json', 'w') as f:
    json.dump({"items": res, "users": res2}, f)
