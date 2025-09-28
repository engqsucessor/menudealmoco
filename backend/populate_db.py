import json
import sys
import os
from datetime import datetime
import bcrypt

# Add the app directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database.database import SessionLocal, init_db
from app.database.models import Restaurant, User
from sqlalchemy.orm import Session

def extract_city_district(address):
    """Extract city and district from address"""
    # Simple extraction - could be improved with more sophisticated parsing
    parts = [part.strip() for part in address.split(',')]
    if len(parts) >= 2:
        # Assume last part contains city/country info
        last_part = parts[-1]
        if 'Lisboa' in last_part or 'Lisbon' in last_part:
            return 'Lisboa', 'Lisboa'
        elif 'Porto' in last_part:
            return 'Porto', 'Porto'
        elif 'Braga' in last_part:
            return 'Braga', 'Braga'

    # Default fallback
    return 'Lisboa', 'Lisboa'

def normalize_practical_fields(practical):
    """Convert field names to match mock backend format"""
    return {
        "cardsAccepted": practical.get("takesCards", True),
        "quickService": practical.get("quickService", False),
        "groupFriendly": practical.get("groupFriendly", True),
        "parking": practical.get("hasParking", False)
    }

def populate_restaurants():
    # Initialize database
    init_db()

    # Read restaurant data
    with open('../file.txt', 'r', encoding='utf-8') as f:
        content = f.read()

    # The file seems to contain multiple JSON arrays, let's try to parse them
    # Split by ']' and '[' to get individual arrays
    json_parts = []
    current_json = ""
    brace_count = 0

    for char in content:
        current_json += char
        if char == '[':
            brace_count += 1
        elif char == ']':
            brace_count -= 1
            if brace_count == 0 and current_json.strip():
                try:
                    json_data = json.loads(current_json.strip())
                    json_parts.extend(json_data)
                    current_json = ""
                except json.JSONDecodeError:
                    pass

    print(f"Found {len(json_parts)} restaurants to import")

    # Create database session
    db = SessionLocal()

    try:
        # Create a default admin user if it doesn't exist
        admin_user = db.query(User).filter(User.email == "admin@menudealmoco.com").first()
        if not admin_user:
            # Hash the password
            password_bytes = "admin123".encode('utf-8')
            salt = bcrypt.gensalt()
            hashed_password = bcrypt.hashpw(password_bytes, salt)

            admin_user = User(
                name="Admin User",
                email="admin@menudealmoco.com",
                password_hash=hashed_password.decode('utf-8'),
                display_name="SuperReviewer007",
                is_reviewer=True
            )
            db.add(admin_user)
            db.commit()
            db.refresh(admin_user)

        # Import restaurants
        for restaurant_data in json_parts:
            # Extract city and district
            city, district = extract_city_district(restaurant_data["address"])

            # Normalize practical fields
            practical = normalize_practical_fields(restaurant_data["practical"])

            # Create restaurant object
            restaurant = Restaurant(
                name=restaurant_data["name"],
                address=restaurant_data["address"],
                city=city,
                district=district,
                menu_price=restaurant_data["menuPrice"],
                price_range=restaurant_data["priceRange"],
                food_type=restaurant_data["foodType"],
                whats_included=json.dumps(restaurant_data["whatsIncluded"]),
                cards_accepted=practical["cardsAccepted"],
                quick_service=practical["quickService"],
                group_friendly=practical["groupFriendly"],
                parking=practical["parking"],
                google_rating=restaurant_data.get("googleRating"),
                google_reviews=restaurant_data.get("googleReviews"),
                description=restaurant_data.get("description"),
                dishes=json.dumps(restaurant_data["dishes"]),
                photos=json.dumps([]),  # No photos in sample data
                status="approved",
                submitted_by_id=admin_user.id,
                approved_by_id=admin_user.id,
                approved_at=datetime.now()
            )

            db.add(restaurant)
            print(f"Added restaurant: {restaurant.name}")

        db.commit()
        print("Successfully populated database!")

    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    populate_restaurants()