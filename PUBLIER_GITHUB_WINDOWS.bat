@echo off
setlocal EnableExtensions
cd /d "%~dp0"
set "REPO=https://github.com/Bapeuh/Forcast_Bkl.git"
set "BRANCH=feature/l01-document-builder"
set "TARGET=%TEMP%\Forcast_L01_%RANDOM%_%RANDOM%"
echo Forecast Backlight L01 - Publication sur une branche de recette
where git >nul 2>nul || (echo Git pour Windows requis.& pause & exit /b 1)
where node >nul 2>nul || (echo Node.js 20+ requis.& pause & exit /b 1)
call npm test
if errorlevel 1 (echo ECHEC tests - publication interrompue.& pause & exit /b 1)
git clone "%REPO%" "%TARGET%"
if errorlevel 1 (echo ECHEC clone.& pause & exit /b 1)
cd /d "%TARGET%"
git fetch origin "%BRANCH%" >nul 2>nul
if errorlevel 1 (
  git checkout -b "%BRANCH%" origin/main
) else (
  git checkout -b "%BRANCH%" "origin/%BRANCH%"
)
if errorlevel 1 (echo ECHEC branche.& pause & exit /b 1)
cd /d "%~dp0"
for %%D in (core public scripts tests docs assets .github) do (
 if exist "%%D" (
  robocopy "%%D" "%TARGET%\%%D" /E /XD node_modules .git __pycache__ /XF *.log >nul
  if errorlevel 8 goto copy_error
 )
)
for %%F in (package.json server.mjs DEMARRER_WINDOWS.bat TESTER_WINDOWS.bat TESTER_L01_WINDOWS.bat INSTALLER_CORRECTIF_WINDOWS.bat PUBLIER_GITHUB_WINDOWS.bat .gitignore README.md CORRECTIF_V1_6_1.md) do if exist "%%F" copy /Y "%%F" "%TARGET%\%%F" >nul
for %%F in (RELEASE_*.md) do copy /Y "%%F" "%TARGET%\%%F" >nul
if not exist "%TARGET%\data" mkdir "%TARGET%\data"
for %%F in (catalog.json state.example.json) do if exist "data\%%F" copy /Y "data\%%F" "%TARGET%\data\%%F" >nul
if exist "%TARGET%\data\state.json" (echo ERREUR: donnees de production dans le depot!&pause&exit /b 1)
cd /d "%TARGET%"
git add --all
if errorlevel 1 goto error
for /f "delims=" %%S in ('git diff --cached --name-only') do (
 echo %%S | findstr /I /R "state.json backups .env" >nul
 if not errorlevel 1 (echo ERREUR : fichier sensible detecte : %%S& pause&exit /b 1)
)
git --no-pager diff --cached --stat
git diff --cached --quiet
if not errorlevel 1 (echo Aucun changement a publier.&pause&exit /b 0)
set /p "CONFIRM=Publier sur %BRANCH% (jamais main) ? (O/N) : "
if /I not "%CONFIRM%"=="O" (echo Annule.&pause&exit /b 0)
git commit -m "feat(l01): six-column documents, details and headset sourcing"
if errorlevel 1 goto error
git push -u origin "%BRANCH%"
if errorlevel 1 goto error
echo Publie sur https://github.com/Bapeuh/Forcast_Bkl/tree/%BRANCH%
echo Creer ou mettre a jour une PR vers main apres les tests GitHub Actions.
pause
exit /b 0
:copy_error
echo ECHEC copie des sources.
:error
pause
exit /b 1
