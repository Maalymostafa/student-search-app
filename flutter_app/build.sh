#!/bin/bash

# Exit on any error
set -e

echo "🚀 Starting Flutter web build for production..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
flutter clean

# Get dependencies
echo "📦 Getting dependencies..."
flutter pub get

# Build for web in release mode
echo "🔨 Building Flutter web app..."
flutter build web --release --web-renderer html

echo "✅ Build completed successfully!"
echo "📁 Build output is in: build/web/"
echo "🌐 Ready for deployment to Vercel!"
