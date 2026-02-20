
import mysql.connector

def fix_password_column():
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="638638",
            database="food_ordering"
        )
        cursor = conn.cursor()

        try:
            # Increase password column size just in case, and verify schemas
            cursor.execute("ALTER TABLE users MODIFY password VARCHAR(512)")
            conn.commit()
            print("Successfully increased password column size to 512.")
        except Exception as e:
            print(f"Error altering table: {e}")

        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Connection failed: {e}")

if __name__ == "__main__":
    fix_password_column()
