from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.models import User
from app.auth.security import verify_token
from typing import Optional

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Get current authenticated user from JWT token"""

    if not credentials:
        print("❌ No credentials provided")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials
    print(f"🔑 Token received: {token[:20]}...")

    token_data = verify_token(token)

    user = db.query(User).filter(User.email == token_data["email"]).first()
    if user is None:
        print(f"❌ User not found for email: {token_data['email']}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    print(f"✅ User authenticated: {user.email}")
    return user

async def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    """Get current active user (can add additional checks here)"""
    return current_user

async def get_current_reviewer(current_user: User = Depends(get_current_user)) -> User:
    """Get current user and verify they have reviewer permissions"""
    if not current_user.is_reviewer:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions. Reviewer role required."
        )
    return current_user

async def get_optional_current_user(
    db: Session = Depends(get_db),
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False))
) -> Optional[User]:
    """Get current user if token is provided, otherwise return None"""

    if credentials is None:
        return None

    try:
        token = credentials.credentials
        token_data = verify_token(token)

        user = db.query(User).filter(User.email == token_data["email"]).first()
        return user
    except HTTPException:
        return None