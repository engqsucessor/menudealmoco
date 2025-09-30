# MenuDealMoco - Project Structure

Complete overview of the project directory organization.

---

## Directory Tree

```
menudealmoco/
│
├── backend_jwt/                    # Python FastAPI Backend
│   ├── app/
│   │   ├── auth/                  # Authentication & Authorization
│   │   │   ├── middleware.py      # JWT middleware & dependency injection
│   │   │   └── security.py        # JWT token creation/verification
│   │   │
│   │   ├── database/              # Database Layer
│   │   │   ├── database.py        # SQLAlchemy setup & session management
│   │   │   └── models.py          # Database models (SQLAlchemy)
│   │   │
│   │   ├── models/                # API Models (Pydantic)
│   │   │   └── restaurant.py      # Request/response schemas
│   │   │
│   │   ├── routes/                # API Endpoints
│   │   │   ├── auth.py            # /api/auth/* (login, signup, profile)
│   │   │   ├── restaurants.py     # /api/restaurants/* (CRUD operations)
│   │   │   ├── reviews.py         # /api/reviews/* (menu reviews)
│   │   │   └── reports.py         # /api/reports/* (content moderation)
│   │   │
│   │   └── main.py                # FastAPI application entry point
│   │
│   ├── data/                      # Runtime data (gitignored)
│   │   └── menudealmoco.db        # SQLite database
│   │
│   ├── tests/                     # Backend tests
│   │   └── ...
│   │
│   ├── .venv/                     # Python virtual environment (gitignored)
│   ├── pyproject.toml             # Python dependencies (uv)
│   ├── Dockerfile                 # Docker image for production
│   └── .env                       # Environment variables (gitignored)
│
├── frontend_1/                    # React Frontend
│   ├── src/
│   │   ├── components/            # Reusable Components
│   │   │   ├── ui/               # UI Components
│   │   │   │   ├── Header.jsx     # Navigation header
│   │   │   │   ├── Footer.jsx     # Footer
│   │   │   │   ├── RestaurantCard.jsx  # Restaurant display card
│   │   │   │   ├── MenuRating.jsx      # Star rating component
│   │   │   │   ├── FilterSidebar.jsx   # Search filters
│   │   │   │   └── ...
│   │   │   └── layout/           # Layout components
│   │   │
│   │   ├── pages/                # Page Components (Routes)
│   │   │   ├── Search.jsx         # Home/search page
│   │   │   ├── SearchResults.jsx  # Search results page
│   │   │   ├── RestaurantDetail.jsx # Restaurant details
│   │   │   ├── AddRestaurant.jsx  # Submit restaurant form
│   │   │   ├── ReviewerDashboard.jsx # Admin dashboard
│   │   │   ├── UserProfile.jsx    # User profile page
│   │   │   └── Auth.jsx           # Login/signup page
│   │   │
│   │   ├── contexts/             # React Contexts
│   │   │   └── AuthContext.jsx    # Authentication state management
│   │   │
│   │   ├── services/             # API Services
│   │   │   ├── axiosApi.js        # Axios HTTP client & API methods
│   │   │   └── editSuggestionsService.js # Edit suggestions
│   │   │
│   │   ├── assets/               # Static assets (images, fonts)
│   │   │
│   │   ├── App.jsx               # Main application component
│   │   ├── main.jsx              # React entry point
│   │   └── index.css             # Global styles (Tailwind)
│   │
│   ├── public/                   # Public static files
│   │   └── ...
│   │
│   ├── dist/                     # Build output (gitignored)
│   ├── node_modules/             # NPM dependencies (gitignored)
│   ├── package.json              # NPM dependencies & scripts
│   ├── vite.config.js            # Vite build configuration
│   ├── tailwind.config.js        # Tailwind CSS configuration
│   ├── postcss.config.js         # PostCSS configuration
│   ├── Dockerfile.prod           # Production Docker image
│   ├── nginx.conf                # Nginx configuration for production
│   └── .env                      # Environment variables (gitignored)
│
├── docs/                         # Documentation
│   ├── DEPLOYMENT.md             # Complete deployment guide
│   ├── DEVELOPMENT.md            # Local development setup
│   ├── PROJECT_STRUCTURE.md      # This file
│   ├── SECURITY_AUDIT_REPORT.md  # Security analysis & improvements
│   ├── AWS_COST_ESTIMATE.md      # Cost breakdown & projections
│   ├── TESTING_GUIDE.md          # Testing procedures
│   ├── restaurant_data_format.md # Restaurant data specification
│   │
│   └── notes/                    # Development notes
│       ├── backend-notes.txt     # Backend implementation notes
│       ├── frontend-notes.txt    # Frontend implementation notes
│       ├── hosting-notes.txt     # Hosting considerations
│       ├── database-notes.txt    # Database design notes
│       ├── mvp-notes.txt         # MVP feature list
│       └── issues.txt            # Known issues & fixes
│
├── deployment/                   # Deployment Configuration
│   ├── docker-compose.yml        # Local development compose file
│   ├── docker-compose.prod.yml   # Production compose file
│   │
│   └── scripts/                  # Deployment Scripts
│       ├── deploy.sh             # Full deployment automation
│       └── setup-aws.sh          # AWS resource setup
│
├── .git/                         # Git repository (gitignored metadata)
├── .claude/                      # Claude Code configuration (gitignored)
│
├── .gitignore                    # Git ignore rules
├── README.md                     # Project overview & quick start
└── QUICKSTART.md                 # Quick reference guide

```

---

## File Descriptions

### Root Files

- **`.gitignore`** - Specifies which files Git should ignore (secrets, builds, dependencies)
- **`README.md`** - Main project documentation, features, and quick start guide
- **`QUICKSTART.md`** - Quick reference for common commands and operations

### Backend Files

#### Core Application
- **`app/main.py`** - FastAPI application initialization, CORS, middleware setup
- **`app/auth/security.py`** - JWT token creation, verification, AWS Secrets Manager integration
- **`app/auth/middleware.py`** - Authentication middleware, current user dependency
- **`app/database/database.py`** - SQLAlchemy engine, session management
- **`app/database/models.py`** - Database ORM models (User, Restaurant, Review, etc.)

#### API Routes
- **`app/routes/auth.py`** - User authentication endpoints (login, signup, profile)
- **`app/routes/restaurants.py`** - Restaurant CRUD, search, filtering, submissions
- **`app/routes/reviews.py`** - Menu review creation, voting, retrieval
- **`app/routes/reports.py`** - Content moderation, review reporting

#### Configuration
- **`pyproject.toml`** - Python dependencies managed by uv
- **`Dockerfile`** - Multi-stage Docker build for production
- **`.env`** - Environment variables (JWT_SECRET_KEY, DATABASE_URL, etc.)

### Frontend Files

#### Pages (Routes)
- **`pages/Search.jsx`** - Home page with search functionality
- **`pages/SearchResults.jsx`** - Display filtered restaurant results
- **`pages/RestaurantDetail.jsx`** - Detailed restaurant view with reviews
- **`pages/AddRestaurant.jsx`** - Form to submit new restaurant
- **`pages/ReviewerDashboard.jsx`** - Admin interface for submissions & reports
- **`pages/UserProfile.jsx`** - User profile and settings
- **`pages/Auth.jsx`** - Login and signup forms

#### Components
- **`components/ui/Header.jsx`** - Navigation with auth state
- **`components/ui/Footer.jsx`** - Footer with links
- **`components/ui/RestaurantCard.jsx`** - Restaurant preview card
- **`components/ui/MenuRating.jsx`** - Star rating display and input
- **`components/ui/FilterSidebar.jsx`** - Search filter controls

#### Services
- **`services/axiosApi.js`** - Centralized API client with authentication
- **`services/editSuggestionsService.js`** - Edit suggestion submission

#### Contexts
- **`contexts/AuthContext.jsx`** - Global authentication state management

#### Configuration
- **`package.json`** - NPM dependencies and build scripts
- **`vite.config.js`** - Vite dev server and build configuration
- **`tailwind.config.js`** - Tailwind CSS theme customization
- **`Dockerfile.prod`** - Multi-stage build with Nginx
- **`nginx.conf`** - Nginx configuration for SPA routing
- **`.env`** - Environment variables (VITE_API_URL)

### Documentation Files

- **`docs/DEPLOYMENT.md`** - Step-by-step production deployment to AWS
- **`docs/DEVELOPMENT.md`** - Local development environment setup
- **`docs/SECURITY_AUDIT_REPORT.md`** - Security assessment and hardening
- **`docs/AWS_COST_ESTIMATE.md`** - Monthly and annual cost projections
- **`docs/TESTING_GUIDE.md`** - Testing procedures and examples
- **`docs/restaurant_data_format.md`** - Restaurant data schema specification
- **`docs/PROJECT_STRUCTURE.md`** - This file

### Deployment Files

- **`deployment/docker-compose.yml`** - Local development orchestration
- **`deployment/docker-compose.prod.yml`** - Production deployment config
- **`deployment/scripts/deploy.sh`** - Automated deployment script
- **`deployment/scripts/setup-aws.sh`** - AWS resource setup automation

---

## Data Flow

### Authentication Flow

```
1. User submits credentials → Frontend (Auth.jsx)
2. Frontend calls → axiosApi.js → POST /api/auth/login
3. Backend validates → auth/routes.py → database/models.py
4. Backend generates JWT → auth/security.py
5. Backend returns tokens + user data
6. Frontend stores tokens → AuthContext.jsx → sessionStorage
7. Subsequent requests include JWT → Authorization header
8. Backend verifies JWT → auth/middleware.py → get_current_user
```

### Restaurant Search Flow

```
1. User enters search → Frontend (Search.jsx)
2. Frontend calls → axiosApi.js → GET /api/restaurants?filters...
3. Backend queries database → routes/restaurants.py → database/models.py
4. Backend applies filters → Python list comprehensions
5. Backend sorts results → sortBy parameter
6. Backend paginates → page/limit
7. Backend returns JSON → RestaurantResponse model
8. Frontend displays → SearchResults.jsx → RestaurantCard.jsx
```

### Review Submission Flow

```
1. User writes review → Frontend (RestaurantDetail.jsx)
2. User must be authenticated → AuthContext verifies token
3. Frontend calls → axiosApi.js → POST /api/restaurants/{id}/reviews
4. Backend verifies JWT → auth/middleware.py
5. Backend creates review → routes/reviews.py → database/models.py
6. Backend returns success
7. Frontend refreshes reviews → Re-fetch from API
8. Review appears in list with user's name
```

### Restaurant Submission Flow

```
1. User fills form → Frontend (AddRestaurant.jsx)
2. User must be authenticated → AuthContext
3. Frontend calls → axiosApi.js → POST /api/restaurants/submit
4. Backend creates submission → routes/restaurants.py
5. Submission status = "pending"
6. Reviewer views → ReviewerDashboard.jsx
7. Reviewer approves/rejects → POST /api/restaurants/submissions/{id}/review
8. If approved → Restaurant becomes visible to public
```

---

## Database Schema

### Tables

**users**
- id (PK)
- email (unique)
- hashed_password
- display_name
- role (user/reviewer/admin)
- created_at

**restaurants**
- id (PK)
- name, address, city, district
- menu_price, price_range, food_type
- google_rating, google_reviews
- description, dishes (JSON)
- photos (JSON), restaurant_photo, menu_photo
- status (pending/approved/rejected)
- submitted_by_id (FK → users)
- approved_by_id (FK → users)
- submitted_at, approved_at

**menu_reviews**
- id (PK)
- restaurant_id (FK → restaurants)
- user_id (FK → users)
- rating (1-5)
- comment
- helpful_count, not_helpful_count
- created_at

**review_votes**
- id (PK)
- review_id (FK → menu_reviews)
- user_id (FK → users)
- vote_type (helpful/not_helpful)

**review_reports**
- id (PK)
- review_id (FK → menu_reviews)
- reporter_id (FK → users)
- reason
- status (pending/resolved)
- resolved_by_id (FK → users)
- created_at, resolved_at

**restaurant_submissions**
- id (PK)
- restaurant_name
- submitted_by_id (FK → users)
- data (JSON - full restaurant data)
- status (pending/approved/rejected)
- approved_by_id (FK → users)
- reviewer_comments (JSON)
- submitted_at, reviewed_at

**user_favorites** (many-to-many)
- user_id (FK → users)
- restaurant_id (FK → restaurants)

---

## API Endpoint Groups

### Public Endpoints (No Auth)
- `GET /api/restaurants` - List approved restaurants
- `GET /api/restaurants/{id}` - Get restaurant details
- `GET /api/restaurants/{id}/reviews` - Get menu reviews
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration

### Authenticated Endpoints
- `POST /api/restaurants/submit` - Submit new restaurant
- `POST /api/restaurants/{id}/reviews` - Add menu review
- `POST /api/reviews/{id}/vote` - Vote on review
- `POST /api/reports/reviews` - Report review
- `PUT /api/auth/update-display-name` - Update profile
- `POST /api/auth/refresh` - Refresh access token

### Reviewer Endpoints (Role Required)
- `GET /api/restaurants/submissions` - List all submissions
- `POST /api/restaurants/submissions/{id}/review` - Approve/reject submission
- `DELETE /api/restaurants/{id}` - Delete restaurant
- `GET /api/reports/reviews` - Get reported reviews
- `POST /api/reports/{id}/resolve` - Resolve report

---

## Environment Variables

### Backend (.env)
```bash
JWT_SECRET_KEY=<64-char-hex-string>
DATABASE_URL=sqlite:///./menudealmoco.db
ALLOWED_ORIGINS=https://yourdomain.com,http://localhost:5173
ALLOWED_HOSTS=yourdomain.com,localhost,127.0.0.1
AWS_REGION=eu-west-1
```

### Frontend (.env)
```bash
VITE_API_URL=/api
```

---

## Build Artifacts

### Backend
- **`.venv/`** - Python virtual environment
- **`__pycache__/`** - Python bytecode cache
- **`data/menudealmoco.db`** - SQLite database file

### Frontend
- **`node_modules/`** - NPM dependencies
- **`dist/`** - Production build output
- **`.vite/`** - Vite cache

---

## Git Ignored Files

- All build artifacts
- Dependencies (node_modules, .venv)
- Environment files (.env)
- Database files (*.db, *.sqlite)
- SSH keys (*.pem)
- Large binaries (*.msi, *.tar.gz)
- IDE configs (.vscode, .idea)
- OS files (.DS_Store, Thumbs.db)

---

## Docker Images

### Backend Image
- Base: python:3.10-slim
- Working dir: /app
- Installs: uv, Python dependencies
- Exposes: 8088
- Command: uvicorn app.main:app

### Frontend Image
- Stage 1: node:18-alpine (build)
  - Builds React app with Vite
- Stage 2: nginx:alpine (serve)
  - Copies built files
  - Serves with Nginx
- Exposes: 80

---

## External Dependencies

### Backend Python Packages
- fastapi - Web framework
- uvicorn - ASGI server
- sqlalchemy - ORM
- pyjwt - JWT tokens
- bcrypt - Password hashing
- boto3 - AWS SDK
- slowapi - Rate limiting
- pydantic - Data validation

### Frontend NPM Packages
- react, react-dom - UI library
- react-router-dom - Routing
- axios - HTTP client
- tailwindcss - CSS framework
- lucide-react - Icons
- vite - Build tool

---

## Related Documentation

- [README.md](../README.md) - Project overview
- [QUICKSTART.md](../QUICKSTART.md) - Quick reference
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide
- [DEVELOPMENT.md](DEVELOPMENT.md) - Development guide
- [SECURITY_AUDIT_REPORT.md](SECURITY_AUDIT_REPORT.md) - Security details
