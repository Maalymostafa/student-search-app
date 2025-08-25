#!/bin/bash

# Exit on any error
set -e

echo "🚀 Student Search App - Vercel Deployment Script"
echo "================================================"

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

# Check Flutter version
echo "📋 Flutter version:"
flutter --version

# Clean and get dependencies
echo "🧹 Cleaning previous builds..."
flutter clean

echo "📦 Getting dependencies..."
flutter pub get

# Build for web
echo "🔨 Building Flutter web app for production..."
flutter build web --release

echo "✅ Build completed successfully!"
echo ""
echo "📁 Build output is in: build/web/"
echo ""
echo "🌐 Next steps to deploy to Vercel:"
echo "1. Push your code to GitHub:"
echo "   git add ."
echo "   git commit -m 'Ready for deployment'"
echo "   git push"
echo ""
echo "2. Deploy to Vercel:"
echo "   - Go to https://vercel.com"
echo "   - Import your GitHub repository"
echo "   - Set Build Command: flutter build web --release"
echo "   - Set Output Directory: build/web"
echo "   - Click Deploy"
echo ""
echo "3. Or use Vercel CLI:"
echo "   npm i -g vercel"
echo "   vercel login"
echo "   vercel"
echo ""
echo "📖 For detailed instructions, see: DEPLOYMENT.md"
