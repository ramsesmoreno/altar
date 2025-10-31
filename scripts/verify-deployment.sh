#!/bin/bash

# Deployment Verification Script
# This script performs basic checks to verify the deployment is ready

set -e

echo "🔍 Verifying Altar Deployment..."
echo ""

# Check if dist folder exists
if [ ! -d "dist" ]; then
    echo "❌ Error: dist folder not found. Run 'npm run build' first."
    exit 1
fi
echo "✅ dist folder exists"

# Check if index.html exists
if [ ! -f "dist/index.html" ]; then
    echo "❌ Error: dist/index.html not found."
    exit 1
fi
echo "✅ index.html exists"

# Check if assets folder exists
if [ ! -d "dist/assets" ]; then
    echo "❌ Error: dist/assets folder not found."
    exit 1
fi
echo "✅ assets folder exists"

# Count JavaScript files
js_count=$(find dist/assets -name "*.js" | wc -l)
if [ "$js_count" -lt 1 ]; then
    echo "❌ Error: No JavaScript files found in dist/assets"
    exit 1
fi
echo "✅ Found $js_count JavaScript file(s)"

# Count CSS files
css_count=$(find dist/assets -name "*.css" | wc -l)
if [ "$css_count" -lt 1 ]; then
    echo "❌ Error: No CSS files found in dist/assets"
    exit 1
fi
echo "✅ Found $css_count CSS file(s)"

# Check if amplify.yml exists
if [ ! -f "amplify.yml" ]; then
    echo "⚠️  Warning: amplify.yml not found. Create it for Amplify Console deployment."
else
    echo "✅ amplify.yml exists"
fi

# Check if amplify folder exists
if [ ! -d "amplify" ]; then
    echo "❌ Error: amplify folder not found."
    exit 1
fi
echo "✅ amplify folder exists"

# Check if backend.ts exists
if [ ! -f "amplify/backend.ts" ]; then
    echo "❌ Error: amplify/backend.ts not found."
    exit 1
fi
echo "✅ backend.ts exists"

# Check Lambda functions
if [ ! -f "amplify/functions/upload-photo/handler.ts" ]; then
    echo "❌ Error: upload-photo handler not found."
    exit 1
fi
echo "✅ upload-photo function exists"

if [ ! -f "amplify/functions/generate-altar/handler.ts" ]; then
    echo "❌ Error: generate-altar handler not found."
    exit 1
fi
echo "✅ generate-altar function exists"

# Check if package.json has required scripts
if ! grep -q '"build"' package.json; then
    echo "❌ Error: build script not found in package.json"
    exit 1
fi
echo "✅ build script exists in package.json"

# Check if aws-amplify is installed
if ! grep -q '"aws-amplify"' package.json; then
    echo "❌ Error: aws-amplify not found in package.json"
    exit 1
fi
echo "✅ aws-amplify dependency exists"

echo ""
echo "✨ All basic checks passed!"
echo ""
echo "📋 Next steps:"
echo "1. Ensure AWS CLI is configured: aws configure"
echo "2. Push code to Git repository"
echo "3. Connect repository to AWS Amplify Console"
echo "4. Deploy via Amplify Console or run: npx ampx sandbox"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"
