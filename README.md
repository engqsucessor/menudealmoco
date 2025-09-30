# MenuDealMoco 🍽️

**Discover the best menu deals in Portugal!**

MenuDealMoco is a web platform that helps users discover and review restaurants offering "menu do dia" (daily menu) deals across Portugal. Users can search, filter, review, and rate restaurants based on their lunch menu offerings.

---

## 🌟 Features

- **🔍 Smart Search:** Find restaurants by name, location, food type, and price range
- **⭐ Menu Reviews:** Rate and review daily menu offerings (separate from Google ratings)
- **🗺️ Location-Based:** Search restaurants by city, district, or address
- **💰 Price Filtering:** Find menus within your budget
- **📱 Responsive Design:** Works seamlessly on desktop, tablet, and mobile
- **🔐 User Authentication:** Secure JWT-based authentication
- **📝 Community Submissions:** Users can submit new restaurants for review
- **👮 Moderation System:** Reviewers can approve, reject, or request changes to submissions
- **🚩 Report System:** Flag inappropriate reviews
- **📊 Multiple Sorting Options:** Sort by rating, price, name, and more

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.10+
- Docker and Docker Compose (optional)

### Running Locally

```bash
# Clone repository
git clone <your-repo-url>
cd menudealmoco

# Backend setup
cd backend_jwt
pip install uv
uv venv && source .venv/bin/activate
uv sync
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8088

# Frontend setup (in new terminal)
cd frontend_1
npm install
npm run dev
```

Access:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8088/api
- **API Docs:** http://localhost:8088/docs

**👉 For detailed instructions, see [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)**

---

## 📦 Tech Stack

### Frontend
- **React** 18 with React Router
- **Vite** for fast builds and dev server
- **Tailwind CSS** for styling
- **Axios** for API communication
- **React Icons** for UI icons

### Backend
- **FastAPI** (Python) for high-performance REST API
- **SQLAlchemy** ORM with SQLite (production-ready for Postgres)
- **JWT** authentication with token refresh
- **Pydantic** for data validation
- **SlowAPI** for rate limiting
- **Uvicorn** ASGI server

### Infrastructure
- **Docker** for containerization
- **Nginx** as reverse proxy and static file server
- **AWS EC2** for hosting
- **AWS ECR** for Docker image registry
- **AWS Secrets Manager** for secure credential storage
- **Let's Encrypt** for SSL certificates
- **UFW Firewall** for network security

---

## 📁 Project Structure

```
menudealmoco/
├── backend_jwt/              # FastAPI backend
│   ├── app/
│   │   ├── auth/            # JWT authentication
│   │   ├── database/        # Database models
│   │   ├── routes/          # API endpoints
│   │   └── main.py          # FastAPI app
│   ├── pyproject.toml       # Python dependencies
│   └── Dockerfile
│
├── frontend_1/              # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API client
│   │   └── contexts/        # React contexts
│   ├── package.json
│   ├── Dockerfile.prod
│   └── nginx.conf
│
├── docs/                    # Documentation
│   ├── DEPLOYMENT.md        # Deployment guide
│   ├── DEVELOPMENT.md       # Development setup
│   ├── SECURITY_AUDIT_REPORT.md
│   ├── AWS_COST_ESTIMATE.md
│   └── TESTING_GUIDE.md
│
├── deployment/              # Deployment config
│   ├── docker-compose.yml
│   ├── docker-compose.prod.yml
│   └── scripts/
│
└── README.md               # This file
```

---

## 🔒 Security Features

- ✅ **JWT Authentication** with access and refresh tokens
- ✅ **AWS Secrets Manager** for secure credential storage
- ✅ **HTTPS/TLS 1.2-1.3** encryption
- ✅ **CORS** and **TrustedHost** middleware
- ✅ **Rate Limiting** to prevent abuse
- ✅ **Security Headers** (HSTS, X-Frame-Options, etc.)
- ✅ **UFW Firewall** with restricted access
- ✅ **Localhost-only** Docker port binding
- ✅ **Database file** permissions (600)

**Security Score:** 9.0/10

**👉 Full security audit: [docs/SECURITY_AUDIT_REPORT.md](docs/SECURITY_AUDIT_REPORT.md)**

---

## 💰 Cost

Running on AWS Free Tier:

| Period | Monthly Cost | Annual Cost |
|--------|-------------|-------------|
| **Year 1** | $0.57 | $6.84 |
| **Year 2+** | $8.80 | $105.60 |

**👉 Detailed breakdown: [docs/AWS_COST_ESTIMATE.md](docs/AWS_COST_ESTIMATE.md)**

---

## 📚 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Quick reference guide
- **[docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)** - Local development setup
- **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** - Production deployment guide
- **[docs/TESTING_GUIDE.md](docs/TESTING_GUIDE.md)** - Testing procedures
- **[docs/SECURITY_AUDIT_REPORT.md](docs/SECURITY_AUDIT_REPORT.md)** - Security analysis
- **[docs/AWS_COST_ESTIMATE.md](docs/AWS_COST_ESTIMATE.md)** - Cost breakdown
- **[docs/restaurant_data_format.md](docs/restaurant_data_format.md)** - Data specifications

---

## 🚢 Deployment

### Quick Deploy to AWS

```bash
# 1. Build and push images
cd backend_jwt
docker build -t menudealmoco-backend .
docker push <your-ecr-url>/menudealmoco-backend:latest

cd ../frontend_1
docker build -f Dockerfile.prod -t menudealmoco-frontend .
docker push <your-ecr-url>/menudealmoco-frontend:latest

# 2. Deploy on EC2
ssh -i your-key.pem ubuntu@your-ec2-ip
cd ~/menudealmoco
docker-compose pull
docker-compose up -d
```

**👉 Full deployment guide: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)**

---

## 🧪 API Endpoints

### Public Endpoints
- `GET /api/restaurants` - Get all approved restaurants (with filters)
- `GET /api/restaurants/{id}` - Get restaurant details
- `GET /api/restaurants/{id}/reviews` - Get menu reviews
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration

### Protected Endpoints (Require Authentication)
- `POST /api/restaurants/submit` - Submit new restaurant
- `POST /api/restaurants/{id}/reviews` - Add menu review
- `POST /api/reviews/{id}/vote` - Vote on review (helpful/not helpful)
- `POST /api/reports/reviews` - Report inappropriate review
- `PUT /api/auth/update-display-name` - Update display name

### Reviewer Endpoints (Require Reviewer Role)
- `GET /api/restaurants/submissions` - Get all submissions
- `POST /api/restaurants/submissions/{id}/review` - Review submission
- `DELETE /api/restaurants/{id}` - Delete restaurant
- `GET /api/reports/reviews` - Get reported reviews
- `POST /api/reports/{id}/resolve` - Resolve report

**👉 Interactive API Docs:** http://localhost:8088/docs (when running locally)

---

## 🛠️ Development

### Run Backend Tests
```bash
cd backend_jwt
uv run pytest
```

### Run Frontend Tests
```bash
cd frontend_1
npm test
```

### Lint Code
```bash
# Backend
cd backend_jwt
uv run ruff check .

# Frontend
cd frontend_1
npm run lint
```

### View Logs
```bash
# Docker Compose
docker-compose -f deployment/docker-compose.yml logs -f

# Specific service
docker-compose -f deployment/docker-compose.yml logs -f backend
```

---

## 🗺️ Roadmap

### Completed ✅
- [x] User authentication and profiles
- [x] Restaurant search and filtering
- [x] Menu review system
- [x] Restaurant submission workflow
- [x] Reviewer dashboard
- [x] Review voting system
- [x] Report system for inappropriate content
- [x] AWS production deployment
- [x] SSL/HTTPS setup
- [x] Security hardening

### In Progress 🚧
- [ ] Restaurant photos upload
- [ ] Advanced search filters
- [ ] User favorites

### Planned 📋
- [ ] Email notifications
- [ ] Restaurant opening hours
- [ ] Map integration
- [ ] Mobile app (React Native)
- [ ] Restaurant owner claims
- [ ] Analytics dashboard
- [ ] API rate limiting per user
- [ ] Multiple language support

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit with clear messages (`git commit -m 'feat: add amazing feature'`)
5. Push to your branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Commit Message Format
```
type(scope): subject

feat: New feature
fix: Bug fix
docs: Documentation changes
style: Code style changes
refactor: Code refactoring
test: Add or update tests
chore: Maintenance tasks
```

---

## 📝 License

This project is private and proprietary. All rights reserved.

---

## 👥 Team

Developed with ❤️ by the MenuDealMoco team

---

## 📧 Contact

For questions or support:
- Create an issue in the repository
- Check documentation in `/docs` directory

---

## 🙏 Acknowledgments

- FastAPI for the excellent Python framework
- React team for the UI library
- Tailwind CSS for the styling framework
- AWS for reliable cloud infrastructure
- Let's Encrypt for free SSL certificates
- All open-source contributors

---

## 📊 Project Stats

- **Lines of Code:** ~15,000+
- **API Endpoints:** 20+
- **Database Tables:** 8
- **React Components:** 30+
- **Test Coverage:** TBD
- **Deployment Time:** ~15 minutes
- **Monthly Cost:** $0.57 (Year 1) / $8.80 (Year 2+)

---

**⭐ If you find this project useful, please consider starring it!**
