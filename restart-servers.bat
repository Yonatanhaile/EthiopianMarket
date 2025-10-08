@echo off
echo ========================================
echo  RESTARTING ETHIOPIA MARKET SERVERS
echo ========================================
echo.

echo Step 1: Stopping any running Node.js processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo Step 2: Starting Backend Server...
echo.
cd backend
start "Backend Server" cmd /k "npm start"
timeout /t 3 /nobreak >nul

echo.
echo Step 3: Starting Frontend Server...
echo.
cd ..\EthiopiaMarket
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ========================================
echo  SERVERS STARTING...
echo ========================================
echo.
echo Backend will run on: http://localhost:5000
echo Frontend will run on: http://localhost:3000
echo.
echo Wait 10-15 seconds for servers to fully start
echo Then open: http://localhost:3000
echo.
echo Press any key to close this window...
pause >nul

