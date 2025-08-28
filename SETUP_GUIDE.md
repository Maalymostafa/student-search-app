# 🔧 Database Setup Guide - Fix the Issues

## ❌ Problem
The database setup is failing because Supabase doesn't have the `exec_sql` function by default.

## ✅ Solution
You need to create the tables manually in your Supabase dashboard first.

## 🚀 Step-by-Step Setup

### **Step 1: Create Tables in Supabase Dashboard**

1. **Go to your Supabase Dashboard:**
   ```
   https://supabase.com/dashboard/project/[YOUR_PROJECT_ID]/sql
   ```

2. **Copy and paste the SQL from `setup-sql.sql`:**
   - Open the `setup-sql.sql` file in this project
   - Copy all the SQL code
   - Paste it into the Supabase SQL Editor
   - Click "Run" to execute

3. **Verify tables are created:**
   - Go to "Table Editor" in your Supabase dashboard
   - You should see these tables:
     - `students`
     - `student_performance`
     - `subscriptions`
     - `student_contacts`
     - `student_reviews`
     - `grade_specific_data`

### **Step 2: Run the Setup Script**

```bash
# Now run the setup script (it will check if tables exist)
npm run setup-multi-sheets
```

### **Step 3: Import Your Data**

```bash
# Import data from all your Google Sheets
npm run import-all-tabs
```

### **Step 4: Start the Application**

```bash
# Start the enhanced server
npm run dev-real
```

## 📊 What the SQL Creates

### **Tables:**
1. **`students`** - Main student registration data
2. **`student_performance`** - Performance tracking from your sheets
3. **`subscriptions`** - Payment and subscription management
4. **`student_contacts`** - Contact information from your sheets
5. **`student_reviews`** - Review/revision data from your sheets
6. **`grade_specific_data`** - Grade-specific information

### **Indexes:**
- Fast search by student code
- Fast search by grade level
- Fast performance queries
- Fast contact queries

### **Views:**
- **`student_summary`** - Overview of all student data
- **`performance_summary`** - Performance analytics
- **`financial_summary`** - Payment analytics

## 🎯 Expected Results

After running the SQL in Supabase dashboard:

```
✅ Students table created
✅ Student performance table created
✅ Subscriptions table created
✅ Student contacts table created
✅ Student reviews table created
✅ Grade specific data table created
✅ Indexes created
✅ Views created
```

## 🔍 Verification

Check that tables exist:
```bash
npm run setup-multi-sheets
```

You should see:
```
✅ Students table exists
✅ Student performance table exists
✅ Subscriptions table exists
✅ Student contacts table exists
✅ Student reviews table exists
✅ Grade specific data table exists
🎉 All tables exist! Adding sample data...
```

## 🆘 If You Still Have Issues

1. **Check your Supabase credentials** in `.env` file
2. **Make sure you're in the right project** in Supabase dashboard
3. **Verify the SQL executed successfully** in Supabase dashboard
4. **Check the table names** match exactly (case sensitive)

## 📞 Next Steps

Once tables are created:
1. ✅ Run: `npm run setup-multi-sheets`
2. ✅ Run: `npm run import-all-tabs`
3. ✅ Run: `npm run dev-real`
4. ✅ Test your data import

---

**This will fix the database setup issues and get your multi-sheets system working!** 🚀
