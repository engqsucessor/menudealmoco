"""
Migration: Add reviewer application system and admin role
"""
import sqlite3

def migrate():
    conn = sqlite3.connect('menudealmoco.db')
    cursor = conn.cursor()

    try:
        # Add is_admin column to users table
        cursor.execute('''
            ALTER TABLE users ADD COLUMN is_admin INTEGER DEFAULT 0
        ''')
        print("[OK] Added is_admin column to users table")
    except sqlite3.OperationalError as e:
        if "duplicate column name" in str(e):
            print("[WARN] is_admin column already exists")
        else:
            raise

    try:
        # Create reviewer_applications table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS reviewer_applications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                motivation TEXT NOT NULL,
                experience TEXT,
                status TEXT DEFAULT 'pending',
                applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                reviewed_by_id INTEGER,
                reviewed_at TIMESTAMP,
                admin_notes TEXT,
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (reviewed_by_id) REFERENCES users(id)
            )
        ''')
        print("[OK] Created reviewer_applications table")
    except Exception as e:
        print(f"[ERROR] Failed to create reviewer_applications table: {e}")
        conn.rollback()
        raise

    try:
        # Make engq.andre@gmail.com an admin and reviewer
        cursor.execute('''
            UPDATE users
            SET is_admin = 1, is_reviewer = 1
            WHERE email = 'engq.andre@gmail.com'
        ''')

        if cursor.rowcount > 0:
            print("[OK] Set engq.andre@gmail.com as admin and reviewer")
        else:
            print("[WARN] User engq.andre@gmail.com not found (will be made admin on first login)")
    except Exception as e:
        print(f"[ERROR] Failed to set admin: {e}")

    conn.commit()
    conn.close()
    print("[SUCCESS] Migration completed successfully!")

if __name__ == "__main__":
    migrate()
