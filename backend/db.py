import mysql.connector
import os

def get_db():
    return mysql.connector.connect(
        host=os.getenv("MYSQLHOST", "caboose.proxy.rlwy.net"),
        user=os.getenv("MYSQLUSER", "root"),
        password=os.getenv("MYSQLPASSWORD", "CAUtybWeBlZZbEyjgbNhllfQqyUfjASN"),
        database=os.getenv("MYSQLDATABASE", "railway"),
        port=int(os.getenv("MYSQLPORT", "47013")),
        use_pure=True 
    )
