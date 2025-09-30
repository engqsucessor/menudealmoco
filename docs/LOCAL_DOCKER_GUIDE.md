# Local Development & Testing Guide

Quick guide for developing locally and testing changes before deploying to production.

---

## ⚡ Fast Local Development (Recommended)

For rapid development with hot reload:

### Windows
```bash
# Double-click or run:
start-dev.bat
```

This starts:
- **Backend:** http://localhost:8088 (with auto-reload)
- **Frontend:** http://localhost:5173 (with hot module replacement)
- **API Docs:** http://localhost:8088/docs

**Changes are instant!** Edit files and see changes immediately without rebuilding.

### Stop Servers
Press any key in the `start-dev.bat` window, or close the terminal windows.

---

## 🐳 Docker Testing (Closer to Production)

Use Docker when you want to test in an environment closer to production.

### Quick Start

### Start Local Environment
```bash
# Build and start containers
docker-compose -f docker-compose.local.yml up -d

# View logs
docker-compose -f docker-compose.local.yml logs -f

# Check status
docker-compose -f docker-compose.local.yml ps
```

### Access Application
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000/api
- **API Docs:** http://localhost:8000/docs

### Stop Environment
```bash
# Stop containers
docker-compose -f docker-compose.local.yml down

# Stop and remove volumes (reset database)
docker-compose -f docker-compose.local.yml down -v
```

---

## 🔄 Workflow for Testing Changes

### 1. Make Code Changes
Edit files in `frontend_1/` or `backend_jwt/`

### 2. Rebuild Images

**Frontend changes:**
```bash
cd frontend_1
docker build -f Dockerfile.prod -t menudealmoco-frontend-local .
```

**Backend changes:**
```bash
cd backend_jwt
docker build -t menudealmoco-backend-local .
```

### 3. Restart Containers
```bash
# From project root
docker-compose -f docker-compose.local.yml restart

# OR completely recreate
docker-compose -f docker-compose.local.yml down
docker-compose -f docker-compose.local.yml up -d
```

### 4. Test in Browser
Open http://localhost:3000 and test your changes

---

## 🛠️ Common Commands

### View Logs
```bash
# All services
docker-compose -f docker-compose.local.yml logs -f

# Only frontend
docker-compose -f docker-compose.local.yml logs -f frontend

# Only backend
docker-compose -f docker-compose.local.yml logs -f backend

# Last 50 lines
docker-compose -f docker-compose.local.yml logs --tail=50
```

### Restart Services
```bash
# Restart all
docker-compose -f docker-compose.local.yml restart

# Restart frontend only
docker-compose -f docker-compose.local.yml restart frontend

# Restart backend only
docker-compose -f docker-compose.local.yml restart backend
```

### Access Container Shell
```bash
# Backend container
docker-compose -f docker-compose.local.yml exec backend bash

# Frontend container
docker-compose -f docker-compose.local.yml exec frontend sh
```

### Check Resource Usage
```bash
docker stats
```

---

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Check what's using port 3000
netstat -ano | findstr :3000

# Check what's using port 8000
netstat -ano | findstr :8000

# Kill process (Windows)
taskkill /PID <PID> /F

# Change ports in docker-compose.local.yml if needed
ports:
  - "3001:80"  # Use 3001 instead of 3000
```

### Database Issues
```bash
# Reset database
docker-compose -f docker-compose.local.yml down -v
docker-compose -f docker-compose.local.yml up -d

# Or manually delete volume
docker volume rm menudealmoco_backend_data
```

### Container Won't Start
```bash
# Check logs
docker-compose -f docker-compose.local.yml logs backend

# Rebuild image
cd backend_jwt
docker build --no-cache -t menudealmoco-backend-local .
```

### Frontend Not Updating
```bash
# Clear browser cache (Ctrl+Shift+Delete)
# Or use incognito mode

# Rebuild with --no-cache
cd frontend_1
docker build --no-cache -f Dockerfile.prod -t menudealmoco-frontend-local .
```

---

## 📝 Quick Testing Checklist

After making changes:

- [ ] Build new Docker image
- [ ] Restart containers
- [ ] Check logs for errors
- [ ] Test in browser at http://localhost:3000
- [ ] Verify API calls work (check Network tab in DevTools)
- [ ] Test login/logout
- [ ] Test your specific changes

If everything works:
- [ ] Commit changes
- [ ] Deploy to production (see DEPLOYMENT.md)

---

## 🎯 Example: Testing the Login Redirect Feature

We just added a "Go to Login" button when users try to review without being logged in.

### Test Steps:
1. **Start local environment:**
   ```bash
   docker-compose -f docker-compose.local.yml up -d
   ```

2. **Open browser:** http://localhost:3000

3. **Navigate to any restaurant** (click on a restaurant card)

4. **Click "Reviews" tab**

5. **Verify you see:**
   - "No menu reviews yet. Be the first to rate this lunch menu!"
   - "Login to write the first review!"
   - **Green "GO TO LOGIN" button** ← NEW!

6. **Click the button** - should redirect to /auth login page

7. **Test after login:**
   - Login with test account
   - Go back to restaurant
   - Now you should see "Write First Review" button instead

---

## 🔒 Environment Variables

Local setup uses these defaults:

```yaml
Backend:
  - DATABASE_URL: sqlite:///./menudealmoco.db
  - JWT_SECRET_KEY: local-dev-secret-key-change-in-production-12345678
  - ALLOWED_ORIGINS: http://localhost:3000,http://localhost:5173
  - ALLOWED_HOSTS: localhost,127.0.0.1,frontend,backend

Frontend:
  - VITE_API_URL: /api (configured in .env)
```

**Note:** The local JWT secret is different from production (which uses AWS Secrets Manager).

---

## 💡 Tips

1. **Fast development:** Use `npm run dev` for frontend hot reload, only use Docker for final testing

2. **Database persistence:** Data persists in Docker volume `menudealmoco_backend_data`

3. **Network isolation:** Containers communicate via `app-network`, isolated from host

4. **Resource usage:** This setup uses ~500MB RAM, minimal CPU

5. **Image sizes:**
   - Backend: ~150MB
   - Frontend: ~50MB

---

## 🚢 Ready to Deploy?

Once you've tested locally and everything works:

1. **Commit your changes:**
   ```bash
   git add .
   git commit -m "feat: add login redirect for non-authenticated users in reviews"
   git push
   ```

2. **Deploy to production:**
   ```bash
   EC2_HOST=your-ec2-ip ./deployment/scripts/deploy.sh
   ```

Or follow the manual deployment guide: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

---

## 📚 Related Documentation

- **Development Setup:** [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)
- **Production Deployment:** [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)
- **Project Structure:** [docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md)

---

**Happy Testing! 🎉**
