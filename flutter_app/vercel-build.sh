#!/bin/bash

# Exit on any error
set -e

echo "🚀 Starting Flutter web build for Vercel..."

# Check if we're in Vercel environment
if [ -n "$VERCEL" ]; then
    echo "📦 Vercel environment detected, installing Flutter..."
    
    # Install Flutter using the official installation method
    FLUTTER_VERSION="3.35.1"
    FLUTTER_HOME="/opt/flutter"
    
    # Create Flutter directory
    mkdir -p $FLUTTER_HOME
    
    # Download and extract Flutter
    cd /tmp
    curl -L https://storage.googleapis.com/flutter_infra_release/releases/stable/linux/flutter_linux_$FLUTTER_VERSION-stable.tar.xz -o flutter.tar.xz
    tar xf flutter.tar.xz -C /opt/
    
    # Add Flutter to PATH
    export PATH="$FLUTTER_HOME/bin:$PATH"
    
    echo "✅ Flutter installed successfully"
    
    # Navigate back to project directory
    cd /var/task/user_code
else
    echo "🔧 Local environment detected, using existing Flutter installation"
fi

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
