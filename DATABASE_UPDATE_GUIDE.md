# Database Update Guide - Adding Student and Parent Numbers

## 🎯 What's New

Your registration form now includes two new required fields:
- **رقم الطالب** (Student Number) - For the student's identification number
- **رقم ولي الأمر** (Parent Number) - For the parent/guardian's phone number

## 📋 Database Update Required

You need to add these new columns to your Supabase database.

### Step 1: Go to Supabase Dashboard
1. Visit: https://supabase.com/dashboard
2. Select your project
3. Go to **SQL Editor**

### Step 2: Run the SQL Commands
Copy and paste this SQL code into the SQL Editor:

```sql
-- Add student_number and parent_number columns to students table
-- Run this in your Supabase Dashboard SQL Editor

-- Add student_number column
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS student_number VARCHAR(50);

-- Add parent_number column  
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS parent_number VARCHAR(20);

-- Add comments for documentation
COMMENT ON COLUMN students.student_number IS 'Student identification number from school records';
COMMENT ON COLUMN students.parent_number IS 'Parent/Guardian phone number for contact';

-- Update existing records with placeholder values if needed
UPDATE students 
SET student_number = 'N/A', parent_number = transfer_phone 
WHERE student_number IS NULL OR parent_number IS NULL;
```

### Step 3: Click "Run" to Execute

## ✅ What This Does

1. **Adds `student_number` column** - Stores the student's identification number
2. **Adds `parent_number` column** - Stores the parent's phone number
3. **Updates existing records** - Fills empty values with placeholders
4. **Adds documentation** - Comments explaining what each column is for

## 🚀 After Running the SQL

Your registration form will now:
- ✅ Collect student numbers
- ✅ Collect parent numbers  
- ✅ Save both fields to the database
- ✅ Validate that both fields are filled
- ✅ Work in both web and Flutter apps

## 🧪 Test the New Fields

1. Visit: `http://localhost:3000/register`
2. Fill out the form including the new fields
3. Submit and verify the data is saved correctly

## 📱 Flutter App

The Flutter app has also been updated with the new fields and will work once you run the database update.

---

**Note**: If you get any errors when running the SQL, it might mean the columns already exist. That's okay - the `IF NOT EXISTS` clause will prevent errors.