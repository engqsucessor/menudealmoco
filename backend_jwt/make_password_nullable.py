"""
Migration: Make password_hash nullable for Google OAuth users
"""
import sqlite3

def migrate():
    conn = sqlite3.connect('menudealmoco.db')
    cursor = conn.cursor()

    try:
        # Check current schema
        cursor.execute("PRAGMA table_info(users)")
        columns = cursor.fetchall()
        print("[INFO] Current users table schema:")
        for col in columns:
            print(f"  {col}")

        # Create new table with nullable password_hash
        cursor.execute('''
            CREATE TABLE users_new (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password_hash TEXT,  -- Made nullable for Google OAuth
                google_id TEXT UNIQUE,
                display_name TEXT,
                is_reviewer INTEGER DEFAULT 0,
                joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        print("[OK] Created new users table")

        # Copy data from old table
        cursor.execute('''
            INSERT INTO users_new (id, name, email, password_hash, google_id, display_name, is_reviewer, joined_at)
            SELECT id, name, email, password_hash,
                   CASE WHEN google_id IS NULL THEN NULL ELSE google_id END,
                   display_name, is_reviewer, joined_at
            FROM users
        ''')
        print("[OK] Copied data to new table")

        # Drop old table
        cursor.execute('DROP TABLE users')
        print("[OK] Dropped old users table")

        # Rename new table
        cursor.execute('ALTER TABLE users_new RENAME TO users')
        print("[OK] Renamed new table to users")

        conn.commit()
        print("[SUCCESS] Migration completed! password_hash is now nullable.")

    except Exception as e:
        print(f"[ERROR] Migration failed: {e}")
        conn.rollback()
        raise
    finally:
        conn.close()

if __name__ == "__main__":
    migrate()
