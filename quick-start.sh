#!/bin/bash

# Quick Start Script for Student Search App
# This script helps you get started quickly

echo "🚀 Student Search App - Quick Start"
echo "==================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the root directory (student-search-app)"
    exit 1
fi

echo "📱 1. APK File Location"
echo "Your APK is ready at: flutter_app/build/app/outputs/flutter-apk/app-release.apk"
echo ""

echo "🗄️ 2. Database Setup Required"
echo "You need to set up Supabase database first:"
echo "   - Follow DATABASE_SETUP_STEP_BY_STEP.md"
echo "   - Or run: npm run setup-db"
echo ""

echo "🔧 3. Current Status Check"
echo "Let's verify what's working..."

# Check if Flutter app exists
if [ -d "flutter_app" ]; then
    echo "✅ Flutter app directory found"
    
    # Check if APK exists
    if [ -f "flutter_app/build/app/outputs/flutter-apk/app-release.apk" ]; then
        echo "✅ APK file exists (47MB)"
    else
        echo "⚠️  APK not found - need to build Flutter app"
    fi
else
    echo "❌ Flutter app directory not found"
fi

# Check if database setup files exist
if [ -f "setup-sql.sql" ]; then
    echo "✅ Database setup SQL ready"
else
    echo "❌ Database setup SQL not found"
fi

if [ -f "auth-system-setup.sql" ]; then
    echo "✅ Authentication setup SQL ready"
else
    echo "❌ Authentication setup SQL not found"
fi

echo ""

echo "📋 4. Next Steps (Choose One):"
echo ""
echo "Option A: Set up database first (Recommended)"
echo "   • Follow DATABASE_SETUP_STEP_BY_STEP.md"
echo "   • Test with empty database"
echo "   • Then import Google Sheets data"
echo ""

echo "Option B: Test app with empty database"
echo "   • Install APK on your phone"
echo "   • See how it behaves with no data"
echo "   • Identify what needs fixing"
echo ""

echo "Option C: Import Google Sheets data directly"
echo "   • Set up database"
echo "   • Import your 5 Google Sheets"
echo "   • Test with real data immediately"
echo ""

echo "🎯 5. My Recommendation:"
echo "Start with Option A (database setup) because:"
echo "   • You'll see exactly what's working"
echo "   • Easy to identify and fix issues"
echo "   • Clean foundation for your data"
echo ""

echo "❓ Need Help?"
echo "• Database setup: See DATABASE_SETUP_STEP_BY_STEP.md"
echo "• General guide: See GETTING_STARTED_GUIDE.md"
echo "• Test connection: Run node test-database-connection.js"
echo ""

echo "🚀 Ready to get started?"
echo "Tell me which option you'd like to try first!"
