# 🗄️ Multi-Sheets Database Guide

## 📊 Your Google Sheets Analysis

Based on the links you provided, I've created a comprehensive database system that can handle all your different Google Sheets:

### **Your Google Sheets Links:**
1. **Student Registration Data**: [Main registration form](https://docs.google.com/spreadsheets/d/1LvZOVJ9zsJ-24KWn2QAkxFE-SJ32HoyGQTnfYYPEqZ0/edit?usp=sharing)
2. **Performance Tracking**: [Performance sheets](https://docs.google.com/spreadsheets/d/1beB1l393rTMkiYwEc8MKSCCrAEdiDfIJlnqaXAs1HKM/edit?usp=sharing)
3. **Contact Information**: [Contact sheets](https://docs.google.com/spreadsheets/d/15RDG22wiRDfq4ARmoJ3F7VNkE-mCC0Z0HwgwI0WsXUo/edit?usp=sharing)
4. **Grade-Specific Data**: [Grade-specific sheets](https://docs.google.com/spreadsheets/d/18Vf9EXXziS4sqbzOU5UhhjQ20FYFgNzV9Sp69uhEuws/edit?usp=sharing)
5. **Reviews/Revisions**: [Review sheets](https://docs.google.com/spreadsheets/d/13DW-TMY9kMgkhVpdn1nouexUETx6rNcP9jvT4hfUjIc/edit?usp=sharing)

## 🗄️ Database Structure for All Sheets

### **1. Students Table (Main Registration)**
```sql
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  student_code VARCHAR(20) UNIQUE,           -- G4001, G5001, etc.
  full_name_arabic TEXT NOT NULL,            -- Arabic names
  grade_level VARCHAR(10) NOT NULL,          -- Grade 4, 5, 6, Prep 1
  subscription_type VARCHAR(50) NOT NULL,    -- Monthly/Term subscriptions
  transfer_phone VARCHAR(20),                -- Payment phone
  whatsapp_phone VARCHAR(20),                -- Contact phone
  transfer_time TIME,                        -- Payment time
  transfer_date DATE,                        -- Payment date
  transfer_image_url TEXT,                   -- Payment proof
  is_confirmed BOOLEAN DEFAULT false,        -- Confirmation status
  enrollment_date DATE DEFAULT CURRENT_DATE,
  parent_name TEXT,                          -- Parent information
  emergency_contact TEXT,                    -- Emergency contact
  class_section TEXT,                        -- Class section
  academic_year TEXT DEFAULT '2024-2025',
  status TEXT DEFAULT 'active',
  notes TEXT,                                -- Additional notes
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### **2. Student Performance Table (Performance Tracking)**
```sql
CREATE TABLE student_performance (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id),
  month VARCHAR(20) NOT NULL,                -- september, october, etc.
  year INTEGER DEFAULT 2024,
  session1_perf VARCHAR(5),                  -- A, B+, C, etc.
  session1_quiz INTEGER,                     -- 0-100 scores
  session2_perf VARCHAR(5),
  session2_quiz INTEGER,
  session3_perf VARCHAR(5),
  session3_quiz INTEGER,
  session4_perf VARCHAR(5),
  session4_quiz INTEGER,
  final_evaluation VARCHAR(5),               -- Final grade
  attendance_percentage DECIMAL(5,2),        -- Attendance %
  teacher_notes TEXT,                        -- Teacher comments
  recorded_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, month, year)
);
```

### **3. Subscriptions Table (Payment Management)**
```sql
CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id),
  subscription_type VARCHAR(50) NOT NULL,    -- Monthly/Term
  amount DECIMAL(10,2) NOT NULL,             -- 120 or 600
  start_date DATE NOT NULL,
  end_date DATE,                             -- Auto-calculated
  status VARCHAR(20) DEFAULT 'active',       -- active/expired
  payment_method VARCHAR(50),                -- Transfer method
  transfer_reference VARCHAR(100),           -- Payment reference
  payment_proof_url TEXT,                    -- Proof image
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **4. Student Contacts Table (Contact Information)**
```sql
CREATE TABLE student_contacts (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id),
  contact_type VARCHAR(20) NOT NULL,         -- parent, emergency, whatsapp
  name TEXT,                                 -- Contact name
  phone VARCHAR(20),                         -- Phone number
  email TEXT,                                -- Email address
  relationship TEXT,                         -- Relationship to student
  is_primary BOOLEAN DEFAULT false,          -- Primary contact
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **5. Student Reviews Table (Reviews/Revisions)**
```sql
CREATE TABLE student_reviews (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id),
  review_type VARCHAR(30) NOT NULL,          -- monthly, revision, exam, quiz
  month VARCHAR(20),                         -- Review month
  year INTEGER DEFAULT 2024,
  subject TEXT,                              -- Subject reviewed
  score INTEGER,                             -- 0-100 score
  grade VARCHAR(5),                          -- A, B+, C, etc.
  feedback TEXT,                             -- Teacher feedback
  teacher_name TEXT,                         -- Teacher name
  review_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **6. Grade-Specific Data Table (Grade-Specific Sheets)**
```sql
CREATE TABLE grade_specific_data (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id),
  grade_level VARCHAR(10) NOT NULL,          -- Grade 4, 5, 6, Prep 1
  data_type VARCHAR(30) NOT NULL,            -- attendance, behavior, homework
  month VARCHAR(20),                         -- Data month
  year INTEGER DEFAULT 2024,
  value TEXT,                                -- Text value
  numeric_value DECIMAL(10,2),               -- Numeric value
  notes TEXT,                                -- Additional notes
  recorded_by TEXT,                          -- Who recorded this
  recorded_at TIMESTAMP DEFAULT NOW()
);
```

## 🚀 Quick Setup for All Sheets

### **Step 1: Setup Multi-Sheets Database**
```bash
# Setup the complete database structure
npm run setup-multi-sheets
```

### **Step 2: Import Data from Each Sheet**

#### **Import Registration Data**
```bash
# Import student registration data
npm run import-sheets
```

#### **Import Performance Data**
```bash
# Import performance tracking data
npm run import-performance
```

#### **Import Other Data Types**
```bash
# For contact information, reviews, and grade-specific data
# You can use the API endpoints or create custom import scripts
```

### **Step 3: Start the Multi-Sheets Server**
```bash
# Start the enhanced server
npm run dev-real
```

## 📊 Data Import Process

### **For Each Google Sheet:**

1. **Export as CSV**:
   - Open your Google Sheet
   - File → Download → CSV
   - Save with descriptive name (e.g., `performance-data.csv`)

2. **Import Using Scripts**:
   ```bash
   # For performance data
   npm run import-performance csv performance-data.csv
   
   # For registration data
   npm run import-sheets csv registration-data.csv
   ```

3. **Or Use API Endpoints**:
   ```bash
   # Add students via API
   curl -X POST http://localhost:3000/api/students \
     -H "Content-Type: application/json" \
     -d '{
       "full_name_arabic": "فارس سامح عيد سالم",
       "grade_level": "Grade 4",
       "subscription_type": "اشتراك شهري 120ج",
       "whatsapp_phone": "1093216126"
     }'
   ```

## 📈 Analytics & Reporting

### **Comprehensive Views Created:**

1. **Student Summary View**:
   - Complete student overview
   - Performance record counts
   - Subscription information
   - Contact details

2. **Performance Summary View**:
   - Monthly performance data
   - Session-based grades
   - Quiz scores
   - Attendance tracking

3. **Financial Summary View**:
   - Subscription details
   - Payment status
   - Revenue tracking
   - Payment methods

### **API Endpoints for All Data:**

```bash
# Get all students with complete data
GET /api/students

# Get performance data
GET /api/students/:id/performance

# Get subscription data
GET /api/students/:id/subscriptions

# Get contact information
GET /api/students/:id/contacts

# Get reviews/revisions
GET /api/students/:id/reviews

# Get grade-specific data
GET /api/students/:id/grade-data

# Analytics dashboard
GET /api/analytics
```

## 🎯 Features for Each Sheet Type

### **Registration Sheet Features:**
- ✅ Student code generation (G4001, G5001, etc.)
- ✅ Payment tracking with image URLs
- ✅ Confirmation status management
- ✅ Contact information storage
- ✅ Enrollment date tracking

### **Performance Sheet Features:**
- ✅ Monthly performance records
- ✅ Session-based grading (A, B+, C, etc.)
- ✅ Quiz score tracking (0-100)
- ✅ Attendance percentage
- ✅ Teacher notes and feedback

### **Contact Sheet Features:**
- ✅ Multiple contact types (parent, emergency, whatsapp)
- ✅ Primary contact designation
- ✅ Relationship tracking
- ✅ Email and phone storage

### **Review Sheet Features:**
- ✅ Different review types (monthly, revision, exam, quiz)
- ✅ Subject-specific reviews
- ✅ Score and grade tracking
- ✅ Teacher feedback storage

### **Grade-Specific Sheet Features:**
- ✅ Flexible data types (attendance, behavior, homework)
- ✅ Text and numeric values
- ✅ Monthly tracking
- ✅ Teacher attribution

## 🔧 Customization Options

### **Add New Data Types:**
```sql
-- Add new fields to existing tables
ALTER TABLE students ADD COLUMN new_field TEXT;

-- Create new tables for additional data
CREATE TABLE new_data_type (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id),
  -- your new fields here
);
```

### **Custom Validation:**
```sql
-- Add validation rules
ALTER TABLE students ADD CONSTRAINT valid_phone 
CHECK (whatsapp_phone ~ '^[0-9]{10,15}$');

ALTER TABLE student_performance ADD CONSTRAINT valid_grade 
CHECK (session1_perf IN ('A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'));
```

### **Performance Optimization:**
```sql
-- Add indexes for fast searches
CREATE INDEX idx_performance_student_month ON student_performance(student_id, month, year);
CREATE INDEX idx_contacts_student ON student_contacts(student_id);
CREATE INDEX idx_reviews_student ON student_reviews(student_id);
```

## 📋 Implementation Checklist

- [ ] Multi-sheets database setup completed
- [ ] Registration data imported
- [ ] Performance data imported
- [ ] Contact data imported
- [ ] Review data imported
- [ ] Grade-specific data imported
- [ ] All API endpoints tested
- [ ] Analytics dashboard working
- [ ] Search functionality tested
- [ ] Data validation working

## 🎉 Expected Results

After implementing the multi-sheets system, you'll have:

1. **Unified Database**: All your Google Sheets in one relational database
2. **Fast Search**: Find any student data instantly
3. **Complete Analytics**: Insights across all data types
4. **Data Integrity**: Validation and relationships between tables
5. **Scalable System**: Ready for hundreds of students and multiple years
6. **Professional Management**: Replace manual Google Sheets with automated system

## 🆘 Support

If you need help with specific sheets:

1. **Export your sheet as CSV**
2. **Share the CSV structure** (first few rows)
3. **I'll create custom import scripts** for your specific data

## 📞 Next Steps

1. **Run the multi-sheets setup**: `npm run setup-multi-sheets`
2. **Import your registration data**: `npm run import-sheets`
3. **Import performance data**: `npm run import-performance`
4. **Test the system**: `npm run dev-real`
5. **Customize as needed**: Add fields, validation, etc.

---

**Ready to consolidate all your Google Sheets into one powerful database system?** 🚀

Your multi-sheets data is now ready to be transformed into a professional student management system! 🎓
