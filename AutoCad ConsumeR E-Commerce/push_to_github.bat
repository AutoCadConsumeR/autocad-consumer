@echo off
title AutoCad ConsumeR - GitHub Push Helper
color 0b
echo ===================================================
echo     AutoCad ConsumeR - Git Push to GitHub
echo ===================================================
echo.
echo Step 1: Make sure you created a repository on GitHub:
echo         https://github.com/new
echo.
set /p REPO_URL="Enter your GitHub Repository URL (e.g. https://github.com/username/repo.git): "

if "%REPO_URL%"=="" (
    echo [ERROR] No URL entered. Exiting.
    pause
    exit /b
)

echo.
echo Setting remote origin to: %REPO_URL%
git remote remove origin 2>nul
git remote add origin %REPO_URL%
git branch -M main

echo.
echo Pushing code to GitHub main branch...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ===================================================
    echo [SUCCESS] Code successfully pushed to GitHub!
    echo ===================================================
) else (
    echo.
    echo [NOTE] If you saw an authentication prompt, please sign in with your browser.
)
echo.
pause
