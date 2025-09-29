from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from app.routes import restaurants, auth, reviews, reports, edit_suggestions
from app.database.database import init_db
import os

# Environment configuration
ENV = os.getenv("ENV", "development")  # development, staging, production
IS_PRODUCTION = ENV == "production"

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address)
app = FastAPI(
    title="Menu de Almoço API - JWT",
    version="1.0.0",
    docs_url=None if IS_PRODUCTION else "/docs",  # Disable docs in production
    redoc_url=None if IS_PRODUCTION else "/redoc",
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS configuration - MUST be FIRST middleware
default_allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    "http://frontend:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
]

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", ",".join(default_allowed_origins)).split(",")

# In production, ensure ALLOWED_ORIGINS is explicitly set
if IS_PRODUCTION and ALLOWED_ORIGINS == default_allowed_origins:
    print("WARNING: Using default ALLOWED_ORIGINS in production. Set ALLOWED_ORIGINS env variable!")

print(f"Environment: {ENV}")
print(f"Configuring CORS. Allowed origins: {ALLOWED_ORIGINS}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-Requested-With", "X-User-Email"],
    expose_headers=["X-Total-Count"],
    max_age=600,  # Cache preflight requests for 10 minutes
)

# Security middleware
default_allowed_hosts = ["localhost", "127.0.0.1", "frontend", "*.localhost"]
if not IS_PRODUCTION:
    default_allowed_hosts.append("0.0.0.0")

ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", ",".join(default_allowed_hosts)).split(",")
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=ALLOWED_HOSTS
)

# Add SlowAPI middleware AFTER CORS and TrustedHost
app.add_middleware(SlowAPIMiddleware)

# Debug middleware
@app.middleware("http")
async def debug_auth_headers(request, call_next):
    if request.url.path.endswith("/edit-suggestions") and request.method == "POST":
        auth_header = request.headers.get("authorization")
        print(f"🔍 POST {request.url.path}")
        print(f"🔍 Authorization header: {auth_header[:30] if auth_header else 'MISSING'}...")
    response = await call_next(request)
    return response

# Security headers middleware
@app.middleware("http")
async def add_security_headers(request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'; "
        "script-src 'self' 'unsafe-inline'; "
        "style-src 'self' 'unsafe-inline'; "
        "img-src 'self' data: https:; "
        "connect-src 'self'; "
        "font-src 'self'; "
        "object-src 'none'; "
        "media-src 'self'; "
        "form-action 'self';"
    )
    return response

# Initialize database
init_db()

# Include routers - ORDER MATTERS
app.include_router(auth.router, prefix="/api", tags=["auth"])
app.include_router(restaurants.router, prefix="/api", tags=["restaurants"])
app.include_router(reviews.router, prefix="/api", tags=["reviews"])
app.include_router(reports.router, prefix="/api", tags=["reports"])
app.include_router(edit_suggestions.router, prefix="/api", tags=["edit-suggestions"])

@app.get("/")
@limiter.limit("10/minute")
async def root(request):
    return {"message": "Menu de Almoço API with JWT is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0", "auth": "JWT"}