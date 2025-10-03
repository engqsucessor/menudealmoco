"""
Add database indexes for better query performance
"""
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).parent.parent.parent))

from sqlalchemy import text
from app.database.database import engine


def add_indexes():
    """Add indexes to commonly queried fields"""

    indexes = [
        # Restaurants table indexes
        "CREATE INDEX IF NOT EXISTS idx_restaurants_status ON restaurants(status);",
        "CREATE INDEX IF NOT EXISTS idx_restaurants_city ON restaurants(city);",
        "CREATE INDEX IF NOT EXISTS idx_restaurants_district ON restaurants(district);",
        "CREATE INDEX IF NOT EXISTS idx_restaurants_food_type ON restaurants(food_type);",
        "CREATE INDEX IF NOT EXISTS idx_restaurants_menu_price ON restaurants(menu_price);",
        "CREATE INDEX IF NOT EXISTS idx_restaurants_google_rating ON restaurants(google_rating);",

        # Menu reviews indexes
        "CREATE INDEX IF NOT EXISTS idx_menu_reviews_restaurant_id ON menu_reviews(restaurant_id);",
        "CREATE INDEX IF NOT EXISTS idx_menu_reviews_user_id ON menu_reviews(user_id);",
        "CREATE INDEX IF NOT EXISTS idx_menu_reviews_rating ON menu_reviews(rating);",

        # Restaurant submissions indexes
        "CREATE INDEX IF NOT EXISTS idx_submissions_status ON restaurant_submissions(status);",
        "CREATE INDEX IF NOT EXISTS idx_submissions_submitted_by ON restaurant_submissions(submitted_by_id);",

        # Edit suggestions indexes
        "CREATE INDEX IF NOT EXISTS idx_edit_suggestions_status ON edit_suggestions(status);",
        "CREATE INDEX IF NOT EXISTS idx_edit_suggestions_restaurant_id ON edit_suggestions(restaurant_id);",

        # User favorites indexes (already has composite primary key, but add individual)
        "CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON user_favorites(user_id);",
        "CREATE INDEX IF NOT EXISTS idx_favorites_restaurant_id ON user_favorites(restaurant_id);",
    ]

    with engine.connect() as conn:
        for sql in indexes:
            print(f"Creating index: {sql}")
            conn.execute(text(sql))
            conn.commit()

    print("\n✓ All indexes created successfully!")


if __name__ == "__main__":
    add_indexes()
