@echo off
setlocal EnableExtensions
cd /d "%~dp0"
echo =========================================================
echo   BACKLIGHT FORECAST V1.2 - PUBLICATION GITHUB
 echo  Depot : Bapeuh/Forcast_Bkl
 echo  Branche : main
 echo =========================================================
where git >nul 2>nul
if errorlevel 1 (
 echo ERREUR : Git pour Windows est necessaire.
 echo https://git-scm.com/download/win
 pause
 exit /b 1
)
where node >nul 2>nul
if errorlevel 1 (
 echo ERREUR : Node.js 20+ est necessaire pour lancer les tests.
 echo https://nodejs.org/
 pause
 exit /b 1
)
echo.
echo [1/5] Execution des tests...
call npm test
if errorlevel 1 (
 echo ERREUR : tests en echec. Publication interrompue.
 pause
 exit /b 1
)
set "TARGET=%TEMP%\Forcast_Bkl_publish_%RANDOM%_%RANDOM%"
echo.
echo [2/5] Clonage du depot dans %TARGET%
git clone --branch main --single-branch https://github.com/Bapeuh/Forcast_Bkl.git "%TARGET%"
if errorlevel 1 (
 echo ERREUR : impossible de cloner. Verifier connexion/permissions.
 pause
 exit /b 1
)
echo.
echo [3/5] Copie des fichiers de l'application (sans les donnees privees)...
for %%D in (core public scripts tests docs) do (
 if exist "%~dp0%%D" (
  robocopy "%~dp0%%D" "%TARGET%\%%D" /E /XF *.log /XD node_modules >nul
  if errorlevel 8 goto :copyerror
 )
)
for %%F in (package.json server.mjs DEMARRER_WINDOWS.bat TESTER_WINDOWS.bat INSTALLER_CORRECTIF_WINDOWS.bat .gitignore README.md PUBLIER_GITHUB_WINDOWS.bat) do (
 if exist "%~dp0%%F" copy /Y "%~dp0%%F" "%TARGET%\%%F" >nul
)
if not exist "%TARGET%\data" mkdir "%TARGET%\data"
for %%F in (catalog.json state.example.json) do (
 if exist "%~dp0data\%%F" copy /Y "%~dp0data\%%F" "%TARGET%\data\%%F" >nul
)
if exist "%TARGET%\data\state.json" (
 echo ATTENTION : data/state.json est dans le depot local. Publication interrompue.
 pause
 exit /b 1
)
cd /d "%TARGET%"
git add --all
for /f "delims=" %%I in ('git diff --cached --name-only') do echo     %%I
git diff --cached --quiet
if not errorlevel 1 (
 echo Rien a publier : le depot semble deja a jour.
 pause
 exit /b 0
)
echo.
echo [4/5] Creation du commit...
git commit -m "release: Forecast Backlight V1.2 alpha validated"
if errorlevel 1 (
 echo ERREUR : impossible de creer le commit.
 echo Configurer git user.name et git user.email si necessaire.
 pause
 exit /b 1
)
echo.
echo [5/5] Publication sur main...
git push origin main
if errorlevel 1 (
 echo ERREUR : push refuse. Le depot local de travail reste dans : %TARGET%
 echo Verifier la connexion, l'authentification ou les changements distants.
 pause
 exit /b 1
)
echo.
echo SUCCES : https://github.com/Bapeuh/Forcast_Bkl
 echo Commit :
git log -1 --oneline
pause
exit /b 0
:copyerror
echo ERREUR de copie des fichiers.
pause
exit /b 1
