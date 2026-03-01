import os
import pymysql
import pymysql.cursors
from urllib.parse import urlparse

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
    db_url = os.getenv("MYSQL_URL") or os.getenv("DATABASE_URL")
    db_host_env = os.getenv("DB_HOST", "")
    
    # Check if DB_HOST was accidentally set to a full URL
    if db_host_env.startswith("mysql://") or db_host_env.startswith("mysql+pymysql://"):
        db_url = db_host_env
        
    if db_url and db_url.startswith("mysql"):
        parsed = urlparse(db_url)
        host = parsed.hostname
        user = parsed.username
        password = parsed.password
        database = parsed.path[1:] if parsed.path else ""
        port = parsed.port or 3306
    else:
        host = db_host_env
        user = os.getenv("DB_USER")
        password = os.getenv("DB_PASS")
        database = os.getenv("DB_NAME")
        port = int(os.getenv("DB_PORT", 12412))

    # Try connecting. Some managed databases require SSL, some don't.
    try:
        conn = pymysql.connect(
            host=host,
            user=user,
            password=password,
            database=database,
            port=port,
            ssl={"ssl": {}}
        )
    except Exception as e:
        # Fallback without SSL if it fails (e.g., local or Railway MySQL without SSL)
        conn = pymysql.connect(
            host=host,
            user=user,
            password=password,
            database=database,
            port=port
        )
    return PyMySQLWrapper(conn)
