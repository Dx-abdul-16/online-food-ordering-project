import os, sys
sys.path.append(r'd:\online-food-ordering\backend')
import db
import traceback

try:
    conn = db.get_db()
    cur = conn.cursor(dictionary=True)
    cur.execute("DESCRIBE orders")
    print(cur.fetchall())
except Exception as e:
    traceback.print_exc()
