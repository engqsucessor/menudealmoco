"""
Migration script to add photo columns to restaurants table
"""
import sqlite3
import os

def migrate_database():
    db_path = "menudealmoco.db"
    
    if not os.path.exists(db_path):
        print("Database file not found!")
        return
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Check if columns already exist
        cursor.execute("PRAGMA table_info(restaurants)")
        columns = [column[1] for column in cursor.fetchall()]
        
        print("Current columns:", columns)
        
        # Add restaurant_photo column if it doesn't exist
        if 'restaurant_photo' not in columns:
            print("Adding restaurant_photo column...")
            cursor.execute("ALTER TABLE restaurants ADD COLUMN restaurant_photo TEXT")
            print("✓ restaurant_photo column added")
        else:
            print("restaurant_photo column already exists")
            
        # Add menu_photo column if it doesn't exist  
        if 'menu_photo' not in columns:
            print("Adding menu_photo column...")
            cursor.execute("ALTER TABLE restaurants ADD COLUMN menu_photo TEXT")
            print("✓ menu_photo column added")
        else:
            print("menu_photo column already exists")
            
        conn.commit()
        print("Migration completed successfully!")
        
    except Exception as e:
        print(f"Error during migration: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    migrate_database()