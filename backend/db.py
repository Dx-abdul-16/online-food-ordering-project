import os
import pymysql
import pymysql.cursors

class PyMySQLWrapper:
    def __init__(self, conn):
        self._conn = conn
        
    def cursor(self, dictionary=False, **kwargs):
        if dictionary:
            return self._conn.cursor(cursor=pymysql.cursors.DictCursor)
        return self._conn.cursor()
        
    def commit(self):
        return self._conn.commit()
        
    def close(self):
        return self._conn.close()

def get_db():
    conn = pymysql.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASS"),
        database=os.getenv("DB_NAME"),
        port=int(os.getenv("DB_PORT", 12412)),
        ssl={"ssl": {}}
    )
    return PyMySQLWrapper(conn)
