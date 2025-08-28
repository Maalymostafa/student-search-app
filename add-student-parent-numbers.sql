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
