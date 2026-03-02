import os, sys, traceback, json
sys.path.append(r'd:\online-food-ordering\backend')
import db

try:
    conn = db.get_db()
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT id, name, email FROM users")
    users = cur.fetchall()
    
    cur.execute("SELECT id, name FROM restaurants")
    rests = cur.fetchall()
    
    with open(r'd:\online-food-ordering\backend\db_dump.json', 'w') as f:
        json.dump({'users': users, 'rests': rests}, f)
except Exception as e:
    with open(r'd:\online-food-ordering\backend\db_dump.json', 'w') as f:
        f.write(traceback.format_exc())
