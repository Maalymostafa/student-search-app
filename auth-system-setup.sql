-- Authentication System Database Setup
-- Run this in your Supabase Dashboard SQL Editor

-- 1. CREATE USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  user_code VARCHAR(10) UNIQUE NOT NULL,
  phone_number VARCHAR(20) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('student', 'parent', 'admin', 'teacher')),
  is_active BOOLEAN DEFAULT true,
  is_first_login BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. CREATE STUDENT USERS TABLE (extends students table)
CREATE TABLE IF NOT EXISTS student_users (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, student_id)
);

-- 3. CREATE PARENT USERS TABLE
CREATE TABLE IF NOT EXISTS parent_users (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  full_name_arabic TEXT NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  email VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. CREATE PASSWORD RESET TOKENS TABLE
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  is_used BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 5. CREATE LOGIN ATTEMPTS TABLE (for security)
CREATE TABLE IF NOT EXISTS login_attempts (
  id SERIAL PRIMARY KEY,
  phone_number VARCHAR(20) NOT NULL,
  attempt_count INTEGER DEFAULT 1,
  last_attempt TIMESTAMP DEFAULT NOW(),
  is_locked BOOLEAN DEFAULT false,
  locked_until TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 6. CREATE INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone_number);
CREATE INDEX IF NOT EXISTS idx_users_code ON users(user_code);
CREATE INDEX IF NOT EXISTS idx_users_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_student_users_student_id ON student_users(student_id);
CREATE INDEX IF NOT EXISTS idx_parent_users_phone ON parent_users(phone_number);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_login_attempts_phone ON login_attempts(phone_number);

-- 7. CREATE FUNCTION TO GENERATE UNIQUE USER CODE
CREATE OR REPLACE FUNCTION generate_unique_user_code()
RETURNS VARCHAR(10) AS $$
DECLARE
  new_code VARCHAR(10);
  counter INTEGER := 1;
BEGIN
  LOOP
    -- Generate a 6-digit code with prefix based on type
    new_code := 'U' || LPAD(counter::TEXT, 5, '0');
    
    -- Check if code exists
    IF NOT EXISTS (SELECT 1 FROM users WHERE user_code = new_code) THEN
      RETURN new_code;
    END IF;
    
    counter := counter + 1;
    
    -- Safety check to prevent infinite loop
    IF counter > 99999 THEN
      RAISE EXCEPTION 'Unable to generate unique user code';
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 8. CREATE FUNCTION TO HASH PASSWORDS (basic implementation)
CREATE OR REPLACE FUNCTION hash_password(password TEXT)
RETURNS TEXT AS $$
BEGIN
  -- In production, use proper hashing like bcrypt
  -- For now, using simple hash for demonstration
  RETURN encode(sha256(password::bytea), 'hex');
END;
$$ LANGUAGE plpgsql;

-- 9. CREATE FUNCTION TO CREATE STUDENT USER
CREATE OR REPLACE FUNCTION create_student_user(
  student_phone VARCHAR(20),
  student_code VARCHAR(10)
)
RETURNS INTEGER AS $$
DECLARE
  new_user_id INTEGER;
  new_user_code VARCHAR(10);
  student_id INTEGER;
BEGIN
  -- Find the student
  SELECT id INTO student_id FROM students WHERE student_code = create_student_user.student_code;
  
  IF student_id IS NULL THEN
    RAISE EXCEPTION 'Student not found with code: %', student_code;
  END IF;
  
  -- Generate unique user code
  new_user_code := generate_unique_user_code();
  
  -- Create user account
  INSERT INTO users (user_code, phone_number, password_hash, user_type)
  VALUES (new_user_code, student_phone, hash_password(student_phone), 'student')
  RETURNING id INTO new_user_id;
  
  -- Link to student
  INSERT INTO student_users (user_id, student_id)
  VALUES (new_user_id, student_id);
  
  RETURN new_user_id;
END;
$$ LANGUAGE plpgsql;

-- 10. CREATE FUNCTION TO CREATE PARENT USER
CREATE OR REPLACE FUNCTION create_parent_user(
  parent_phone VARCHAR(20),
  parent_name TEXT
)
RETURNS INTEGER AS $$
DECLARE
  new_user_id INTEGER;
  new_user_code VARCHAR(10);
BEGIN
  -- Generate unique user code
  new_user_code := generate_unique_user_code();
  
  -- Create user account
  INSERT INTO users (user_code, phone_number, password_hash, user_type)
  VALUES (new_user_code, parent_phone, hash_password(parent_phone), 'parent')
  RETURNING id INTO new_user_id;
  
  -- Create parent profile
  INSERT INTO parent_users (user_id, full_name_arabic, phone_number)
  VALUES (new_user_id, parent_name, parent_phone);
  
  RETURN new_user_id;
END;
$$ LANGUAGE plpgsql;

-- 11. CREATE FUNCTION TO VERIFY LOGIN
CREATE OR REPLACE FUNCTION verify_login(
  phone_number VARCHAR(20),
  password TEXT
)
RETURNS TABLE(
  user_id INTEGER,
  user_code VARCHAR(10),
  user_type VARCHAR(20),
  is_active BOOLEAN,
  is_first_login BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.user_code,
    u.user_type,
    u.is_active,
    u.is_first_login
  FROM users u
  WHERE u.phone_number = verify_login.phone_number
    AND u.password_hash = hash_password(password)
    AND u.is_active = true;
END;
$$ LANGUAGE plpgsql;

-- 12. CREATE FUNCTION TO CHANGE PASSWORD
CREATE OR REPLACE FUNCTION change_password(
  user_id INTEGER,
  old_password TEXT,
  new_password TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
  -- Verify old password
  IF NOT EXISTS (
    SELECT 1 FROM users 
    WHERE id = change_password.user_id 
    AND password_hash = hash_password(old_password)
  ) THEN
    RETURN false;
  END IF;
  
  -- Update password
  UPDATE users 
  SET password_hash = hash_password(new_password),
      is_first_login = false,
      updated_at = NOW()
  WHERE id = change_password.user_id;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- 13. CREATE TRIGGER TO UPDATE TIMESTAMP
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 14. INSERT DEFAULT ADMIN USER (password: admin123)
INSERT INTO users (user_code, phone_number, password_hash, user_type, is_first_login)
VALUES ('ADMIN001', 'admin', hash_password('admin123'), 'admin', false)
ON CONFLICT (user_code) DO NOTHING;

-- 15. CREATE VIEW FOR USER SUMMARY
CREATE OR REPLACE VIEW user_summary AS
SELECT 
  u.id,
  u.user_code,
  u.phone_number,
  u.user_type,
  u.is_active,
  u.is_first_login,
  u.last_login,
  u.created_at,
  CASE 
    WHEN u.user_type = 'student' THEN s.full_name_arabic
    WHEN u.user_type = 'parent' THEN p.full_name_arabic
    ELSE 'Admin/Teacher'
  END as display_name,
  CASE 
    WHEN u.user_type = 'student' THEN s.student_code
    ELSE NULL
  END as student_code
FROM users u
LEFT JOIN student_users su ON u.id = su.user_id
LEFT JOIN students s ON su.student_id = s.id
LEFT JOIN parent_users p ON u.id = p.user_id;

-- 16. GRANT PERMISSIONS (adjust based on your Supabase setup)
-- These will be handled by Supabase RLS policies
