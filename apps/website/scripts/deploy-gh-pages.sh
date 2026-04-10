#!/bin/bash

set -e

REPO_URL="https://github.com/wanxger/agent-admin.git"
TEMP_DIR="/tmp/gh-pages-deploy"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BUILD_DIR="$SCRIPT_DIR/../build"

echo "🚀 Deploying website to gh-pages..."

# Build the website
echo "📦 Building website..."
cd "$SCRIPT_DIR/.."
npm run build

# Create and clean temp directory
echo "🧹 Preparing deployment directory..."
rm -rf "$TEMP_DIR"
mkdir -p "$TEMP_DIR"

# Initialize git repo
cd "$TEMP_DIR"
git init
git checkout -b gh-pages

# Copy build files
echo "📋 Copying build files..."
cp -r "$BUILD_DIR"/* .

# Commit
echo "💾 Committing files..."
git add .
git commit -m "Deploy website to gh-pages"

# Push to gh-pages
echo "📤 Pushing to gh-pages branch..."
git remote add origin "$REPO_URL"
git push origin gh-pages --force

# Cleanup
echo "🧹 Cleaning up..."
rm -rf "$TEMP_DIR"

echo "✅ Deployment complete!"
echo "🌐 Website deployed at: https://wanxger.github.io/agent-admin/"
