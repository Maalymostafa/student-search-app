# 🔄 Replace Demo Data with Actual Google Sheets Data

## 🎯 Overview

This guide will help you replace the existing demo data with your actual data from the 5 Google Sheets. The process involves setting up the database structure and importing all your real data.

## 📊 Your 5 Google Sheets

Based on your project, you have 5 Google Sheets with different types of data:

1. **Main Registration Sheet** - Student registration and basic info
2. **Performance Tracking Sheet** - Monthly performance data
3. **Contact Information Sheet** - Parent and emergency contacts
4. **Review/Revision Sheet** - Monthly reviews and exam data
5. **Grade-Specific Sheet** - Grade-specific information

## 🚀 Step-by-Step Process

### **Step 1: Setup Multi-Sheets Database**

First, set up the complete database structure that can handle all your data:

```bash
npm run setup-multi-sheets
```

This will create:
- ✅ Students table (main registration data)
- ✅ Student performance table (monthly performance)
- ✅ Subscriptions table (payment data)
- ✅ Student contacts table (contact information)
- ✅ Student reviews table (review/revision data)
- ✅ Grade specific data table (grade-specific info)

### **Step 2: Export Your Google Sheets as CSV**

For each of your 5 Google Sheets:

1. **Open each Google Sheet**
2. **For each tab in the sheet:**
   - Click on the tab name
   - Go to **File → Download → CSV**
   - Save with descriptive name

**Example file structure:**
```
csv-data/
├── registration/
│   ├── form-responses.csv
│   ├── g4-students.csv
│   ├── g5-students.csv
│   ├── g6-students.csv
│   └── p1-students.csv
├── performance/
│   ├── september.csv
│   ├── october.csv
│   ├── november.csv
│   └── december.csv
├── contacts/
│   ├── parent-contacts.csv
│   ├── emergency-contacts.csv
│   └── whatsapp-contacts.csv
├── reviews/
│   ├── monthly-reviews.csv
│   ├── revision-data.csv
│   └── exam-results.csv
└── grade-specific/
    ├── grade4-data.csv
    ├── grade5-data.csv
    ├── grade6-data.csv
    └── prep1-data.csv
```

### **Step 3: Import All Data**

Run the comprehensive import script:

```bash
npm run import-all-tabs
```

This will:
- ✅ Import all registration data
- ✅ Import all performance data
- ✅ Import all contact information
- ✅ Import all review/revision data
- ✅ Import all grade-specific data
- ✅ Link all data together by student codes

### **Step 4: Verify Import Results**

Check the import results:

```bash
cat logs/import-report.json
```

You should see:
- ✅ Total students imported
- ✅ Performance records imported
- ✅ Contact records imported
- ✅ Review records imported
- ✅ Any errors or warnings

### **Step 5: Test with Real Data**

Now test your application with real student codes:

1. **Start the server:**
   ```bash
   npm run dev
   ```

2. **Test with actual student codes** from your data:
   - Use real student codes from your Google Sheets
   - Verify all data is showing correctly
   - Check performance data for all months

## 🔧 Alternative: Direct Google Sheets Import

If you prefer to import directly from Google Sheets URLs:

### **Step 1: Get Your Google Sheets URLs**

Make sure you have the URLs for all 5 Google Sheets:
- Main registration sheet URL
- Performance tracking sheet URL
- Contact information sheet URL
- Review/revision sheet URL
- Grade-specific sheet URL

### **Step 2: Set Up Google Sheets API**

1. **Enable Google Sheets API:**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing
   - Enable Google Sheets API
   - Create credentials (Service Account)

2. **Download credentials:**
   - Download the JSON credentials file
   - Save as `google-credentials.json` in your project root

3. **Set environment variables:**
   ```bash
   GOOGLE_SHEETS_CREDENTIALS=google-credentials.json
   ```

### **Step 3: Import Directly from Google Sheets**

```bash
npm run import-google-sheets
```

## 📋 Data Mapping

The import script will map your Google Sheets data to the database:

### **Registration Data:**
- Student codes → `student_code`
- Full names → `name`
- Grade levels → `grade_level`
- Subscription types → `subscription_type`
- Phone numbers → `contact_phone`

### **Performance Data:**
- Monthly sessions → `september`, `october`, `november`, `december`
- Session performance → `session1_perf`, `session2_perf`, etc.
- Quiz scores → `session1_quiz`, `session2_quiz`, etc.

### **Contact Data:**
- Parent names → `parent_name`
- Phone numbers → `parent_phone`
- Emergency contacts → `emergency_contact`
- WhatsApp numbers → `whatsapp_number`

## 🎯 Expected Results

After successful import:

1. **Database populated** with all your real data
2. **Student codes working** - you can search with real codes
3. **Complete performance data** for all students
4. **Contact information** linked to students
5. **Review/revision data** available
6. **Grade-specific information** organized

## 🆘 Troubleshooting

### **If import fails:**

1. **Check database connection:**
   ```bash
   npm run setup-multi-sheets
   ```

2. **Verify CSV files:**
   - Make sure all CSV files are properly formatted
   - Check that student codes are consistent across files

3. **Check logs:**
   ```bash
   cat logs/import-report.json
   ```

4. **Manual import:**
   ```bash
   npm run import-performance
   npm run import-google-sheets
   ```

### **If student codes don't work:**

1. **Check student codes format** in your Google Sheets
2. **Verify codes are imported** correctly
3. **Test with exact codes** from your sheets

## 🎉 Success Indicators

You'll know the import was successful when:

- ✅ All student codes from your sheets work
- ✅ Performance data shows for all months
- ✅ Contact information is linked
- ✅ No demo data appears in search results
- ✅ All your real students are searchable

## 📞 Next Steps

After successful import:

1. **Test thoroughly** with real student codes
2. **Verify all data** is showing correctly
3. **Update Flutter app** if needed
4. **Deploy to production** with real data

---

**Your application will now use your actual Google Sheets data instead of demo data!** 🚀
