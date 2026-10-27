@echo off
chcp 65001 > nul
cd /d "%~dp0"
echo ==========================================
echo   Instalador de Flutter para UDEC APP
echo ==========================================
echo Se instalara Flutter en %USERPROFILE%\flutter
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0instalar_flutter.ps1"
echo.
pause
