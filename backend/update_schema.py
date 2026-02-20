from db import get_db

try:
    db = get_db()
    cursor = db.cursor()
    
   
    cursor.execute("DESCRIBE users")
    columns = cursor.fetchall()
    column_names = [col[0] for col in columns]
    
    if "username" not in column_names:
        print("Adding username column...")
        cursor.execute("ALTER TABLE users ADD COLUMN username VARCHAR(100) NOT NULL AFTER id")
        # If 'name' exists, we might want to drop it or keep it. Let's keep it for now but make it optional if needed, 
        # or just ignore it. Use 'username' going forward.
        # Actually, let's copy 'name' to 'username' if there's data?
        # For a dev env, maybe just drop the table and recreate if empty?
        # But instructions say "connect SQL", implying preserving data or structure.
        # Let's just add the column.
        db.commit()
        print("Username column added.")
    else:
        print("Username column already exists.")

    cursor.close()
    db.close()
except Exception as e:
    print(f"Error: {e}")
