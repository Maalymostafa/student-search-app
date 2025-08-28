-- Database Migration Script for Two-Semester System
-- Run this in your Supabase Dashboard SQL Editor
-- This script will safely migrate your existing database to support two semesters

-- Step 1: Backup existing data (if any)
-- Create backup tables for existing data
CREATE TABLE IF NOT EXISTS backup_student_performance AS 
SELECT * FROM student_performance WHERE 1=0;

-- Copy existing data to backup
INSERT INTO backup_student_performance 
SELECT * FROM student_performance;

-- Step 2: Drop existing tables and recreate with new structure
DROP TABLE IF EXISTS student_performance CASCADE;

-- Step 3: Create new student_performance table with semester support
CREATE TABLE IF NOT EXISTS student_performance (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
  semester VARCHAR(20) NOT NULL, -- 'first' or 'second'
  month VARCHAR(20) NOT NULL,
  year INTEGER NOT NULL,
  
  -- Session 1
  session1_attendance INTEGER DEFAULT 0, -- 0 or 1
  session1_question1 INTEGER DEFAULT 0,  -- 0, 1, or 2
  session1_question2 INTEGER DEFAULT 0,  -- 0, 1, or 2
  session1_quiz INTEGER DEFAULT 0,       -- 0, 1, or 2
  
  -- Session 2
  session2_attendance INTEGER DEFAULT 0, -- 0 or 1
  session2_question1 INTEGER DEFAULT 0,  -- 0, 1, or 2
  session2_question2 INTEGER DEFAULT 0,  -- 0, 1, or 2
  session2_quiz INTEGER DEFAULT 0,       -- 0, 1, or 2
  
  -- Session 3
  session3_attendance INTEGER DEFAULT 0, -- 0 or 1
  session3_question1 INTEGER DEFAULT 0,  -- 0, 1, or 2
  session3_question2 INTEGER DEFAULT 0,  -- 0, 1, or 2
  session3_quiz INTEGER DEFAULT 0,       -- 0, 1, or 2
  
  -- Session 4
  session4_attendance INTEGER DEFAULT 0, -- 0 or 1
  session4_question1 INTEGER DEFAULT 0,  -- 0, 1, or 2
  session4_question2 INTEGER DEFAULT 0,  -- 0, 1, or 2
  session4_quiz INTEGER DEFAULT 0,       -- 0, 1, or 2
  
  -- Monthly totals
  month_total_attendance INTEGER DEFAULT 0,
  month_total_questions INTEGER DEFAULT 0,
  month_total_quiz INTEGER DEFAULT 0,
  month_total_score INTEGER DEFAULT 0,
  
  -- Teacher notes for the month
  teacher_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, semester, month, year)
);

-- Step 4: Create trigger to calculate monthly totals
CREATE OR REPLACE FUNCTION calculate_monthly_totals()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate attendance total (max 4 per month)
  NEW.month_total_attendance := 
    COALESCE(NEW.session1_attendance, 0) +
    COALESCE(NEW.session2_attendance, 0) +
    COALESCE(NEW.session3_attendance, 0) +
    COALESCE(NEW.session4_attendance, 0);
  
  -- Calculate questions total (max 16 per month - 4 sessions * 2 questions * 2 points)
  NEW.month_total_questions := 
    COALESCE(NEW.session1_question1, 0) + COALESCE(NEW.session1_question2, 0) +
    COALESCE(NEW.session2_question1, 0) + COALESCE(NEW.session2_question2, 0) +
    COALESCE(NEW.session3_question1, 0) + COALESCE(NEW.session3_question2, 0) +
    COALESCE(NEW.session4_question1, 0) + COALESCE(NEW.session4_question2, 0);
  
  -- Calculate quiz total (max 8 per month - 4 sessions * 1 quiz * 2 points)
  NEW.month_total_quiz := 
    COALESCE(NEW.session1_quiz, 0) +
    COALESCE(NEW.session2_quiz, 0) +
    COALESCE(NEW.session3_quiz, 0) +
    COALESCE(NEW.session4_quiz, 0);
  
  -- Calculate total score (max 28 per month)
  NEW.month_total_score := 
    NEW.month_total_attendance + NEW.month_total_questions + NEW.month_total_quiz;
  
  -- Update timestamp
  NEW.updated_at := NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_calculate_monthly_totals ON student_performance;
CREATE TRIGGER trigger_calculate_monthly_totals
  BEFORE INSERT OR UPDATE ON student_performance
  FOR EACH ROW
  EXECUTE FUNCTION calculate_monthly_totals();

-- Step 5: Create comprehensive view for student summary
CREATE OR REPLACE VIEW student_summary AS
SELECT 
  s.id,
  s.student_code,
  s.full_name_arabic,
  s.grade_level,
  s.is_confirmed,
  
  -- First Semester (September-December)
  COALESCE(sp_sep1.month_total_attendance, 0) as first_sem_september_attendance,
  COALESCE(sp_sep1.month_total_questions, 0) as first_sem_september_questions,
  COALESCE(sp_sep1.month_total_quiz, 0) as first_sem_september_quiz,
  COALESCE(sp_sep1.month_total_score, 0) as first_sem_september_total,
  
  COALESCE(sp_oct1.month_total_attendance, 0) as first_sem_october_attendance,
  COALESCE(sp_oct1.month_total_questions, 0) as first_sem_october_questions,
  COALESCE(sp_oct1.month_total_quiz, 0) as first_sem_october_quiz,
  COALESCE(sp_oct1.month_total_score, 0) as first_sem_october_total,
  
  COALESCE(sp_nov1.month_total_attendance, 0) as first_sem_november_attendance,
  COALESCE(sp_nov1.month_total_questions, 0) as first_sem_november_questions,
  COALESCE(sp_nov1.month_total_quiz, 0) as first_sem_november_quiz,
  COALESCE(sp_nov1.month_total_score, 0) as first_sem_november_total,
  
  COALESCE(sp_dec1.month_total_attendance, 0) as first_sem_december_attendance,
  COALESCE(sp_dec1.month_total_questions, 0) as first_sem_december_questions,
  COALESCE(sp_dec1.month_total_quiz, 0) as first_sem_december_quiz,
  COALESCE(sp_dec1.month_total_score, 0) as first_sem_december_total,
  
  -- Second Semester (January-April)
  COALESCE(sp_jan2.month_total_attendance, 0) as second_sem_january_attendance,
  COALESCE(sp_jan2.month_total_questions, 0) as second_sem_january_questions,
  COALESCE(sp_jan2.month_total_quiz, 0) as second_sem_january_quiz,
  COALESCE(sp_jan2.month_total_score, 0) as second_sem_january_total,
  
  COALESCE(sp_feb2.month_total_attendance, 0) as second_sem_february_attendance,
  COALESCE(sp_feb2.month_total_questions, 0) as second_sem_february_questions,
  COALESCE(sp_feb2.month_total_quiz, 0) as second_sem_february_quiz,
  COALESCE(sp_feb2.month_total_score, 0) as second_sem_february_total,
  
  COALESCE(sp_mar2.month_total_attendance, 0) as second_sem_march_attendance,
  COALESCE(sp_mar2.month_total_questions, 0) as second_sem_march_questions,
  COALESCE(sp_mar2.month_total_quiz, 0) as second_sem_march_quiz,
  COALESCE(sp_mar2.month_total_score, 0) as second_sem_march_total,
  
  COALESCE(sp_apr2.month_total_attendance, 0) as second_sem_april_attendance,
  COALESCE(sp_apr2.month_total_questions, 0) as second_sem_april_questions,
  COALESCE(sp_apr2.month_total_quiz, 0) as second_sem_april_quiz,
  COALESCE(sp_apr2.month_total_score, 0) as second_sem_april_total,
  
  -- Semester totals
  COALESCE(sp_sep1.month_total_score, 0) + 
  COALESCE(sp_oct1.month_total_score, 0) + 
  COALESCE(sp_nov1.month_total_score, 0) + 
  COALESCE(sp_dec1.month_total_score, 0) as first_semester_total,
  
  COALESCE(sp_jan2.month_total_score, 0) + 
  COALESCE(sp_feb2.month_total_score, 0) + 
  COALESCE(sp_mar2.month_total_score, 0) + 
  COALESCE(sp_apr2.month_total_score, 0) as second_semester_total,
  
  -- Overall total
  COALESCE(sp_sep1.month_total_score, 0) + 
  COALESCE(sp_oct1.month_total_score, 0) + 
  COALESCE(sp_nov1.month_total_score, 0) + 
  COALESCE(sp_dec1.month_total_score, 0) +
  COALESCE(sp_jan2.month_total_score, 0) + 
  COALESCE(sp_feb2.month_total_score, 0) + 
  COALESCE(sp_mar2.month_total_score, 0) + 
  COALESCE(sp_apr2.month_total_score, 0) as total_score,
  
  s.created_at,
  s.updated_at
FROM students s
-- First Semester joins
LEFT JOIN student_performance sp_sep1 ON s.id = sp_sep1.student_id AND sp_sep1.semester = 'first' AND sp_sep1.month = 'september' AND sp_sep1.year = EXTRACT(YEAR FROM CURRENT_DATE)
LEFT JOIN student_performance sp_oct1 ON s.id = sp_oct1.student_id AND sp_oct1.semester = 'first' AND sp_oct1.month = 'october' AND sp_oct1.year = EXTRACT(YEAR FROM CURRENT_DATE)
LEFT JOIN student_performance sp_nov1 ON s.id = sp_nov1.student_id AND sp_nov1.semester = 'first' AND sp_nov1.month = 'november' AND sp_nov1.year = EXTRACT(YEAR FROM CURRENT_DATE)
LEFT JOIN student_performance sp_dec1 ON s.id = sp_dec1.student_id AND sp_dec1.semester = 'first' AND sp_dec1.month = 'december' AND sp_dec1.year = EXTRACT(YEAR FROM CURRENT_DATE)
-- Second Semester joins
LEFT JOIN student_performance sp_jan2 ON s.id = sp_jan2.student_id AND sp_jan2.semester = 'second' AND sp_jan2.month = 'january' AND sp_jan2.year = EXTRACT(YEAR FROM CURRENT_DATE)
LEFT JOIN student_performance sp_feb2 ON s.id = sp_feb2.student_id AND sp_feb2.semester = 'second' AND sp_feb2.month = 'february' AND sp_feb2.year = EXTRACT(YEAR FROM CURRENT_DATE)
LEFT JOIN student_performance sp_mar2 ON s.id = sp_mar2.student_id AND sp_mar2.semester = 'second' AND sp_mar2.month = 'march' AND sp_mar2.year = EXTRACT(YEAR FROM CURRENT_DATE)
LEFT JOIN student_performance sp_apr2 ON s.id = sp_apr2.student_id AND sp_apr2.semester = 'second' AND sp_apr2.month = 'april' AND sp_apr2.year = EXTRACT(YEAR FROM CURRENT_DATE);

-- Step 6: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_student_performance_student_id ON student_performance(student_id);
CREATE INDEX IF NOT EXISTS idx_student_performance_semester_month_year ON student_performance(semester, month, year);
CREATE INDEX IF NOT EXISTS idx_students_student_code ON students(student_code);
CREATE INDEX IF NOT EXISTS idx_students_grade_level ON students(grade_level);

-- Step 7: Insert sample data for testing
INSERT INTO students (student_code, full_name_arabic, grade_level, is_confirmed) VALUES
('G4001', 'أحمد محمد', 'G4', true),
('G5001', 'فاطمة علي', 'G5', true),
('G6001', 'عمر حسن', 'G6', false),
('P1001', 'ليلى أحمد', 'P1', true)
ON CONFLICT (student_code) DO NOTHING;

-- Sample performance data for G4001 - First Semester
INSERT INTO student_performance (student_id, semester, month, year, 
  session1_attendance, session1_question1, session1_question2, session1_quiz,
  session2_attendance, session2_question1, session2_question2, session2_quiz,
  session3_attendance, session3_question1, session3_question2, session3_quiz,
  session4_attendance, session4_question1, session4_question2, session4_quiz)
SELECT 
  s.id, 'first', 'september', EXTRACT(YEAR FROM CURRENT_DATE),
  1, 2, 2, 2,  -- Session 1: attended, both questions correct, quiz correct
  1, 2, 1, 2,  -- Session 2: attended, first correct, second partial, quiz correct
  1, 1, 2, 1,  -- Session 3: attended, first partial, second correct, quiz partial
  1, 2, 2, 2   -- Session 4: attended, both correct, quiz correct
FROM students s WHERE s.student_code = 'G4001'
ON CONFLICT (student_id, semester, month, year) DO NOTHING;

-- Sample performance data for G4001 - Second Semester
INSERT INTO student_performance (student_id, semester, month, year, 
  session1_attendance, session1_question1, session1_question2, session1_quiz,
  session2_attendance, session2_question1, session2_question2, session2_quiz,
  session3_attendance, session3_question1, session3_question2, session3_quiz,
  session4_attendance, session4_question1, session4_question2, session4_quiz)
SELECT 
  s.id, 'second', 'january', EXTRACT(YEAR FROM CURRENT_DATE),
  1, 2, 2, 2,  -- Session 1: attended, both questions correct, quiz correct
  1, 2, 2, 2,  -- Session 2: attended, both correct, quiz correct
  1, 2, 1, 2,  -- Session 3: attended, first correct, second partial, quiz correct
  1, 2, 2, 2   -- Session 4: attended, both correct, quiz correct
FROM students s WHERE s.student_code = 'G4001'
ON CONFLICT (student_id, semester, month, year) DO NOTHING;

-- Step 8: Migration complete message
SELECT 'Database migration completed successfully! Two-semester system is now active.' as status;
