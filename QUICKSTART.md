Backend & Frontend Quick Start
================================

Prereqs: Python 3.10+, uv (pip install uv), Node 18+, npm

Backend:
--------
cd backend
uv sync  (installs deps from pyproject.toml / uv.lock)
uv run python serve.py   (deterministic launch, no auto-reload)

Test:
curl http://localhost:8000/health
curl http://localhost:8000/api/debug/cors

Frontend:
---------
cd frontend_1
npm install
npm run dev

If Vite chooses a port NOT in 3000-3009 range (e.g. 5173) then add it to allowed origins in backend/app/main.py (or export VITE_PORT=3003 and force it with: vite --port 3003).

Explicit API URL is set in .env (VITE_API_URL=http://localhost:8000/api). Change if backend URL differs.

Common Problems:
----------------
1. CORS error & missing Access-Control-Allow-Origin header:
   - Ensure backend restarted after editing CORS list.
   - No wildcard with allow_credentials=True.

2. Fetch still failing:
   - Open devtools Network tab; confirm request actually hits 8000 not 5173 or https.
   - Check console for mixed content or HTTPS mismatch.

3. Backend exiting immediately:
   - Run uv run python -c "import app.main" to surface import errors.

Add new allowed origin snippet (example for port 5173):
allowed_frontend_origins.append("http://localhost:5173")
allowed_frontend_origins.append("http://127.0.0.1:5173")
