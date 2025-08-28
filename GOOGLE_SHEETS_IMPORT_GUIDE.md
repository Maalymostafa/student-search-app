# 📥 Google Sheets to Supabase Import Guide

## 🎯 Overview

This guide shows you **3 different methods** to import your Google Sheets data directly into Supabase. Choose the method that works best for you!

## 🚀 **Method 1: Direct CSV Import (Easiest)**

### **Step 1: Export Each Tab as CSV**

1. **Open your Google Sheet**
2. **For each tab you want to import:**
   - Click on the tab name (e.g., "Form Responses 1", "September", "Parent Contacts")
   - Go to **File → Download → CSV**
   - Save with descriptive name:
     ```
     registration-data.csv
     performance-september.csv
     performance-october.csv
     contacts-parents.csv
     contacts-emergency.csv
     reviews-monthly.csv
     grade4-data.csv
     grade5-data.csv
     ```

### **Step 2: Import to Supabase Dashboard**

1. **Go to Supabase Dashboard:**
   ```
   https://supabase.com/dashboard/project/[YOUR_PROJECT]/table-editor
   ```

2. **For each table:**
   - Click on the table (e.g., `students`)
   - Click **"Import data"** button
   - Upload your CSV file
   - Map the columns correctly:
     - `student_code` → `student_code`
     - `full_name_arabic` → `full_name_arabic`
     - `grade_level` → `grade_level`
     - etc.
   - Click **"Import"**

### **Step 3: Verify Import**
- Check that data appears in your tables
- Verify student codes are preserved
- Test the search functionality

## 🚀 **Method 2: Using Import Scripts (Recommended)**

### **Step 1: Install Dependencies**
```bash
npm install
```

### **Step 2: Organize CSV Files**
Create this folder structure:
```
csv-data/
├── registration/
│   └── registration-data.csv
├── performance/
│   ├── september.csv
│   ├── october.csv
│   ├── november.csv
│   └── december.csv
├── contacts/
│   ├── parents.csv
│   ├── emergency.csv
│   └── whatsapp.csv
├── reviews/
│   ├── monthly.csv
│   ├── revisions.csv
│   └── exams.csv
└── grade-specific/
    ├── grade4.csv
    ├── grade5.csv
    ├── grade6.csv
    └── prep1.csv
```

### **Step 3: Run Import Script**
```bash
# Import all data from CSV files
npm run import-all-tabs csv csv-data/
```

### **Step 4: Verify Import**
```bash
# Check the import results
curl http://localhost:3000/api/students
```

## 🚀 **Method 3: Direct Google Sheets API (Most Advanced)**

### **Step 1: Set Up Google Sheets API**

1. **Go to Google Cloud Console:**
   ```
   https://console.cloud.google.com/
   ```

2. **Create a new project or select existing one**

3. **Enable Google Sheets API:**
   - Go to "APIs & Services" → "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

4. **Create Service Account:**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "Service Account"
   - Fill in details and create

5. **Download Service Account Key:**
   - Click on your service account
   - Go to "Keys" tab
   - Click "Add Key" → "Create new key"
   - Choose JSON format
   - Download the file

6. **Share Your Google Sheets:**
   - Open each Google Sheet
   - Click "Share" button
   - Add your service account email (from the JSON file)
   - Give "Viewer" access

### **Step 2: Configure Environment**

1. **Rename the downloaded file:**
   ```bash
   mv [downloaded-file].json google-service-account.json
   ```

2. **Add to .env file:**
   ```env
   GOOGLE_SERVICE_ACCOUNT_KEY=google-service-account.json
   ```

### **Step 3: Run Direct Import**
```bash
# Import directly from Google Sheets
npm run import-from-sheets
```

## 📊 **Your Google Sheets Configuration**

The import script is configured for your specific sheets:

### **Sheet 1: Registration Form**
- **ID:** `1LvZOVJ9zsJ-24KWn2QAkxFE-SJ32HoyGQTnfYYPEqZ0`
- **Tab:** "Form Responses 1" → `students` table

### **Sheet 2: Performance Tracking**
- **ID:** `1beB1l393rTMkiYwEc8MKSCCrAEdiDfIJlnqaXAs1HKM`
- **Tabs:** "September", "October", "November", "December" → `student_performance` table

### **Sheet 3: Contact Information**
- **ID:** `15RDG22wiRDfq4ARmoJ3F7VNkE-mCC0Z0HwgwI0WsXUo`
- **Tabs:** "Parent Contacts", "Emergency Contacts", "WhatsApp Contacts" → `student_contacts` table

### **Sheet 4: Review Data**
- **ID:** `18Vf9EXXziS4sqbzOU5UhhjQ20FYFgNzV9Sp69uhEuws`
- **Tabs:** "Monthly Reviews", "Revision Data", "Exam Results" → `student_reviews` table

### **Sheet 5: Grade Specific**
- **ID:** `13DW-TMY9kMgkhVpdn1nouexUETx6rNcP9jvT4hfUjIc`
- **Tabs:** "Grade 4", "Grade 5", "Grade 6", "Prep 1" → `grade_specific_data` table

## 🔧 **Available Commands**

```bash
# Method 1: Manual CSV import (use Supabase dashboard)

# Method 2: CSV import using scripts
npm run import-all-tabs csv csv-data/

# Method 3: Direct Google Sheets import
npm run import-from-sheets

# Check import results
npm run test-db
```

## 📋 **Data Mapping**

### **Students Table:**
- `student_code` → `student_code` (preserved)
- `full_name_arabic` → `full_name_arabic`
- `grade_level` → `grade_level`
- `subscription_type` → `subscription_type`
- `transfer_phone` → `transfer_phone`
- `whatsapp_phone` → `whatsapp_phone`
- `transfer_date` → `transfer_date`
- `transfer_image_url` → `transfer_image_url`

### **Performance Table:**
- `student_code` → `student_code`
- Tab name → `month`
- `session1_perf` → `session1_perf`
- `session1_quiz` → `session1_quiz`
- `final_evaluation` → `final_evaluation`
- `attendance_percentage` → `attendance_percentage`

### **Contacts Table:**
- `student_code` → `student_code`
- `name` → `name`
- `phone` → `phone`
- `email` → `email`
- `relationship` → `relationship`
- Tab type → `contact_type`

## ✅ **Verification Steps**

### **After Import:**
1. **Check data in Supabase:**
   ```sql
   SELECT COUNT(*) FROM students;
   SELECT COUNT(*) FROM student_performance;
   SELECT COUNT(*) FROM student_contacts;
   ```

2. **Test search functionality:**
   ```bash
   curl -X POST http://localhost:3000/api/search \
     -H "Content-Type: application/json" \
     -d '{"code": "G4001"}'
   ```

3. **Check analytics:**
   ```bash
   curl http://localhost:3000/api/analytics
   ```

## 🆘 **Troubleshooting**

### **Common Issues:**

1. **"Permission denied" error:**
   - Make sure you shared the Google Sheets with the service account
   - Check that the service account has "Viewer" access

2. **"Table not found" error:**
   - Run the database setup first: `npm run setup-multi-sheets`
   - Make sure tables exist in Supabase

3. **"Column mapping" errors:**
   - Check that CSV headers match the expected column names
   - Verify data types are correct

4. **"Student code not found" errors:**
   - Make sure student codes exist in the `students` table first
   - Import students before importing related data

### **Recovery:**
```bash
# Clear and reimport if needed
npm run setup-multi-sheets
npm run import-all-tabs
```

## 🎯 **Recommended Workflow**

1. **Start with Method 1 (CSV Import)** - Easiest to understand
2. **Use Method 2 (Import Scripts)** - For automated processing
3. **Try Method 3 (Direct API)** - For real-time sync

## 📞 **Next Steps**

After successful import:
1. ✅ Test search functionality
2. ✅ Verify all data is imported correctly
3. ✅ Check analytics dashboard
4. ✅ Start using the application

---

## 🎉 **Summary**

**You now have 3 different ways to import your Google Sheets data into Supabase:**

1. **CSV Import** - Manual, but simple
2. **Import Scripts** - Automated, handles all your data
3. **Direct API** - Real-time, most advanced

**Choose the method that works best for you and get your data imported!** 🚀


