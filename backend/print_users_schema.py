from db import get_db
db = get_db()
c = db.cursor()
c.execute('DESCRIBE users')
for row in c.fetchall():
    print(row)
