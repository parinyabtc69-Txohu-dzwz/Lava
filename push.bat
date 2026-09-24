@echo off
chcp 65001 > nul
echo =======================================================
echo Auto-Push to GitHub (LavaOs)
echo =======================================================
echo.

echo [1/3] Adding files...
git add .
echo.

echo [2/3] Committing changes...
set "commitMessage=Auto deploy: %date% %time%"
git commit -m "%commitMessage%"
echo.

echo [3/3] Pushing to GitHub...
git push -u origin main
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Git push failed!
    pause
    exit /b %errorlevel%
)
echo.

echo =======================================================
echo SUCCESS: Code has been pushed to GitHub!
echo Vercel will automatically deploy it shortly.
echo =======================================================
pause