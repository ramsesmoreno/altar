#!/bin/bash

# Pre-Deployment Environment Check
# Verifies that all required tools and configurations are in place

set -e

echo "🔧 Pre-Deployment Environment Check"
echo "===================================="
echo ""

ERRORS=0
WARNINGS=0

# Check Node.js
echo "Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js installed: $NODE_VERSION"
    
    # Check if version is 18 or higher
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
    if [ "$NODE_MAJOR" -lt 18 ]; then
        echo "⚠️  Warning: Node.js 18+ recommended (current: $NODE_VERSION)"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo "❌ Node.js not found. Please install Node.js 18+"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Check npm
echo "Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "✅ npm installed: $NPM_VERSION"
else
    echo "❌ npm not found"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Check Git
echo "Checking Git..."
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version)
    echo "✅ Git installed: $GIT_VERSION"
    
    # Check if in a git repository
    if git rev-parse --git-dir > /dev/null 2>&1; then
        echo "✅ Git repository initialized"
        
        # Check for remote
        if git remote -v | grep -q origin; then
            REMOTE_URL=$(git remote get-url origin)
            echo "✅ Git remote configured: $REMOTE_URL"
        else
            echo "⚠️  Warning: No git remote configured"
            echo "   Run: git remote add origin <repository-url>"
            WARNINGS=$((WARNINGS + 1))
        fi
    else
        echo "⚠️  Warning: Not a git repository"
        echo "   Run: git init"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo "❌ Git not found. Please install Git"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Check AWS CLI
echo "Checking AWS CLI..."
if command -v aws &> /dev/null; then
    AWS_VERSION=$(aws --version)
    echo "✅ AWS CLI installed: $AWS_VERSION"
    
    # Check if AWS is configured
    if aws sts get-caller-identity &> /dev/null; then
        AWS_ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
        AWS_USER=$(aws sts get-caller-identity --query Arn --output text)
        echo "✅ AWS CLI configured"
        echo "   Account: $AWS_ACCOUNT"
        echo "   User: $AWS_USER"
    else
        echo "⚠️  Warning: AWS CLI not configured"
        echo "   Run: aws configure"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo "⚠️  Warning: AWS CLI not found"
    echo "   Install: https://aws.amazon.com/cli/"
    echo "   (Optional for Amplify Console deployment)"
    WARNINGS=$((WARNINGS + 1))
fi
echo ""

# Check dependencies installed
echo "Checking project dependencies..."
if [ -d "node_modules" ]; then
    echo "✅ node_modules exists"
else
    echo "⚠️  Warning: node_modules not found"
    echo "   Run: npm install"
    WARNINGS=$((WARNINGS + 1))
fi
echo ""

# Check if build has been run
echo "Checking production build..."
if [ -d "dist" ]; then
    echo "✅ Production build exists (dist folder)"
else
    echo "⚠️  Warning: Production build not found"
    echo "   Run: npm run build"
    WARNINGS=$((WARNINGS + 1))
fi
echo ""

# Check required files
echo "Checking required files..."
REQUIRED_FILES=(
    "package.json"
    "amplify.yml"
    "amplify/backend.ts"
    "amplify/functions/upload-photo/handler.ts"
    "amplify/functions/generate-altar/handler.ts"
    "src/main.ts"
    "index.html"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file not found"
        ERRORS=$((ERRORS + 1))
    fi
done
echo ""

# Summary
echo "===================================="
echo "Summary"
echo "===================================="
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo "✨ All checks passed! Ready for deployment."
    echo ""
    echo "📋 Deployment Options:"
    echo ""
    echo "Option 1: Deploy via Amplify Console (Recommended)"
    echo "  1. Push code to Git: git push origin main"
    echo "  2. Go to: https://console.aws.amazon.com/amplify/"
    echo "  3. Connect your repository and deploy"
    echo ""
    echo "Option 2: Deploy via Amplify CLI"
    echo "  1. Run: npx ampx sandbox (for testing)"
    echo "  2. Or follow DEPLOYMENT.md for production"
    echo ""
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo "⚠️  $WARNINGS warning(s) found. Review above and fix if needed."
    echo ""
    echo "You can proceed with deployment, but some features may not work."
    echo ""
    exit 0
else
    echo "❌ $ERRORS error(s) and $WARNINGS warning(s) found."
    echo ""
    echo "Please fix the errors above before deploying."
    echo ""
    exit 1
fi
