import mysql.connector
import os


def get_db():
    return mysql.connector.connect(
        host=os.getenv("MYSQLHOST", "localhost"),
        user=os.getenv("MYSQLUSER", "root"),
        password=os.getenv("MYSQLPASSWORD", "638638"),
        database=os.getenv("MYSQLDATABASE", "food_ordering"),
        port=int(os.getenv("MYSQLPORT", 3306)),
        use_pure=True 
