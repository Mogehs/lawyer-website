@echo off
echo ================================================
echo   Lawyer Website - AWS Lambda Deployment
echo ================================================
echo.

echo Checking prerequisites...
echo.

REM Check AWS CLI
aws --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] AWS CLI is not installed!
    echo Please install from: https://awscli.amazonaws.com/AWSCLIV2.msi
    pause
    exit /b 1
)
echo [OK] AWS CLI is installed

REM Check Serverless
serverless --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Serverless Framework not found. Installing...
    npm install -g serverless
)
echo [OK] Serverless Framework is installed

echo.
echo ================================================
echo   Installing Dependencies
echo ================================================
echo.

npm install

if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo ================================================
echo   Setup Complete!
echo ================================================
echo.
echo Your backend is ready for deployment!
echo.
echo Next steps:
echo 1. Configure AWS credentials: aws configure
echo 2. Update .env file with production values
echo 3. Run: npm run deploy
echo.
pause

