#!/bin/bash

# Exit on any error
set -e

echo "🚀 Student Search App - Vercel Deployment"
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "pubspec.yaml" ]; then
    echo "❌ Error: pubspec.yaml not found. Please run this script from the flutter_app directory."
    exit 1
fi

# Check if Flutter is installed
if ! command -v flutter &> /dev/null; then
    echo "❌ Error: Flutter is not installed or not in PATH"
    echo "Please install Flutter from: https://flutter.dev/docs/get-started/install"
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Clean and get dependencies
echo "🧹 Cleaning previous builds..."
flutter clean

echo "📦 Getting dependencies..."
flutter pub get

# Build for web
echo "🔨 Building Flutter web app for production..."
flutter build web --release

echo "✅ Build completed successfully!"
echo "📁 Build output is in: build/web/"
echo ""

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
echo "Note: This will open a browser window for authentication if needed."
echo ""

# Deploy using Vercel CLI
vercel --prod

echo ""
echo "🎉 Deployment completed!"
echo "Your app should now be live at the URL provided above."
echo ""
echo "📖 For future deployments, just run: vercel --prod"
