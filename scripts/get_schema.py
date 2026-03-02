import mysql.connector
from dotenv import load_dotenv
import os

load_dotenv()

def generate_schema():
    print(f"Connecting to database to dump schema only...")
    conn = mysql.connector.connect(
        host=os.getenv("MYSQLHOST"),
        user=os.getenv("MYSQLUSER"),
        password=os.getenv("MYSQLPASSWORD"),
        database=os.getenv("MYSQLDATABASE"),
        port=int(os.getenv("MYSQLPORT", 3306))
    )
    cursor = conn.cursor(dictionary=True)
    
    # Get all tables
    cursor.execute("SHOW TABLES")
    tables = [list(t.values())[0] for t in cursor.fetchall()]
    
    filename = "database.sql"
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(f"-- FoodExpress Database Schema ONLY\n")
        f.write(f"-- Generated: {datetime.datetime.now() if 'datetime' in globals() else ''}\n\n")
        
        f.write("SET FOREIGN_KEY_CHECKS=0;\n\n")
        
        for table in tables:
            f.write(f"-- --------------------------------------------------------\n")
            f.write(f"-- Table structure for table `{table}`\n")
            f.write(f"-- --------------------------------------------------------\n\n")
            
            f.write(f"DROP TABLE IF EXISTS `{table}`;\n")
            
            # Write table creation schema
            cursor.execute(f"SHOW CREATE TABLE `{table}`")
            create_stmt = cursor.fetchone()['Create Table']
            f.write(f"{create_stmt};\n\n")
                
        f.write("SET FOREIGN_KEY_CHECKS=1;\n")
        
    print(f"\n✅ Schema successfully written to frontend/{filename} or wherever you ran this")
    
    cursor.close()
    conn.close()

if __name__ == "__main__":
    generate_schema()
