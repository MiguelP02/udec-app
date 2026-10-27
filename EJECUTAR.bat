@echo off
chcp 65001 > nul
cd /d "%~dp0"
echo ==========================================
echo   UDEC APP - Prototipo en Flutter
echo ==========================================

where flutter > nul 2> nul
if errorlevel 1 (
  if exist "%USERPROFILE%\flutter\bin\flutter.bat" (
    set "PATH=%PATH%;%USERPROFILE%\flutter\bin"
  ) else (
    echo.
    echo No se encontro Flutter. Ejecuta primero INSTALAR_FLUTTER.bat
    pause
    exit /b 1
  )
)
where git > nul 2> nul
if errorlevel 1 if exist "C:\Program Files\Git\cmd\git.exe" set "PATH=%PATH%;C:\Program Files\Git\cmd"

if not exist "web" (
  echo.
  echo Preparando el proyecto por primera vez...
  call flutter create --project-name udec_app --org co.edu.ucundinamarca --platforms=android,web .
)

call flutter pub get
echo.
echo Abriendo UDEC APP en el navegador...
call flutter devices | findstr /i "chrome" > nul
if errorlevel 1 (
  call flutter run -d edge
) else (
  call flutter run -d chrome
)
pause
