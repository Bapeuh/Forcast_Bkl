@echo off
setlocal EnableExtensions
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (echo Node.js 20+ requis.&pause&exit /b 1)
echo.
echo FORECAST BACKLIGHT -- L01.1 a L01.10
 echo 0 - Suite complete L00 + L01
 echo 1 - Modele documentaire et migration
 echo 2 - Grille 6 colonnes
 echo 3 - Tableaux
 echo 4 - Sous-lignes commerciales
 echo 5 - Pagination A4
 echo 6 - Impression PDF
 echo 7 - Export Excel et modeles
 echo 8 - Bibliotheque de modeles
 echo 9 - Recette Renault et integration documentaire
 echo 10 - Casques, compatibilite et synchronisation devis
 echo.
set /p "LOT=Numero de sous-lot a tester (0-10): "
if "%LOT%"=="0" (
 call npm test
) else (
 node --test --test-name-pattern="L01.%LOT% " tests/l01-document-builder.test.mjs
)
if errorlevel 1 (echo ECHEC : ne pas publier cette version.) else (echo Tests automatiques reussis. Continuer avec le protocole manuel dans docs\L01_PLAN_DE_RECETTE.md)
pause
