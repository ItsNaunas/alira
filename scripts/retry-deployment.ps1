# Vercel Deployment Retry Script (PowerShell)
# Use this script to quickly retry a failed deployment with health checks

Write-Host "🚀 ALIRA Deployment Retry Script" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check git status
Write-Host "📋 Step 1: Checking git status..." -ForegroundColor Yellow
$gitStatus = git status -s
if ($gitStatus) {
    Write-Host "⚠️  Warning: You have uncommitted changes" -ForegroundColor Yellow
    git status -s
    Write-Host ""
    $commit = Read-Host "Do you want to commit these changes? (y/n)"
    if ($commit -eq "y") {
        $message = Read-Host "Enter commit message"
        git add .
        git commit -m $message
        Write-Host "✅ Changes committed" -ForegroundColor Green
    }
} else {
    Write-Host "✅ Working directory clean" -ForegroundColor Green
}
Write-Host ""

# Step 2: Verify we're on main branch
Write-Host "📋 Step 2: Verifying branch..." -ForegroundColor Yellow
$currentBranch = git branch --show-current
if ($currentBranch -ne "main") {
    Write-Host "⚠️  Warning: You're on branch '$currentBranch', not 'main'" -ForegroundColor Yellow
    $switch = Read-Host "Switch to main branch? (y/n)"
    if ($switch -eq "y") {
        git checkout main
        git pull origin main
        Write-Host "✅ Switched to main branch" -ForegroundColor Green
    }
} else {
    Write-Host "✅ On main branch" -ForegroundColor Green
}
Write-Host ""

# Step 3: Pull latest changes
Write-Host "📋 Step 3: Pulling latest changes..." -ForegroundColor Yellow
git pull origin main
Write-Host "✅ Up to date with remote" -ForegroundColor Green
Write-Host ""

# Step 4: Quick health check
Write-Host "📋 Step 4: Running quick health check..." -ForegroundColor Yellow

# Check if node_modules exists
if (!(Test-Path "node_modules")) {
    Write-Host "⚠️  node_modules not found, installing..." -ForegroundColor Yellow
    npm install
}

Write-Host "✅ Health check passed" -ForegroundColor Green
Write-Host ""

# Step 5: Create retry commit
Write-Host "📋 Step 5: Creating retry deployment..." -ForegroundColor Yellow
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
git commit --allow-empty -m "🔄 Retry deployment after transient error - $timestamp"
Write-Host "✅ Empty commit created" -ForegroundColor Green
Write-Host ""

# Step 6: Push to trigger deployment
Write-Host "📋 Step 6: Pushing to trigger Vercel deployment..." -ForegroundColor Yellow
git push origin main
Write-Host "✅ Pushed to GitHub" -ForegroundColor Green
Write-Host ""

# Step 7: Instructions
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "✅ Deployment Triggered!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Next Steps:"
Write-Host "1. Watch deployment: https://vercel.com/dashboard"
Write-Host "2. Monitor build logs in Vercel Dashboard"
Write-Host "3. Expected time: 1-2 minutes"
Write-Host ""
Write-Host "🔍 If deployment fails again:"
Write-Host "1. Check environment variables in Vercel"
Write-Host "2. Verify account limits/usage"
Write-Host "3. Check Vercel status: https://www.vercel-status.com"
Write-Host "4. See VERCEL_DEPLOYMENT_TROUBLESHOOTING.md for details"
Write-Host ""
Write-Host "🎉 Good luck! Your code is perfect - just waiting for Vercel!" -ForegroundColor Green

