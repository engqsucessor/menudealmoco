@echo off
echo ========================================
echo Starting MenuDealMoco Development Servers
echo ========================================
echo.

REM Start backend in new window
echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend_jwt && uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8088"

REM Wait a bit for backend to start
timeout /t 3 /nobreak > nul

REM Start frontend in new window
echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend_1 && npm run dev -- --port 3000"

echo.
echo ========================================
echo Development servers starting...
echo ========================================
echo Backend:  http://localhost:8088
echo Backend API Docs: http://localhost:8088/docs
echo Frontend: http://localhost:3000
echo ========================================
echo.
echo Press any key to stop all servers...
pause > nul

REM Kill the servers
taskkill /FI "WindowTitle eq Backend Server*" /T /F
taskkill /FI "WindowTitle eq Frontend Server*" /T /F

echo Servers stopped.
