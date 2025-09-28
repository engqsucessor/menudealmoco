from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.models import User
from app.models.restaurant import UserCreate, UserLogin, UserResponse
import bcrypt

router = APIRouter()

@router.post("/auth/login")
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """Login endpoint"""
    user = db.query(User).filter(User.email == credentials.email).first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Verify password
    if not bcrypt.checkpw(credentials.password.encode('utf-8'), user.password_hash.encode('utf-8')):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {
        "id": str(user.id),
        "name": user.name,
        "email": user.email,
        "displayName": user.display_name,
        "isReviewer": user.is_reviewer,
        "joinedAt": user.joined_at.isoformat(),
        "reviews": []  # TODO: Get actual reviews
    }

@router.post("/auth/signup")
async def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    """Signup endpoint"""
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    # Hash password
    password_bytes = user_data.password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password_bytes, salt)

    # Generate display name
    display_name = f"User{len(db.query(User).all()) + 1}"

    # Create user
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        password_hash=hashed_password.decode('utf-8'),
        display_name=display_name,
        is_reviewer=False
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "id": str(new_user.id),
        "name": new_user.name,
        "email": new_user.email,
        "displayName": new_user.display_name,
        "isReviewer": new_user.is_reviewer,
        "joinedAt": new_user.joined_at.isoformat(),
        "reviews": []
    }

@router.put("/auth/update-display-name")
async def update_display_name(
    request_data: dict,
    db: Session = Depends(get_db),
    user_email: str = Header(alias="X-User-Email")
):
    """Update user display name"""
    # Find user by email
    user = db.query(User).filter(User.email == user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    new_display_name = request_data.get('displayName')
    if not new_display_name or not new_display_name.strip():
        raise HTTPException(status_code=400, detail="Display name is required")

    # Update display name
    user.display_name = new_display_name.strip()
    db.commit()
    db.refresh(user)

    return {
        "id": str(user.id),
        "name": user.name,
        "email": user.email,
        "displayName": user.display_name,
        "isReviewer": user.is_reviewer,
        "joinedAt": user.joined_at.isoformat(),
        "reviews": []
    }