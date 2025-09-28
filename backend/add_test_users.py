#!/usr/bin/env python3

import bcrypt
from app.database.database import SessionLocal, init_db
from app.database.models import User
from datetime import datetime

def add_test_users():
    init_db()
    db = SessionLocal()

    # Test users to add
    test_users = [
        {
            "name": "Test User",
            "email": "test@example.com",
            "password": "test123",
            "display_name": "TestUser123",
            "is_reviewer": False
        },
        {
            "name": "Food Lover",
            "email": "foodie@example.com",
            "password": "foodie123",
            "display_name": "FoodieExplorer",
            "is_reviewer": False
        },
        {
            "name": "Restaurant Reviewer",
            "email": "reviewer@example.com",
            "password": "reviewer123",
            "display_name": "RestaurantCritic",
            "is_reviewer": True
        }
    ]

    for user_data in test_users:
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == user_data["email"]).first()
        if existing_user:
            print(f"User {user_data['email']} already exists, skipping...")
            continue

        # Hash password
        password_bytes = user_data["password"].encode('utf-8')
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password_bytes, salt)

        # Create user
        new_user = User(
            name=user_data["name"],
            email=user_data["email"],
            password_hash=hashed_password.decode('utf-8'),
            display_name=user_data["display_name"],
            is_reviewer=user_data["is_reviewer"],
            joined_at=datetime.now()
        )

        db.add(new_user)
        print(f"Added user: {user_data['email']} with password: {user_data['password']}")

    db.commit()
    db.close()
    print("Test users added successfully!")

if __name__ == "__main__":
    add_test_users()