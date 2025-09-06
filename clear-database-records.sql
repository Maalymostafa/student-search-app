-- CLEAR DATABASE RECORDS - KEEP STRUCTURE
-- Run this in your Supabase Dashboard SQL Editor
-- This will delete all student data but keep all tables, indexes, and views

-- 1. CLEAR ALL STUDENT DATA (KEEP TABLES)
TRUNCATE TABLE students_unified CASCADE;
TRUNCATE TABLE students CASCADE;
TRUNCATE TABLE student_performance CASCADE;
TRUNCATE TABLE subscriptions CASCADE;
TRUNCATE TABLE student_contacts CASCADE;
TRUNCATE TABLE student_reviews CASCADE;
TRUNCATE TABLE grade_specific_data CASCADE;

-- Clear legacy grade tables if they exist
TRUNCATE TABLE g4 CASCADE;
TRUNCATE TABLE g5 CASCADE;
TRUNCATE TABLE g6 CASCADE;
TRUNCATE TABLE p1 CASCADE;

-- 2. CLEAR FEEDBACK DATA (OPTIONAL - remove if you want to keep feedback)
-- TRUNCATE TABLE user_feedback CASCADE;
-- TRUNCATE TABLE user_reviews CASCADE;
-- TRUNCATE TABLE user_suggestions CASCADE;
-- TRUNCATE TABLE contact_requests CASCADE;

-- 3. RESET AUTO-INCREMENT COUNTERS
ALTER SEQUENCE students_id_seq RESTART WITH 1;
ALTER SEQUENCE students_unified_id_seq RESTART WITH 1;
ALTER SEQUENCE student_performance_id_seq RESTART WITH 1;
ALTER SEQUENCE subscriptions_id_seq RESTART WITH 1;

-- Reset legacy table sequences if they exist
ALTER SEQUENCE g4_id_seq RESTART WITH 1;
ALTER SEQUENCE g5_id_seq RESTART WITH 1;
ALTER SEQUENCE g6_id_seq RESTART WITH 1;
ALTER SEQUENCE p1_id_seq RESTART WITH 1;

-- 4. VERIFY CLEANUP
SELECT 
  'Database cleared successfully' as status,
  (SELECT COUNT(*) FROM students_unified) as unified_students,
  (SELECT COUNT(*) FROM students) as main_students,
  (SELECT COUNT(*) FROM student_performance) as performance_records,
  (SELECT COUNT(*) FROM subscriptions) as subscriptions,
  COALESCE((SELECT COUNT(*) FROM g4), 0) as g4_students,
  COALESCE((SELECT COUNT(*) FROM g5), 0) as g5_students,
  COALESCE((SELECT COUNT(*) FROM g6), 0) as g6_students,
  COALESCE((SELECT COUNT(*) FROM p1), 0) as p1_students;

-- 5. CONFIRM TABLES STILL EXIST
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('students', 'students_unified', 'student_performance', 'g4', 'g5', 'g6', 'p1')
ORDER BY table_name;

-- 6. CONFIRM VIEWS AND INDEXES STILL EXIST  
SELECT 
  schemaname,
  indexname,
  tablename
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND tablename LIKE '%student%'
ORDER BY tablename, indexname;
