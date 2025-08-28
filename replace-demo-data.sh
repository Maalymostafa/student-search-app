#!/bin/bash

echo "🔄 Replacing Demo Data with Real Google Sheets Data"
echo "=================================================="
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Please create a .env file with your database credentials:"
    echo "SUPABASE_URL=your_supabase_url"
    echo "SUPABASE_ANON_KEY=your_supabase_anon_key"
    exit 1
fi

echo "📊 Step 1: Setting up multi-sheets database..."
npm run setup-multi-sheets

if [ $? -eq 0 ]; then
    echo "✅ Database setup completed!"
else
    echo "❌ Database setup failed!"
    exit 1
fi

echo ""
echo "📥 Step 2: Importing all tabs data..."
npm run import-all-tabs

if [ $? -eq 0 ]; then
    echo "✅ Data import completed!"
else
    echo "❌ Data import failed!"
    exit 1
fi

echo ""
echo "📋 Step 3: Checking import results..."
if [ -f logs/import-report.json ]; then
    echo "📊 Import Report:"
    cat logs/import-report.json
else
    echo "⚠️  No import report found"
fi

echo ""
echo "🚀 Step 4: Starting server..."
echo "Your application is now ready with real data!"
echo "Run: npm run dev"
echo ""
echo "🎯 Test with your actual student codes from Google Sheets"
echo "Demo mode has been disabled - app will use real database"
