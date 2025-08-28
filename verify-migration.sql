-- Verification Script for Two-Semester Database Migration
-- Run this after the migration to verify everything is working correctly

-- 1. Check if the new table structure exists
SELECT 
  'Table Structure Check' as check_type,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'student_performance' 
      AND column_name = 'semester'
    ) THEN '✅ New semester column exists'
    ELSE '❌ Semester column missing'
  END as status;

-- 2. Check if triggers are working
SELECT 
  'Trigger Check' as check_type,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.triggers 
      WHERE trigger_name = 'trigger_calculate_monthly_totals'
    ) THEN '✅ Monthly totals trigger exists'
    ELSE '❌ Monthly totals trigger missing'
  END as status;

-- 3. Check if view exists
SELECT 
  'View Check' as check_type,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.views 
      WHERE table_name = 'student_summary'
    ) THEN '✅ Student summary view exists'
    ELSE '❌ Student summary view missing'
  END as status;

-- 4. Check sample data
SELECT 
  'Sample Data Check' as check_type,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM students WHERE student_code = 'G4001'
    ) THEN '✅ Sample student exists'
    ELSE '❌ Sample student missing'
  END as status;

-- 5. Check performance data
SELECT 
  'Performance Data Check' as check_type,
  COUNT(*) as record_count,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ Performance data exists'
    ELSE '❌ No performance data found'
  END as status
FROM student_performance;

-- 6. Test the view with sample data
SELECT 
  'View Data Test' as check_type,
  student_code,
  first_semester_total,
  second_semester_total,
  total_score,
  CASE 
    WHEN total_score > 0 THEN '✅ View working correctly'
    ELSE '❌ View not returning data'
  END as status
FROM student_summary 
WHERE student_code = 'G4001';

-- 7. Test trigger functionality
SELECT 
  'Trigger Test' as check_type,
  month_total_score,
  month_total_attendance,
  month_total_questions,
  month_total_quiz,
  CASE 
    WHEN month_total_score = (month_total_attendance + month_total_questions + month_total_quiz) 
    THEN '✅ Trigger calculating correctly'
    ELSE '❌ Trigger calculation error'
  END as status
FROM student_performance 
WHERE student_id = (SELECT id FROM students WHERE student_code = 'G4001')
LIMIT 1;

-- 8. Show table structure
SELECT 
  'Table Structure' as info_type,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'student_performance' 
ORDER BY ordinal_position;

-- 9. Show indexes
SELECT 
  'Indexes' as info_type,
  indexname,
  indexdef
FROM pg_indexes 
WHERE tablename = 'student_performance';
