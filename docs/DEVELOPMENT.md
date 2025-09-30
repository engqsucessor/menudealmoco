# MenuDealMoco - Development Guide

Complete guide for setting up and developing MenuDealMoco locally.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Running Locally](#running-locally)
4. [Project Structure](#project-structure)
5. [Development Workflow](#development-workflow)
6. [Testing](#testing)
7. [Common Tasks](#common-tasks)

---

## Prerequisites

### Required Software

- **Node.js** 18+ and npm
- **Python** 3.10+
- **Git**
- **Docker** and Docker Compose (optional, for containerized development)
- **Code Editor** (VS Code recommended)

### Recommended VS Code Extensions

- ESLint
- Prettier
- Python
- Docker
- GitLens

---

## Initial Setup

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd menudealmoco
```

### 2. Backend Setup

```bash
cd backend_jwt

# Install uv (Python package manager)
curl -LsSf https://astral.sh/uv/install.sh | sh

# Create virtual environment and install dependencies
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
uv sync

# Set environment variables
cp .env.example .env
# Edit .env and set:
# JWT_SECRET_KEY=your-local-secret-key-here
# DATABASE_URL=sqlite:///./menudealmoco.db

# Initialize database (if needed)
# Database will be created automatically on first run
```

### 3. Frontend Setup

```bash
cd frontend_1

# Install dependencies
npm install

# Set environment variables
cp .env.example .env
# Edit .env and set:
# VITE_API_URL=/api
```

---

## Running Locally

### Option 1: Run Services Separately (Recommended for Development)

**Terminal 1 - Backend:**
```bash
cd backend_jwt
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8088
```

**Terminal 2 - Frontend:**
```bash
cd frontend_1
npm run dev
```

Access the application:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8088/api
- **API Docs:** http://localhost:8088/docs

### Option 2: Docker Compose (Closer to Production)

```bash
# Build images
docker-compose -f deployment/docker-compose.yml build

# Start services
docker-compose -f deployment/docker-compose.yml up

# Stop services
docker-compose -f deployment/docker-compose.yml down
```

---

## Project Structure

```
menudealmoco/
├── backend_jwt/              # Python FastAPI backend
│   ├── app/
│   │   ├── auth/            # Authentication (JWT, middleware)
│   │   │   ├── middleware.py    # Auth middleware
│   │   │   └── security.py      # JWT token handling
│   │   ├── database/        # Database models and connection
│   │   │   ├── database.py      # SQLAlchemy setup
│   │   │   └── models.py        # Database models
│   │   ├── models/          # Pydantic models (API schemas)
│   │   │   └── restaurant.py    # Restaurant response models
│   │   ├── routes/          # API endpoints
│   │   │   ├── auth.py          # Authentication endpoints
│   │   │   ├── restaurants.py   # Restaurant CRUD
│   │   │   ├── reviews.py       # Menu reviews
│   │   │   └── reports.py       # Review reports
│   │   └── main.py          # FastAPI app initialization
│   ├── pyproject.toml       # Python dependencies (uv)
│   ├── Dockerfile           # Production Docker image
│   └── .env                 # Environment variables (not in git)
│
├── frontend_1/              # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── ui/          # Reusable UI components
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── RestaurantCard.jsx
│   │   │   │   └── MenuRating.jsx
│   │   │   └── layout/      # Layout components
│   │   ├── pages/           # Page components
│   │   │   ├── Search.jsx           # Home/search page
│   │   │   ├── RestaurantDetail.jsx # Restaurant details
│   │   │   ├── AddRestaurant.jsx    # Submit new restaurant
│   │   │   ├── ReviewerDashboard.jsx # Admin dashboard
│   │   │   ├── UserProfile.jsx      # User profile
│   │   │   └── Auth.jsx             # Login/signup
│   │   ├── contexts/        # React contexts
│   │   │   └── AuthContext.jsx      # Authentication state
│   │   ├── services/        # API services
│   │   │   ├── axiosApi.js          # Axios-based API client
│   │   │   └── editSuggestionsService.js # Edit suggestions
│   │   ├── App.jsx          # Main app component
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Global styles
│   ├── public/              # Static assets
│   ├── package.json         # npm dependencies
│   ├── vite.config.js       # Vite configuration
│   ├── Dockerfile.prod      # Production Docker image
│   ├── nginx.conf           # Nginx config for production
│   └── .env                 # Environment variables (not in git)
│
├── docs/                    # Documentation
│   ├── DEPLOYMENT.md        # Production deployment guide
│   ├── DEVELOPMENT.md       # This file
│   ├── SECURITY_AUDIT_REPORT.md  # Security analysis
│   ├── AWS_COST_ESTIMATE.md      # Cost breakdown
│   ├── TESTING_GUIDE.md          # Testing instructions
│   ├── restaurant_data_format.md # Data format spec
│   └── notes/               # Development notes
│       ├── backend-notes.txt
│       ├── frontend-notes.txt
│       └── ...
│
├── deployment/              # Deployment configuration
│   ├── docker-compose.yml       # Local development
│   ├── docker-compose.prod.yml  # Production (for reference)
│   └── scripts/             # Deployment scripts
│       ├── deploy.sh            # Full deployment script
│       └── setup-aws.sh         # AWS setup script
│
├── .gitignore              # Git ignore rules
├── README.md               # Project overview
└── QUICKSTART.md           # Quick reference guide
```

---

## Development Workflow

### 1. Create a New Feature

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes
# ... edit files ...

# Test locally
# Run backend and frontend, test functionality

# Commit changes
git add .
git commit -m "feat: add your feature description"

# Push to remote
git push origin feature/your-feature-name
```

### 2. Backend Development

**Add New API Endpoint:**

1. Create/update route in `backend_jwt/app/routes/`
2. Add database models if needed in `backend_jwt/app/database/models.py`
3. Add Pydantic schemas in `backend_jwt/app/models/`
4. Test endpoint at http://localhost:8088/docs

**Example - Add New Endpoint:**

```python
# backend_jwt/app/routes/example.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db

router = APIRouter()

@router.get("/example")
async def get_example(db: Session = Depends(get_db)):
    return {"message": "Hello World"}
```

**Register in main.py:**

```python
# backend_jwt/app/main.py
from app.routes import example

app.include_router(example.router, prefix="/api", tags=["example"])
```

### 3. Frontend Development

**Add New Page:**

1. Create component in `frontend_1/src/pages/YourPage.jsx`
2. Add route in `frontend_1/src/App.jsx`
3. Add navigation link in `Header.jsx` if needed

**Example - Create New Page:**

```jsx
// frontend_1/src/pages/NewPage.jsx
import React from 'react';

export default function NewPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">New Page</h1>
    </div>
  );
}
```

**Add Route:**

```jsx
// frontend_1/src/App.jsx
import NewPage from './pages/NewPage';

// In Routes:
<Route path="/new-page" element={<NewPage />} />
```

**Add API Call:**

```javascript
// frontend_1/src/services/axiosApi.js
export const exampleApi = {
  getData: async () => {
    const response = await axiosInstance.get('/example');
    return response.data;
  },
};
```

### 4. Database Changes

**Add New Model:**

```python
# backend_jwt/app/database/models.py
class NewModel(Base):
    __tablename__ = "new_table"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.now)
```

**Note:** Currently using SQLite without migrations. For production with PostgreSQL, use Alembic:

```bash
# Generate migration
alembic revision --autogenerate -m "Add new table"

# Apply migration
alembic upgrade head
```

---

## Testing

### Backend Testing

```bash
cd backend_jwt

# Run tests (if test suite exists)
uv run pytest

# Run with coverage
uv run pytest --cov=app tests/

# Lint code
uv run ruff check .

# Format code
uv run black .
```

### Frontend Testing

```bash
cd frontend_1

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format
```

### Manual API Testing

Use the interactive API documentation:
- Navigate to http://localhost:8088/docs
- Test endpoints directly in the browser
- See request/response schemas

### Integration Testing

See `docs/TESTING_GUIDE.md` for detailed testing procedures.

---

## Common Tasks

### Reset Database

```bash
cd backend_jwt
rm menudealmoco.db
# Database will be recreated on next startup
```

### Add New Dependency

**Backend:**
```bash
cd backend_jwt
uv add package-name
uv sync
```

**Frontend:**
```bash
cd frontend_1
npm install package-name
```

### Update Dependencies

**Backend:**
```bash
cd backend_jwt
uv lock --upgrade
uv sync
```

**Frontend:**
```bash
cd frontend_1
npm update
```

### View Logs

**Backend (development):**
- Logs appear in terminal where uvicorn is running

**Frontend (development):**
- Browser console (F12)
- Terminal where `npm run dev` is running

**Docker Compose:**
```bash
docker-compose -f deployment/docker-compose.yml logs -f
docker-compose -f deployment/docker-compose.yml logs -f backend
docker-compose -f deployment/docker-compose.yml logs -f frontend
```

### Debug Backend

**Using Python debugger:**

```python
# Add breakpoint in code
import pdb; pdb.set_trace()

# Or use breakpoint() (Python 3.7+)
breakpoint()
```

**VS Code Debug Configuration:**

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Python: FastAPI",
      "type": "python",
      "request": "launch",
      "module": "uvicorn",
      "args": [
        "app.main:app",
        "--reload",
        "--host", "0.0.0.0",
        "--port", "8088"
      ],
      "jinja": true,
      "justMyCode": true
    }
  ]
}
```

### Debug Frontend

**Using browser DevTools:**
1. Open browser DevTools (F12)
2. Go to Sources tab
3. Set breakpoints in source files
4. Trigger the code path

**React DevTools:**
- Install React DevTools browser extension
- Inspect component hierarchy and state

### Clean Build

**Backend:**
```bash
cd backend_jwt
rm -rf .venv __pycache__ .pytest_cache
uv venv
uv sync
```

**Frontend:**
```bash
cd frontend_1
rm -rf node_modules dist
npm install
npm run build
```

---

## Environment Variables

### Backend (.env)

```bash
# JWT Secret (generate with: openssl rand -hex 32)
JWT_SECRET_KEY=your-secret-key-here

# Database
DATABASE_URL=sqlite:///./menudealmoco.db

# CORS (for development)
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Trusted Hosts
ALLOWED_HOSTS=localhost,127.0.0.1

# AWS (for production)
AWS_REGION=eu-west-1
```

### Frontend (.env)

```bash
# API URL (relative for production, absolute for dev)
VITE_API_URL=/api

# For development with separate backend:
# VITE_API_URL=http://localhost:8088/api
```

---

## Coding Standards

### Backend (Python)

- Follow PEP 8 style guide
- Use type hints for function parameters and return values
- Write docstrings for public functions
- Keep functions small and focused
- Use meaningful variable names

```python
# Good
def get_restaurant_by_id(restaurant_id: int, db: Session) -> Restaurant:
    """
    Retrieve a restaurant by its ID.

    Args:
        restaurant_id: The ID of the restaurant
        db: Database session

    Returns:
        Restaurant object or None
    """
    return db.query(Restaurant).filter(Restaurant.id == restaurant_id).first()
```

### Frontend (JavaScript/React)

- Use functional components with hooks
- Use meaningful component and variable names
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use Tailwind CSS for styling

```jsx
// Good
function RestaurantCard({ restaurant }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-xl font-bold">{restaurant.name}</h3>
      <button onClick={handleFavoriteClick}>
        {isFavorite ? '❤️' : '🤍'}
      </button>
    </div>
  );
}
```

---

## Git Workflow

### Commit Message Format

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Add or update tests
- `chore:` Maintenance tasks

**Examples:**
```bash
feat(auth): add JWT refresh token support
fix(restaurants): correct price filter logic
docs(readme): update setup instructions
refactor(api): simplify error handling
```

---

## Getting Help

- **Backend API Docs:** http://localhost:8088/docs
- **Project Documentation:** `/docs` directory
- **FastAPI Docs:** https://fastapi.tiangolo.com/
- **React Docs:** https://react.dev/
- **Tailwind CSS:** https://tailwindcss.com/docs

---

## Next Steps

1. Read `QUICKSTART.md` for quick reference
2. Review `docs/TESTING_GUIDE.md` for testing procedures
3. Check `docs/restaurant_data_format.md` for data specifications
4. When ready to deploy, see `docs/DEPLOYMENT.md`
