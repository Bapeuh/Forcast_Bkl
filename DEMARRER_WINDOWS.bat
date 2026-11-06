@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
 echo Node.js 20 ou version plus recente est requis.
 echo Installer la version LTS depuis https://nodejs.org puis relancer ce fichier.
 pause
 exit /b 1
)
start "" "http://127.0.0.1:4173"
node server.mjs
pause
