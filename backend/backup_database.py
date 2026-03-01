import mysql.connector
from dotenv import load_dotenv
import os
import datetime


load_dotenv()

def dump_database():
    try:
        print(f"Connecting to database {os.getenv('MYSQLDATABASE')} at {os.getenv('MYSQLHOST')}...")
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
        
        filename = r"d:\online-food-ordering\database.sql"
        
        print(f"Found {len(tables)} tables. Starting backup to {filename}...")
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(f"-- FoodExpress Full Database Backup\n")
            f.write(f"-- Generated: {datetime.datetime.now()}\n")
            f.write(f"-- Host: {os.getenv('MYSQLHOST')}\n\n")
            
            # Disable foreign keys temporarily so we can drop/recreate tables and insert data safely
            f.write("SET FOREIGN_KEY_CHECKS=0;\n\n")
            
            for table in tables:
                print(f"  - Backing up table: {table}")
                f.write(f"-- --------------------------------------------------------\n")
                f.write(f"-- Table structure for table `{table}`\n")
                f.write(f"-- --------------------------------------------------------\n\n")
                
                f.write(f"DROP TABLE IF EXISTS `{table}`;\n")
                
                # Write table creation schema
                cursor.execute(f"SHOW CREATE TABLE `{table}`")
                create_stmt = cursor.fetchone()['Create Table']
                f.write(f"{create_stmt};\n\n")
                
                # Fetch all data
                cursor.execute(f"SELECT * FROM `{table}`")
                rows = cursor.fetchall()
                
                if rows:
                    f.write(f"-- Dumping data for table `{table}`\n")
                    
                    columns = list(rows[0].keys())
                    cols_str = ", ".join([f"`{c}`" for c in columns])
                    
                    # Split inserts into chunks of 100 for better performance
                    chunk_size = 100
                    for i in range(0, len(rows), chunk_size):
                        chunk = rows[i:i + chunk_size]
                        
                        insert_stmt = f"INSERT INTO `{table}` ({cols_str}) VALUES \n"
                        
                        values_list = []
                        for row in chunk:
                            row_vals = []
                            for col in columns:
                                val = row[col]
                                if val is None:
                                    row_vals.append("NULL")
                                elif isinstance(val, (int, float)):
                                    row_vals.append(str(val))
                                elif isinstance(val, datetime.datetime):
                                    row_vals.append(f"'{val.strftime('%Y-%m-%d %H:%M:%S')}'")
                                elif isinstance(val, datetime.date):
                                    row_vals.append(f"'{val.strftime('%Y-%m-%d')}'")
                                else:
                                    # Escape strings and newlines to prevent SQL injection/syntax errors
                                    val_str = str(val).replace("\\", "\\\\").replace("'", "''").replace("\n", "\\n").replace("\r", "\\r")
                                    row_vals.append(f"'{val_str}'")
                            values_list.append(f"({', '.join(row_vals)})")
                            
                        insert_stmt += ",\n".join(values_list) + ";\n"
                        f.write(insert_stmt)
                    f.write("\n")
                    
            f.write("SET FOREIGN_KEY_CHECKS=1;\n")
            
        print(f"\n✅ Database successfully backed up to backend/{filename}")
        print("You can keep this file as your full database backup, or use it to restore the new database.")
        
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"❌ Error backing up database: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    dump_database()
