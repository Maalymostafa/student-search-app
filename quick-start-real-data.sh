#!/bin/bash

# Quick Start Script for Real Data Implementation
# Student Search App - Real Data Setup

echo "🚀 Quick Start - Real Data Implementation"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating template..."
    cat > .env << EOF
# Database Configuration
DB_TYPE=supabase
SUPABASE_URL=your_supabase_project_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Server Configuration
PORT=3000
NODE_ENV=development
EOF
    echo "📝 Created .env template. Please update with your Supabase credentials."
    echo "   Get your credentials from: https://supabase.com/dashboard"
    echo ""
    echo "After updating .env, run this script again."
    exit 1
fi

echo "✅ .env file found"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Setup real data database
echo "🗄️  Setting up real data database..."
npm run setup-real-data

if [ $? -ne 0 ]; then
    echo "❌ Database setup failed. Please check your Supabase credentials."
    exit 1
fi

echo "✅ Database setup completed"
echo ""

# Import sample data
echo "📥 Importing sample data..."
npm run import-sheets

if [ $? -ne 0 ]; then
    echo "⚠️  Sample data import had issues, but continuing..."
fi

echo "✅ Sample data imported"
echo ""

# Create logs directory
mkdir -p logs

# Start the server
echo "🚀 Starting real data server..."
echo ""
echo "📊 Your application will be available at:"
echo "   🌐 Main App: http://localhost:3000"
echo "   📈 Analytics: http://localhost:3000/api/analytics"
echo "   👥 Students API: http://localhost:3000/api/students"
echo "   🔍 Health Check: http://localhost:3000/api/health"
echo ""
echo "🔍 Test Search Examples:"
echo "   curl -X POST http://localhost:3000/api/search -H 'Content-Type: application/json' -d '{\"code\": \"G4001\"}'"
echo "   curl -X POST http://localhost:3000/api/search -H 'Content-Type: application/json' -d '{\"code\": \"G5001\"}'"
echo ""
echo "📋 Available Commands:"
echo "   npm run dev-real          # Start development server"
echo "   npm run import-sheets     # Import Google Sheets data"
echo "   npm run test-db           # Test database connection"
echo "   npm run logs              # View application logs"
echo ""
echo "🎉 Setup completed! Starting server..."
echo ""

# Start the development server
npm run dev-real


