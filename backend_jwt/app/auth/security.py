from datetime import datetime, timedelta
from typing import Optional
import jwt
from jwt import InvalidTokenError, ExpiredSignatureError
from fastapi import HTTPException, status
import os
import logging
import boto3
from botocore.exceptions import ClientError

# JWT Configuration
logger = logging.getLogger(__name__)

def get_jwt_secret() -> str:
    """Fetch JWT secret from AWS Secrets Manager or environment variable"""
    # First try environment variable (for local development)
    secret_key = os.getenv("JWT_SECRET_KEY")
    if secret_key:
        logger.info("Using JWT secret from environment variable")
        return secret_key

    # Try AWS Secrets Manager
    secret_name = "menudealmoco/jwt-secret"
    region_name = os.getenv("AWS_REGION", "eu-west-1")

    try:
        session = boto3.session.Session()
        client = session.client(
            service_name='secretsmanager',
            region_name=region_name
        )

        get_secret_value_response = client.get_secret_value(SecretId=secret_name)
        secret = get_secret_value_response['SecretString']
        logger.info("Successfully loaded JWT secret from AWS Secrets Manager")
        return secret

    except ClientError as e:
        logger.error(f"Failed to retrieve secret from AWS Secrets Manager: {e}")
        # Fall back to default (will warn below)
        return "change-me-in-production"
    except Exception as e:
        logger.error(f"Unexpected error retrieving secret: {e}")
        return "change-me-in-production"

SECRET_KEY = get_jwt_secret()

if SECRET_KEY == "change-me-in-production":
    logger.warning("⚠️ CRITICAL SECURITY WARNING: Using default JWT secret key! Set JWT_SECRET_KEY environment variable or configure AWS Secrets Manager.")
else:
    logger.info("✓ JWT secret loaded successfully")

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