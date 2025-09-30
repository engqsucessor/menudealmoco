# Development Quick Start

## 🚀 Fastest Way to Start Developing

### Windows
```bash
# Just double-click:
start-dev.bat
```

That's it! Both servers will start automatically.

---

## What Gets Started

- **Backend:** http://localhost:8088
  - API Docs: http://localhost:8088/docs
  - Auto-reloads when you edit Python files
  - Uses your local database

- **Frontend:** http://localhost:5173
  - Hot module replacement (instant updates)
  - Edit CSS/JSX and see changes immediately

---

## Making Changes

### Frontend Changes (Instant)
1. Edit any file in `frontend_1/src/`
2. Save
3. Browser updates automatically ✨

### Backend Changes (Auto-reload)
1. Edit any file in `backend_jwt/app/`
2. Save
3. Server restarts automatically ✨

### CSS Changes (Instant)
1. Edit `.module.css` files
2. Save
3. Styles update immediately ✨

---

## Testing Your Changes

### Test the Login Redirect Feature
1. Open http://localhost:5173
2. Click any restaurant
3. Go to "Reviews" tab
4. Click the green "GO TO LOGIN" button
5. Should redirect to login page

---

## Stopping Development

Press any key in the `start-dev.bat` window, or just close the terminal windows.

---

## Using Docker Instead (Slower, but closer to production)

If you need to test in Docker:

```bash
# Build images (only needed when dependencies change)
cd frontend_1
docker build -f Dockerfile.prod -t menudealmoco-frontend-local .
cd ../backend_jwt
docker build -t menudealmoco-backend-local .

# Start Docker containers
cd ..
docker-compose -f deployment/docker-compose.local.yml up -d

# View at http://localhost:3000
```

**Note:** Docker requires rebuild every time you change code!

---

## Troubleshooting

### Port Already in Use
```bash
# Kill processes on port 8088
netstat -ano | findstr :8088
taskkill /PID <PID> /F

# Kill processes on port 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Backend Won't Start
```bash
cd backend_jwt
uv sync
# Then try start-dev.bat again
```

### Frontend Won't Start
```bash
cd frontend_1
npm install
# Then try start-dev.bat again
```

---

## File Structure

```
menudealmoco/
├── start-dev.bat          # ⭐ Run this!
├── backend_jwt/
│   └── app/              # Edit Python files here
├── frontend_1/
│   └── src/
│       ├── pages/        # Edit pages here
│       ├── components/   # Edit components here
│       └── *.module.css  # Edit styles here
```

---

## Next Steps

Once you've tested locally:

1. **Commit changes:**
   ```bash
   git add .
   git commit -m "your changes"
   ```

2. **Deploy to production:**
   ```bash
   EC2_HOST=your-ip ./deployment/scripts/deploy.sh
   ```

See `docs/DEPLOYMENT.md` for full deployment guide.

---

**Happy Coding! 🎉**
