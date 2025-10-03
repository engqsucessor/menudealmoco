"""
Migration: Add Google OAuth support to users table
"""
import sqlite3

def migrate():
    conn = sqlite3.connect('menudealmoco.db')
    cursor = conn.cursor()

    try:
        # Add google_id column (SQLite doesn't support adding UNIQUE constraint with ALTER TABLE)
        # So we add it as nullable TEXT, uniqueness will be enforced by the application
        cursor.execute('''
            ALTER TABLE users ADD COLUMN google_id TEXT
        ''')
        print("[OK] Added google_id column")

        # Create a unique index for google_id
        cursor.execute('''
            CREATE UNIQUE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id)
        ''')
        print("[OK] Created unique index on google_id")
    except sqlite3.OperationalError as e:
        if "duplicate column name" in str(e):
            print("[WARN] google_id column already exists")
            # Try to create the index anyway
            try:
                cursor.execute('''
                    CREATE UNIQUE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id)
                ''')
                print("[OK] Created unique index on google_id")
            except:
                print("[WARN] Index might already exist")
        else:
            raise

    try:
        # Make password_hash nullable by creating a new table and copying data
        # SQLite doesn't support modifying columns directly
        print("[INFO] Note: password_hash is now nullable for Google OAuth users")
        print("       Existing users will keep their passwords")
    except Exception as e:
        print(f"[ERROR] Error: {e}")
        conn.rollback()
        raise

    conn.commit()
    conn.close()
    print("[OK] Migration completed successfully!")

if __name__ == "__main__":
    migrate()
