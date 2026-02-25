import sys
import json
import traceback

sys.path.append(r'd:\online-food-ordering\backend')
try:
    import db
    conn = db.get_db()
    cur = conn.cursor(dictionary=True)
    cur.execute('DESCRIBE orders')
    columns = cur.fetchall()
    with open('out.json', 'w') as f:
        json.dump(columns, f)
except Exception as e:
    with open('out.json', 'w') as f:
        f.write(traceback.format_exc())
