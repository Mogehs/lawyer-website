# AWS Lambda Deployment Setup Script
# This script helps you set up AWS credentials and deploy your backend

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Lawyer Website - AWS Lambda Deployment" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if AWS CLI is installed
Write-Host "Checking AWS CLI..." -ForegroundColor Yellow
try {
    $awsVersion = aws --version 2>&1
    Write-Host "✓ AWS CLI is installed: $awsVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ AWS CLI is not installed!" -ForegroundColor Red
    Write-Host "Please install AWS CLI from: https://awscli.amazonaws.com/AWSCLIV2.msi" -ForegroundColor Yellow
    exit 1
}

# Check if Serverless is installed
Write-Host "Checking Serverless Framework..." -ForegroundColor Yellow
try {
    $slsVersion = serverless --version 2>&1
    Write-Host "✓ Serverless Framework is installed" -ForegroundColor Green
} catch {
    Write-Host "✗ Serverless Framework is not installed!" -ForegroundColor Red
    Write-Host "Installing Serverless Framework globally..." -ForegroundColor Yellow
    npm install -g serverless
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  AWS Credentials Setup" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Do you want to configure AWS credentials now? (Y/N)" -ForegroundColor Yellow
$configAWS = Read-Host

if ($configAWS -eq "Y" -or $configAWS -eq "y") {
    Write-Host ""
    Write-Host "Please enter your AWS credentials:" -ForegroundColor Cyan
    Write-Host ""

    aws configure

    Write-Host ""
    Write-Host "Testing AWS credentials..." -ForegroundColor Yellow
    try {
        $identity = aws sts get-caller-identity 2>&1 | ConvertFrom-Json
        Write-Host "✓ AWS credentials are valid!" -ForegroundColor Green
        Write-Host "  Account: $($identity.Account)" -ForegroundColor Gray
        Write-Host "  User: $($identity.Arn)" -ForegroundColor Gray
    } catch {
        Write-Host "✗ AWS credentials test failed!" -ForegroundColor Red
        Write-Host "Please check your credentials and try again." -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "Skipping AWS credentials configuration..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Environment Variables Check" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

if (Test-Path ".env") {
    Write-Host "✓ .env file found" -ForegroundColor Green

    # Check for required variables
    $envContent = Get-Content ".env" -Raw
    $requiredVars = @("DATABASE_URL", "JWT_SECRET", "CLOUDINARY_CLOUD_NAME")

    $missingVars = @()
    foreach ($var in $requiredVars) {
        if ($envContent -notmatch $var) {
            $missingVars += $var
        }
    }

    if ($missingVars.Count -gt 0) {
        Write-Host "⚠ Warning: Missing required environment variables:" -ForegroundColor Yellow
        foreach ($var in $missingVars) {
            Write-Host "  - $var" -ForegroundColor Red
        }
        Write-Host ""
        Write-Host "Please update your .env file before deploying." -ForegroundColor Yellow
    } else {
        Write-Host "✓ All required environment variables are set" -ForegroundColor Green
    }
} else {
    Write-Host "✗ .env file not found!" -ForegroundColor Red
    Write-Host "Please create a .env file based on .env.example" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Install Dependencies" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Installing npm dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Ready to Deploy!" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Your backend is ready for deployment!" -ForegroundColor Green
Write-Host ""
Write-Host "Deployment Commands:" -ForegroundColor Cyan
Write-Host "  npm run deploy          # Deploy to dev stage" -ForegroundColor White
Write-Host "  npm run deploy:dev      # Deploy to dev stage" -ForegroundColor White
Write-Host "  npm run deploy:prod     # Deploy to production" -ForegroundColor White
Write-Host ""
Write-Host "Other Commands:" -ForegroundColor Cyan
Write-Host "  npm run offline         # Test locally" -ForegroundColor White
Write-Host "  npm run logs            # View logs" -ForegroundColor White
Write-Host "  npm run remove          # Remove deployment" -ForegroundColor White
Write-Host ""

Write-Host "Do you want to deploy now? (Y/N)" -ForegroundColor Yellow
$deploy = Read-Host

if ($deploy -eq "Y" -or $deploy -eq "y") {
    Write-Host ""
    Write-Host "Deploying to AWS Lambda..." -ForegroundColor Cyan
    Write-Host ""

    npm run deploy

    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "================================================" -ForegroundColor Green
        Write-Host "  Deployment Successful! 🚀" -ForegroundColor Green
        Write-Host "================================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next Steps:" -ForegroundColor Cyan
        Write-Host "1. Copy the API endpoint from the output above" -ForegroundColor White
        Write-Host "2. Update frontend/.env with: VITE_BACKEND_URL=<your-api-endpoint>" -ForegroundColor White
        Write-Host "3. Test your API endpoints" -ForegroundColor White
        Write-Host ""
    } else {
        Write-Host ""
        Write-Host "✗ Deployment failed!" -ForegroundColor Red
        Write-Host "Please check the error messages above." -ForegroundColor Yellow
    }
} else {
    Write-Host ""
    Write-Host "Setup complete! Run 'npm run deploy' when ready to deploy." -ForegroundColor Green
}

Write-Host ""

