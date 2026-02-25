import os, sys, traceback
sys.path.append(r'd:\online-food-ordering\backend')
import db

try:
    conn = db.get_db()
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT id, name, email FROM users")
    users = cur.fetchall()
    print("Users:", users)
    
    cur.execute("SELECT id, name FROM restaurants")
    rests = cur.fetchall()
    print("Restaurants:", rests)
except Exception as e:
    traceback.print_exc()

