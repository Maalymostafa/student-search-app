-- FEEDBACK SYSTEM DATABASE TABLES
-- Run this in your Supabase Dashboard SQL Editor

-- 1. USER FEEDBACK TABLE
CREATE TABLE IF NOT EXISTS user_feedback (
  id SERIAL PRIMARY KEY,
  feedback_id VARCHAR(50) UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'general', 'bug', 'help', 'feature', 'complaint', 'compliment'
  user_type VARCHAR(20) NOT NULL, -- 'student', 'parent', 'teacher', 'assistant', 'admin', 'visitor'
  user_name VARCHAR(100),
  user_contact VARCHAR(100),
  subject VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  urgency VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
  status VARCHAR(20) DEFAULT 'new', -- 'new', 'read', 'responded', 'resolved'
  admin_response TEXT,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  responded_at TIMESTAMP
);

-- 2. USER REVIEWS TABLE  
CREATE TABLE IF NOT EXISTS user_reviews (
  id SERIAL PRIMARY KEY,
  review_id VARCHAR(50) UNIQUE NOT NULL,
  overall_rating INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
  usability_rating INTEGER CHECK (usability_rating >= 1 AND usability_rating <= 5),
  speed_rating INTEGER CHECK (speed_rating >= 1 AND speed_rating <= 5),
  reviewer_name VARCHAR(100),
  review_text TEXT,
  recommendation VARCHAR(50), -- 'definitely', 'probably', 'maybe', 'probably_not', 'definitely_not'
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. USER SUGGESTIONS TABLE
CREATE TABLE IF NOT EXISTS user_suggestions (
  id SERIAL PRIMARY KEY,
  suggestion_id VARCHAR(50) UNIQUE NOT NULL,
  category VARCHAR(50) NOT NULL, -- 'ui', 'feature', 'performance', 'mobile', 'reporting', 'integration', 'security', 'other'
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  benefit TEXT,
  priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
  suggester_info VARCHAR(200),
  status VARCHAR(20) DEFAULT 'new', -- 'new', 'reviewing', 'planned', 'in_progress', 'completed', 'rejected'
  admin_notes TEXT,
  implementation_date DATE,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. CONTACT REQUESTS TABLE
CREATE TABLE IF NOT EXISTS contact_requests (
  id SERIAL PRIMARY KEY,
  contact_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  contact_info VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'new', -- 'new', 'contacted', 'resolved'
  contact_method VARCHAR(20), -- 'phone', 'email', 'whatsapp'
  contacted_at TIMESTAMP,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 5. CREATE INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_feedback_status ON user_feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_urgency ON user_feedback(urgency);
CREATE INDEX IF NOT EXISTS idx_feedback_type ON user_feedback(type);
CREATE INDEX IF NOT EXISTS idx_feedback_user_type ON user_feedback(user_type);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON user_feedback(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_reviews_rating ON user_reviews(overall_rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON user_reviews(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_suggestions_priority ON user_suggestions(priority);
CREATE INDEX IF NOT EXISTS idx_suggestions_status ON user_suggestions(status);
CREATE INDEX IF NOT EXISTS idx_suggestions_category ON user_suggestions(category);
CREATE INDEX IF NOT EXISTS idx_suggestions_created_at ON user_suggestions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_requests(status);
CREATE INDEX IF NOT EXISTS idx_contact_created_at ON contact_requests(created_at DESC);

-- 6. CREATE VIEWS FOR EASY REPORTING

-- Feedback Summary View
CREATE OR REPLACE VIEW feedback_summary AS
SELECT 
  DATE_TRUNC('day', created_at) as date,
  type as feedback_type,
  user_type,
  urgency,
  COUNT(*) as count,
  COUNT(CASE WHEN status = 'new' THEN 1 END) as new_count,
  COUNT(CASE WHEN status = 'responded' THEN 1 END) as responded_count
FROM user_feedback
GROUP BY DATE_TRUNC('day', created_at), type, user_type, urgency
ORDER BY date DESC;

-- Rating Summary View
CREATE OR REPLACE VIEW rating_summary AS
SELECT 
  DATE_TRUNC('day', created_at) as date,
  AVG(overall_rating) as avg_overall_rating,
  AVG(usability_rating) as avg_usability_rating,
  AVG(speed_rating) as avg_speed_rating,
  COUNT(*) as review_count,
  COUNT(CASE WHEN overall_rating >= 4 THEN 1 END) as positive_reviews,
  COUNT(CASE WHEN overall_rating <= 2 THEN 1 END) as negative_reviews
FROM user_reviews
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date DESC;

-- Suggestion Summary View
CREATE OR REPLACE VIEW suggestion_summary AS
SELECT 
  category,
  priority,
  status,
  COUNT(*) as count,
  AVG(CASE 
    WHEN priority = 'low' THEN 1 
    WHEN priority = 'medium' THEN 2 
    WHEN priority = 'high' THEN 3 
    WHEN priority = 'critical' THEN 4 
    ELSE 2 
  END) as avg_priority_score
FROM user_suggestions
GROUP BY category, priority, status
ORDER BY avg_priority_score DESC;

-- 7. FEEDBACK SYSTEM STATISTICS FUNCTION
CREATE OR REPLACE FUNCTION get_feedback_stats()
RETURNS JSON
LANGUAGE SQL
AS $$
  SELECT json_build_object(
    'total_feedback', (SELECT COUNT(*) FROM user_feedback),
    'total_reviews', (SELECT COUNT(*) FROM user_reviews),
    'total_suggestions', (SELECT COUNT(*) FROM user_suggestions),
    'total_contacts', (SELECT COUNT(*) FROM contact_requests),
    'avg_rating', (SELECT ROUND(AVG(overall_rating), 1) FROM user_reviews),
    'urgent_feedback', (SELECT COUNT(*) FROM user_feedback WHERE urgency = 'urgent' AND status = 'new'),
    'recent_count', (SELECT COUNT(*) FROM user_feedback WHERE created_at >= NOW() - INTERVAL '7 days'),
    'response_rate', (
      SELECT ROUND(
        (COUNT(CASE WHEN status IN ('responded', 'resolved') THEN 1 END)::float / COUNT(*)::float) * 100, 1
      ) FROM user_feedback
    )
  );
$$;

-- 8. SAMPLE DATA FOR TESTING (Optional)
-- Remove this section if you don't want sample data

INSERT INTO user_feedback (feedback_id, type, user_type, user_name, user_contact, subject, message, urgency, status) VALUES
('fb001', 'general', 'parent', 'أم أحمد', '+966501234567', 'النظام ممتاز', 'أشكركم على هذا النظام الرائع', 'low', 'new'),
('fb002', 'bug', 'teacher', 'أستاذ محمد', 'teacher@school.com', 'مشكلة في عرض الدرجات', 'أحياناً لا تظهر الدرجات بشكل صحيح', 'high', 'new'),
('fb003', 'help', 'student', 'طالب G4001', '', 'كيف أغير كلمة المرور؟', 'أريد تغيير كلمة مرور الحساب', 'medium', 'read')
ON CONFLICT (feedback_id) DO NOTHING;

INSERT INTO user_reviews (review_id, overall_rating, usability_rating, speed_rating, reviewer_name, review_text, recommendation) VALUES
('rv001', 5, 5, 4, 'ولي أمر', 'النظام سهل جداً وساعدني في متابعة أطفالي', 'definitely'),
('rv002', 4, 4, 5, 'معلمة سارة', 'النظام سريع ومفيد في إدارة الطلاب', 'definitely'),
('rv003', 3, 3, 3, 'مجهول', 'النظام جيد لكن يحتاج بعض التحسينات', 'maybe')
ON CONFLICT (review_id) DO NOTHING;

INSERT INTO user_suggestions (suggestion_id, category, title, description, priority, suggester_info, status) VALUES
('sg001', 'mobile', 'إضافة إشعارات للجوال', 'أقترح إضافة إشعارات عند إضافة درجات جديدة', 'high', 'ولي أمر', 'planned'),
('sg002', 'ui', 'تحسين ألوان النظام', 'تغيير الألوان لتكون أكثر وضوحاً', 'medium', 'معلم', 'new'),
('sg003', 'feature', 'إضافة نظام رسائل داخلية', 'إمكانية إرسال رسائل بين المعلمين وأولياء الأمور', 'high', 'مدير مدرسة', 'reviewing')
ON CONFLICT (suggestion_id) DO NOTHING;

-- 9. VERIFY TABLES CREATED
SELECT 'Feedback tables created successfully' as status,
  (SELECT COUNT(*) FROM user_feedback) as sample_feedback,
  (SELECT COUNT(*) FROM user_reviews) as sample_reviews,
  (SELECT COUNT(*) FROM user_suggestions) as sample_suggestions;
