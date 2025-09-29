from datetime import datetime, timedelta
from typing import Optional
import jwt
from jwt import InvalidTokenError, ExpiredSignatureError
from fastapi import HTTPException, status
import os
import logging

# JWT Configuration
logger = logging.getLogger(__name__)

DEFAULT_SECRET_KEY = "change-me-in-production"
SECRET_KEY = os.getenv("JWT_SECRET_KEY", DEFAULT_SECRET_KEY)

if SECRET_KEY == DEFAULT_SECRET_KEY:
    logger.warning("Using default JWT secret key. Set JWT_SECRET_KEY environment variable for production usage.")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

def _build_claims(data: dict, *, token_type: str, expires_delta: timedelta) -> dict:
    """Attach standard JWT claims used across token types."""
    now = datetime.utcnow()
    expires_at = now + expires_delta
    claims = data.copy()
    claims.update({
        "exp": expires_at,
        "iat": now,
        "type": token_type,
    })
    return claims

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token."""
    expires = expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    claims = _build_claims(data, token_type="access", expires_delta=expires)
    return jwt.encode(claims, SECRET_KEY, algorithm=ALGORITHM)

def create_refresh_token(data: dict):
    """Create JWT refresh token."""
    claims = _build_claims(data, token_type="refresh", expires_delta=timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS))
    return jwt.encode(claims, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(token: str, expected_type: str = "access"):
    """Verify and decode JWT token."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token_type = payload.get("type")
    if token_type != expected_type:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token type. Expected {expected_type}",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_email: str = payload.get("sub")
    user_id: int = payload.get("user_id")

    if user_email is None or user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return {"email": user_email, "user_id": user_id}

def create_token_response(user_email: str, user_id: int):
    """Create token response with both access and refresh tokens"""
    access_token = create_access_token(
        data={"sub": user_email, "user_id": user_id}
    )
    refresh_token = create_refresh_token(
        data={"sub": user_email, "user_id": user_id}
    )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60
    }