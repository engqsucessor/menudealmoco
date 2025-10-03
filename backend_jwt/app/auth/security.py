import json
import logging
import os
from datetime import datetime, timedelta
from typing import List, Optional

import boto3
import jwt
from botocore.exceptions import ClientError
from fastapi import HTTPException, status
from jwt import ExpiredSignatureError, InvalidTokenError

# JWT Configuration
logger = logging.getLogger(__name__)


def _parse_client_ids(raw: Optional[object]) -> List[str]:
    """Return a list of trimmed client ids from various formats."""
    client_ids: List[str] = []
    if raw is None:
        return client_ids

    if isinstance(raw, (list, tuple, set)):
        iterable = raw
    else:
        iterable = str(raw).split(',')

    for value in iterable:
        trimmed = str(value).strip()
        if trimmed:
            client_ids.append(trimmed)

    return client_ids


def get_jwt_secret() -> str:
    """Fetch JWT secret from AWS Secrets Manager or environment variable."""
    secret_key = os.getenv('JWT_SECRET_KEY')
    if secret_key:
        logger.info('Using JWT secret from environment variable')
        return secret_key

    secret_name = 'menudealmoco/jwt-secret'
    region_name = os.getenv('AWS_REGION', 'eu-west-1')

    try:
        session = boto3.session.Session()
        client = session.client(
            service_name='secretsmanager',
            region_name=region_name,
        )

        response = client.get_secret_value(SecretId=secret_name)
        secret = response['SecretString']
        logger.info('Successfully loaded JWT secret from AWS Secrets Manager')
        return secret

    except ClientError as exc:
        logger.error('Failed to retrieve secret from AWS Secrets Manager: %s', exc)
        return 'change-me-in-production'
    except Exception as exc:  # noqa: BLE001
        logger.error('Unexpected error retrieving secret: %s', exc)
        return 'change-me-in-production'


SECRET_KEY = get_jwt_secret()

if SECRET_KEY == 'change-me-in-production':
    logger.warning('CRITICAL SECURITY WARNING: Using default JWT secret key. Set JWT_SECRET_KEY or configure AWS Secrets Manager.')
else:
    logger.info('JWT secret loaded successfully')


def get_google_oauth_config() -> dict:
    """Fetch Google OAuth config from AWS Secrets Manager or environment variables."""
    client_ids = _parse_client_ids(os.getenv('GOOGLE_CLIENT_IDS'))
    env_single_id = os.getenv('GOOGLE_CLIENT_ID')
    if not client_ids and env_single_id:
        client_ids = _parse_client_ids(env_single_id)

    client_secret = os.getenv('GOOGLE_CLIENT_SECRET')

    if client_ids:
        if client_secret:
            logger.info('Using Google OAuth config from environment variables')
        else:
            logger.warning('Found Google client ids in environment variables but GOOGLE_CLIENT_SECRET is missing')

        return {
            'client_id': client_ids[0],
            'client_ids': client_ids,
            'client_secret': client_secret,
        }

    secret_name = 'menudealmoco/google-oauth'
    region_name = os.getenv('AWS_REGION', 'eu-west-1')

    try:
        session = boto3.session.Session()
        client = session.client(
            service_name='secretsmanager',
            region_name=region_name,
        )

        response = client.get_secret_value(SecretId=secret_name)
        secret_data = json.loads(response['SecretString'])
        logger.info('Successfully loaded Google OAuth config from AWS Secrets Manager')

        secret_client_ids = _parse_client_ids(
            secret_data.get('client_ids') or secret_data.get('client_id')
        )

        return {
            'client_id': secret_client_ids[0] if secret_client_ids else None,
            'client_ids': secret_client_ids,
            'client_secret': secret_data.get('client_secret'),
        }

    except ClientError as exc:
        logger.error('Failed to retrieve Google OAuth config from AWS Secrets Manager: %s', exc)
        return {'client_id': None, 'client_ids': [], 'client_secret': None}
    except Exception as exc:  # noqa: BLE001
        logger.error('Unexpected error retrieving Google OAuth config: %s', exc)
        return {'client_id': None, 'client_ids': [], 'client_secret': None}


GOOGLE_OAUTH_CONFIG = get_google_oauth_config()

if GOOGLE_OAUTH_CONFIG.get('client_ids'):
    logger.info('Google OAuth config loaded for %d client id(s)', len(GOOGLE_OAUTH_CONFIG['client_ids']))
else:
    logger.warning('Google OAuth not configured. Set GOOGLE_CLIENT_ID or GOOGLE_CLIENT_IDS and GOOGLE_CLIENT_SECRET, or configure AWS Secrets Manager.')


ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7


def _build_claims(data: dict, *, token_type: str, expires_delta: timedelta) -> dict:
    """Attach standard JWT claims used across token types."""
    now = datetime.utcnow()
    expires_at = now + expires_delta
    claims = data.copy()
    claims.update(
        {
            'exp': expires_at,
            'iat': now,
            'type': token_type,
        }
    )
    return claims


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token."""
    expires = expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    claims = _build_claims(data, token_type='access', expires_delta=expires)
    return jwt.encode(claims, SECRET_KEY, algorithm=ALGORITHM)


def create_refresh_token(data: dict):
    """Create JWT refresh token."""
    claims = _build_claims(
        data,
        token_type='refresh',
        expires_delta=timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS),
    )
    return jwt.encode(claims, SECRET_KEY, algorithm=ALGORITHM)


def verify_token(token: str, expected_type: str = 'access'):
    """Verify and decode JWT token."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except ExpiredSignatureError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Token has expired',
            headers={'WWW-Authenticate': 'Bearer'},
        ) from exc
    except InvalidTokenError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Could not validate credentials',
            headers={'WWW-Authenticate': 'Bearer'},
        ) from exc

    token_type = payload.get('type')
    if token_type != expected_type:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f'Invalid token type. Expected {expected_type}',
            headers={'WWW-Authenticate': 'Bearer'},
        )

    user_email: Optional[str] = payload.get('sub')
    user_id: Optional[int] = payload.get('user_id')

    if user_email is None or user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Could not validate credentials',
            headers={'WWW-Authenticate': 'Bearer'},
        )

    return {'email': user_email, 'user_id': user_id}


def create_token_response(user_email: str, user_id: int):
    """Create token response with both access and refresh tokens."""
    access_token = create_access_token(
        data={'sub': user_email, 'user_id': user_id}
    )
    refresh_token = create_refresh_token(
        data={'sub': user_email, 'user_id': user_id}
    )

    return {
        'access_token': access_token,
        'refresh_token': refresh_token,
        'token_type': 'bearer',
        'expires_in': ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    }
