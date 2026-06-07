@echo off
:: ══════════════════════════════════════════════════════
::  Shiwam Portfolio – Local Dev Server
::  Run this file as Administrator!
::  Right-click → "Run as administrator"
:: ══════════════════════════════════════════════════════

net session >nul 2>&1
if %errorLevel% NEQ 0 (
    echo.
    echo  ╔════════════════════════════════════════╗
    echo  ║  Please right-click this file and     ║
    echo  ║  select "Run as administrator"        ║
    echo  ╚════════════════════════════════════════╝
    echo.
    pause
    exit /b
)

:: Add custom hostname if not already added
findstr /C:"shiwam-portfolio" "%SystemRoot%\System32\drivers\etc\hosts" >nul 2>&1
if %errorLevel% NEQ 0 (
    echo Adding shiwam-portfolio to hosts file...
    echo 127.0.0.1   shiwam-portfolio >> "%SystemRoot%\System32\drivers\etc\hosts"
    echo [OK] Hostname added!
) else (
    echo [OK] Hostname already exists.
)

:: Flush DNS cache
ipconfig /flushdns >nul 2>&1

:: Start Python server on port 80
echo.
echo  ╔════════════════════════════════════════════╗
echo  ║  Your portfolio is live at:               ║
echo  ║                                           ║
echo  ║    http://shiwam-portfolio                ║
echo  ║                                           ║
echo  ║  Press Ctrl+C to stop the server         ║
echo  ╚════════════════════════════════════════════╝
echo.

:: Open browser
timeout /t 2 >nul
start "" "http://shiwam-portfolio"

:: Start server
cd /d "D:\DA Portfolio"
python -m http.server 80
pause
