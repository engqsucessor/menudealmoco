from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import restaurants, auth, reviews, reports, edit_suggestions
from app.database.database import init_db

app = FastAPI(title="Menu de Almoço API", version="1.0.0")

# IMPORTANT: When allow_credentials=True you CANNOT use allow_origins=["*"]
# or the Access-Control-Allow-Origin header will be omitted (Starlette safeguard).
# That is why the wildcard change caused the browser to still complain about CORS.
# We generate an explicit allowlist for any localhost port in the 3000 range plus 127.0.0.1.

allowed_frontend_origins = []
for port_suffix in range(0, 10):  # 3000 .. 3009
    allowed_frontend_origins.append(f"http://localhost:300{port_suffix}")
    allowed_frontend_origins.append(f"http://127.0.0.1:300{port_suffix}")

# Add docker-compose style hostnames if needed
allowed_frontend_origins.extend([
    "http://frontend:3000",
    "http://frontend:3001",
])

print("Configuring CORS. Allowed origins:", allowed_frontend_origins)
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_frontend_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database
init_db()

# Include routers
app.include_router(restaurants.router, prefix="/api", tags=["restaurants"])
app.include_router(auth.router, prefix="/api", tags=["auth"])
app.include_router(reviews.router, prefix="/api", tags=["reviews"])
app.include_router(reports.router, prefix="/api", tags=["reports"])
app.include_router(edit_suggestions.router, prefix="/api", tags=["edit-suggestions"])

@app.get("/")
async def root():
    return {"message": "Menu de Almoço API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/api/debug/cors")
async def debug_cors():
    """Return the list of allowed origins (debug only)."""
    return {"allowed_origins": allowed_frontend_origins}