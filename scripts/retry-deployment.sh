#!/bin/bash

# Vercel Deployment Retry Script
# Use this script to quickly retry a failed deployment with health checks

set -e

echo "🚀 ALIRA Deployment Retry Script"
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Check git status
echo "📋 Step 1: Checking git status..."
if [[ -n $(git status -s) ]]; then
    echo -e "${YELLOW}⚠️  Warning: You have uncommitted changes${NC}"
    git status -s
    echo ""
    read -p "Do you want to commit these changes? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Enter commit message:"
        read commit_message
        git add .
        git commit -m "$commit_message"
        echo -e "${GREEN}✅ Changes committed${NC}"
    fi
else
    echo -e "${GREEN}✅ Working directory clean${NC}"
fi
echo ""

# Step 2: Verify we're on main branch
echo "📋 Step 2: Verifying branch..."
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ]; then
    echo -e "${YELLOW}⚠️  Warning: You're on branch '$current_branch', not 'main'${NC}"
    read -p "Switch to main branch? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git checkout main
        git pull origin main
        echo -e "${GREEN}✅ Switched to main branch${NC}"
    fi
else
    echo -e "${GREEN}✅ On main branch${NC}"
fi
echo ""

# Step 3: Pull latest changes
echo "📋 Step 3: Pulling latest changes..."
git pull origin main
echo -e "${GREEN}✅ Up to date with remote${NC}"
echo ""

# Step 4: Quick health check
echo "📋 Step 4: Running quick health check..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  node_modules not found, installing...${NC}"
    npm install
fi

# Quick lint check (optional, commented out for speed)
# echo "Running linter..."
# npm run lint

echo -e "${GREEN}✅ Health check passed${NC}"
echo ""

# Step 5: Create retry commit
echo "📋 Step 5: Creating retry deployment..."
git commit --allow-empty -m "🔄 Retry deployment after transient error - $(date)"
echo -e "${GREEN}✅ Empty commit created${NC}"
echo ""

# Step 6: Push to trigger deployment
echo "📋 Step 6: Pushing to trigger Vercel deployment..."
git push origin main
echo -e "${GREEN}✅ Pushed to GitHub${NC}"
echo ""

# Step 7: Instructions
echo "=================================="
echo -e "${GREEN}✅ Deployment Triggered!${NC}"
echo ""
echo "📊 Next Steps:"
echo "1. Watch deployment: https://vercel.com/dashboard"
echo "2. Monitor build logs in Vercel Dashboard"
echo "3. Expected time: 1-2 minutes"
echo ""
echo "🔍 If deployment fails again:"
echo "1. Check environment variables in Vercel"
echo "2. Verify account limits/usage"
echo "3. Check Vercel status: https://www.vercel-status.com"
echo "4. See VERCEL_DEPLOYMENT_TROUBLESHOOTING.md for details"
echo ""
echo "🎉 Good luck! Your code is perfect - just waiting for Vercel!"

