# 🗄️ Database Setup - Step by Step Guide

## 🎯 Goal
Set up a clean, empty Supabase database that's ready for your student data.

## 📋 Prerequisites
- Supabase account (free tier is fine)
- Your 5 Google Sheets URLs ready

## 🚀 Step 1: Create Supabase Project

### 1.1 Go to Supabase
- Visit: https://supabase.com
- Click "Start your project" or "Sign In"

### 1.2 Create New Project
- Click "New Project"
- Choose your organization
- Enter project details:
  - **Name**: `student-search-app`
  - **Database Password**: Create a strong password (save it!)
  - **Region**: Choose closest to you
- Click "Create new project"

### 1.3 Wait for Setup
- This takes 2-5 minutes
- You'll see "Database is ready" when done

## 🔑 Step 2: Get Your Credentials

### 2.1 Go to Settings
- In your project dashboard, click "Settings" (gear icon)
- Click "API" in the left sidebar

### 2.2 Copy Credentials
You'll see:
- **Project URL**: `https://your-project-id.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

**Save these!** You'll need them for the app.

## 🗃️ Step 3: Create Database Tables

### 3.1 Go to SQL Editor
- In your project dashboard, click "SQL Editor" in the left sidebar
- Click "New query"

### 3.2 Run the Setup SQL
- Copy the entire content of `setup-sql.sql`
- Paste it into the SQL editor
- Click "Run" button

**Expected Result:**
- All tables created successfully
- No errors (or only warnings about existing tables)

### 3.3 Verify Tables
- Go to "Table Editor" in the left sidebar
- You should see these tables:
  - `students`
  - `student_performance`
  - `subscriptions`
  - `student_contacts`
  - `student_reviews`
  - `grade_specific_data`

## 🔐 Step 4: Set Up Authentication Tables

### 4.1 Run Authentication SQL
- Go back to SQL Editor
- Create new query
- Copy the entire content of `auth-system-setup.sql`
- Paste and run

**Expected Result:**
- Authentication tables created
- Functions created for user management
- Default admin user created

### 4.2 Verify Authentication Setup
- Go to "Table Editor"
- You should now also see:
  - `users`
  - `student_users`
  - `parent_users`
  - `password_reset_tokens`
  - `login_attempts`

## 📱 Step 5: Update App with Your Credentials

### 5.1 Update Flutter App
- Open `flutter_app/lib/main.dart`
- Find this section:
```dart
await Supabase.initialize(
  url: 'YOUR_SUPABASE_URL_HERE',
  anonKey: 'YOUR_SUPABASE_ANON_KEY_HERE',
);
```

- Replace with your actual credentials:
```dart
await Supabase.initialize(
  url: 'https://your-project-id.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
);
```

### 5.2 Test the App
- Build and install the updated APK
- Open the app
- You should see:
  - Home screen loads
  - No errors about database connection
  - Empty lists (this is expected!)

## 📊 Step 6: Test Empty System

### 6.1 What You Should See
- ✅ App opens without errors
- ✅ Home screen shows "0 students"
- ✅ Search works (returns no results)
- ✅ Analytics shows empty charts
- ✅ No database connection errors

### 6.2 If You See Errors
- Check your Supabase credentials
- Verify tables were created
- Check the logs for specific error messages

## 🎉 Success!
Your database is now set up and ready for data import!

## 📋 Next Steps
1. **Test the empty app** (verify everything works)
2. **Import Google Sheets data** (we'll do this next)
3. **Test with real data** (see the full system in action)

## ❓ Need Help?

**Common Issues:**
- **"Connection failed"** → Check your Supabase URL and key
- **"Table not found"** → Make sure you ran the SQL scripts
- **"Permission denied"** → Check your Supabase project settings

**Get Help:**
- Share any error messages you see
- Tell me what step you're stuck on
- I'll guide you through it!

---

**Ready for the next step?** Let me know when your database is set up and the app is working with empty data!
