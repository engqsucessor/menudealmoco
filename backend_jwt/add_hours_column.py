from app.database.database import engine
from sqlalchemy import text

with engine.begin() as conn:
    conn.execute(text('ALTER TABLE restaurants ADD COLUMN hours TEXT'))
    print('Hours column added to restaurants table')
