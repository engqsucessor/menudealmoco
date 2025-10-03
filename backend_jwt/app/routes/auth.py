from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.models import User
from app.models.restaurant import UserCreate, UserLogin, UserResponse
from app.auth.security import (
    create_access_token,
    create_refresh_token,
    verify_token,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    GOOGLE_OAUTH_CONFIG,
)
from app.auth.middleware import get_current_user
from slowapi import Limiter
from slowapi.util import get_remote_address
from pydantic import BaseModel, Field
from datetime import datetime
import bcrypt
from google.oauth2 import id_token
from google.auth.transport import requests
import os

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

ALLOWED_GOOGLE_CLIENT_IDS = GOOGLE_OAUTH_CONFIG.get('client_ids') or []

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserResponse

class RefreshTokenRequest(BaseModel):
    refresh_token: str = Field(..., description="Refresh token")

class UpdateDisplayNameRequest(BaseModel):
    displayName: str = Field(..., min_length=2, max_length=50, description="New display name")

class GoogleAuthRequest(BaseModel):
    credential: str = Field(..., description="Google ID token")

@router.post("/auth/login", response_model=TokenResponse)
@limiter.limit("5/minute")
async def login(request: Request, credentials: UserLogin, db: Session = Depends(get_db)):
    """JWT Login endpoint - returns access and refresh tokens"""
    user = db.query(User).filter(User.email == credentials.email).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Verify password
    if not bcrypt.checkpw(credentials.password.encode('utf-8'), user.password_hash.encode('utf-8')):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Create tokens
    token_data = {"sub": user.email, "user_id": user.id}
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)

    user_response = UserResponse(
        id=str(user.id),
        name=user.name,
        email=user.email,
        displayName=user.display_name,
        isReviewer=user.is_reviewer,
        isAdmin=user.is_admin,
        joinedAt=user.joined_at,
        reviews=[]
    )

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=user_response
    )

@router.post("/auth/signup", response_model=TokenResponse)
@limiter.limit("3/minute")
async def signup(request: Request, user_data: UserCreate, db: Session = Depends(get_db)):
    """Signup endpoint with JWT token response"""
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already exists"
        )

    # Hash password
    password_bytes = user_data.password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password_bytes, salt)

    # Generate display name
    user_count = db.query(User).count()
    display_name = f"User{user_count + 1}"

    # Create user
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        password_hash=hashed_password.decode('utf-8'),
        display_name=display_name,
        is_reviewer=False
    )

    db.add(new_user)
    try:
        db.commit()
        db.refresh(new_user)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error creating user"
        )

    # Create tokens
    token_data = {"sub": new_user.email, "user_id": new_user.id}
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)

    user_response = UserResponse(
        id=str(new_user.id),
        name=new_user.name,
        email=new_user.email,
        displayName=new_user.display_name,
        isReviewer=new_user.is_reviewer,
        isAdmin=new_user.is_admin,
        joinedAt=new_user.joined_at,
        reviews=[]
    )

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=user_response
    )

@router.post("/auth/refresh")
async def refresh_token(request_data: RefreshTokenRequest, db: Session = Depends(get_db)):
    """Refresh JWT access token"""
    try:
        # Verify refresh token
        token_data = verify_token(request_data.refresh_token, expected_type="refresh")

        # Get user - token_data has "email" key from verify_token in security.py
        user_email = token_data.get("email")
        user = db.query(User).filter(User.email == user_email).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )

        # Create new access token
        new_token_data = {"sub": user.email, "user_id": user.id}
        access_token = create_access_token(new_token_data)

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )

@router.get("/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    return UserResponse(
        id=str(current_user.id),
        name=current_user.name,
        email=current_user.email,
        displayName=current_user.display_name,
        isReviewer=current_user.is_reviewer,
        isAdmin=current_user.is_admin,
        joinedAt=current_user.joined_at,
        reviews=[]
    )

@router.post("/auth/google", response_model=TokenResponse)
@limiter.limit("10/minute")
async def google_auth(request: Request, auth_data: GoogleAuthRequest, db: Session = Depends(get_db)):
    """Google OAuth endpoint - verify Google token and create/login user"""
    try:
        if not ALLOWED_GOOGLE_CLIENT_IDS:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Google OAuth not configured"
            )

        # Verify the token with the correct audience (client ID)
        # Add clock_skew_in_seconds to handle minor time differences
        idinfo = id_token.verify_oauth2_token(
            auth_data.credential,
            requests.Request(),
            audience=ALLOWED_GOOGLE_CLIENT_IDS[0],
            clock_skew_in_seconds=10  # Allow 10 seconds clock skew
        )

        token_audience = idinfo.get('aud')
        if token_audience not in ALLOWED_GOOGLE_CLIENT_IDS:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid Google token audience"
            )

        # Extract user info from Google token
        google_id = idinfo['sub']
        email = idinfo.get('email')
        name = idinfo.get('name', email.split('@')[0])

        if not email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email not provided by Google"
            )

        # Check if user exists by Google ID or email
        user = db.query(User).filter(
            (User.google_id == google_id) | (User.email == email)
        ).first()

        if user:
            # Update google_id if user exists but doesn't have it set
            if not user.google_id:
                user.google_id = google_id
                db.commit()
                db.refresh(user)

            # Ensure admins are also reviewers
            if user.is_admin and not user.is_reviewer:
                user.is_reviewer = True
                db.commit()
                db.refresh(user)
        else:
            # Create new user
            user_count = db.query(User).count()
            display_name = f"User{user_count + 1}"

            # Check if this is the admin user
            is_admin = (email == "engq.andre@gmail.com")
            is_reviewer = is_admin  # Admins are automatically reviewers

            user = User(
                name=name,
                email=email,
                google_id=google_id,
                password_hash=None,  # No password for Google OAuth users
                display_name=display_name,
                is_reviewer=is_reviewer,
                is_admin=is_admin
            )

            db.add(user)
            try:
                db.commit()
                db.refresh(user)
            except Exception as e:
                db.rollback()
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Error creating user"
                )

        # Create tokens
        token_data = {"sub": user.email, "user_id": user.id}
        access_token = create_access_token(token_data)
        refresh_token = create_refresh_token(token_data)

        user_response = UserResponse(
            id=str(user.id),
            name=user.name,
            email=user.email,
            displayName=user.display_name,
            isReviewer=user.is_reviewer,
        isAdmin=user.is_admin,
            joinedAt=user.joined_at,
            reviews=[]
        )

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            user=user_response
        )

    except ValueError as e:
        # Invalid token
        import logging
        logging.error(f"Google token validation error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google token"
        )
    except Exception as e:
        import logging
        import traceback
        logging.error(f"Google auth error: {e}")
        logging.error(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Authentication error: {str(e)}"
        )

@router.put("/auth/update-display-name", response_model=UserResponse)
async def update_display_name(
    request_data: UpdateDisplayNameRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update user display name - requires authentication"""
    # Update display name
    current_user.display_name = request_data.displayName.strip()

    try:
        db.commit()
        db.refresh(current_user)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error updating display name"
        )

    return UserResponse(
        id=str(current_user.id),
        name=current_user.name,
        email=current_user.email,
        displayName=current_user.display_name,
        isReviewer=current_user.is_reviewer,
        isAdmin=current_user.is_admin,
        joinedAt=current_user.joined_at,
        reviews=[]
    )