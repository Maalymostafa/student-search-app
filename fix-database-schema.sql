-- URGENT: Database Schema Unification
-- Run this in your Supabase Dashboard SQL Editor
-- This will fix the main structural issues

-- 1. CREATE UNIFIED STUDENTS TABLE (if not exists)
CREATE TABLE IF NOT EXISTS students_unified (
  id SERIAL PRIMARY KEY,
  student_code VARCHAR(10) UNIQUE NOT NULL,
  full_name_arabic TEXT NOT NULL,
  grade_level VARCHAR(20) NOT NULL,
  is_confirmed BOOLEAN DEFAULT false,
  
  -- Performance data (JSON for flexibility)
  september JSONB DEFAULT '{}',
  october JSONB DEFAULT '{}', 
  november JSONB DEFAULT '{}',
  december JSONB DEFAULT '{}',
  
  -- Contact info
  transfer_phone VARCHAR(20),
  whatsapp_phone VARCHAR(20),
  
  -- Subscription info
  subscription_type TEXT,
  subscription_status VARCHAR(20) DEFAULT 'active',
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. MIGRATE DATA FROM SEPARATE GRADE TABLES
-- Insert data from g4, g5, g6, p1 tables into unified table
INSERT INTO students_unified (student_code, full_name_arabic, grade_level, is_confirmed, september, october, november, december)
SELECT 
  student_code, 
  name as full_name_arabic,
  'G4' as grade_level,
  is_confirmed,
  september, october, november, december
FROM g4
ON CONFLICT (student_code) DO NOTHING;

INSERT INTO students_unified (student_code, full_name_arabic, grade_level, is_confirmed, september, october, november, december)
SELECT 
  student_code, 
  name as full_name_arabic,
  'G5' as grade_level,
  is_confirmed,
  september, october, november, december  
FROM g5
ON CONFLICT (student_code) DO NOTHING;

INSERT INTO students_unified (student_code, full_name_arabic, grade_level, is_confirmed, september, october, november, december)
SELECT 
  student_code, 
  name as full_name_arabic,
  'G6' as grade_level, 
  is_confirmed,
  september, october, november, december
FROM g6
ON CONFLICT (student_code) DO NOTHING;

INSERT INTO students_unified (student_code, full_name_arabic, grade_level, is_confirmed, september, october, november, december)
SELECT 
  student_code, 
  name as full_name_arabic,
  'P1' as grade_level,
  is_confirmed,
  september, october, november, december
FROM p1  
ON CONFLICT (student_code) DO NOTHING;

-- 3. CREATE PERFORMANCE INDEXES FOR SPEED
CREATE INDEX IF NOT EXISTS idx_students_code ON students_unified(student_code);
CREATE INDEX IF NOT EXISTS idx_students_grade ON students_unified(grade_level);
CREATE INDEX IF NOT EXISTS idx_students_confirmed ON students_unified(is_confirmed);

-- 4. CREATE VIEW FOR EASY QUERYING
CREATE OR REPLACE VIEW student_summary AS
SELECT 
  id,
  student_code,
  full_name_arabic,
  grade_level,
  is_confirmed,
  COALESCE(september->>'month_total_score', '0')::integer as sep_score,
  COALESCE(october->>'month_total_score', '0')::integer as oct_score,
  COALESCE(november->>'month_total_score', '0')::integer as nov_score,
  COALESCE(december->>'month_total_score', '0')::integer as dec_score,
  subscription_status,
  created_at
FROM students_unified;

-- 5. VERIFY DATA MIGRATION
SELECT 
  'Migration Complete' as status,
  grade_level,
  COUNT(*) as student_count
FROM students_unified 
GROUP BY grade_level;
