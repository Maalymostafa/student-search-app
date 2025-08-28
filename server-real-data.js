const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Database configuration
let db = null;
let dbType = process.env.DB_TYPE || 'supabase';

// Initialize database based on environment variable
if (dbType === 'supabase') {
  const { createClient } = require('@supabase/supabase-js');
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  
  if (supabaseUrl && supabaseKey) {
    db = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Real Data Supabase connected');
  } else {
    console.log('⚠️  Supabase credentials not found');
  }
}

// Enhanced search endpoint for real data
app.post('/api/search', async (req, res) => {
  try {
    const { code } = req.body;
    let result = '';

    if (!code || code.length < 2) {
      return res.json({
        success: false,
        message: 'برجاء كتابة الكود',
        html: '<p style="color: red; font-weight: bold;">برجاء كتابة الكود</p>'
      });
    }

    let studentData = null;

    if (dbType === 'supabase' && db) {
      studentData = await searchStudentByCode(code);
    } else {
      studentData = getMockData(code);
    }

    if (!studentData) {
      return res.json({
        success: false,
        message: 'الكود غير صحيح تاكد من الكود',
        html: '<p style="color: red; font-weight: bold;">الكود غير صحيح تاكد من الكود</p>'
      });
    }

    // Generate enhanced HTML with real data structure
    result += '<table style="width: 100%; margin-bottom: 20px; border-collapse: collapse;">';
    result += '<thead><tr style="background: #f8f9fa;">';
    result += '<th style="padding: 12px; border: 1px solid #ddd; text-align: right;">الاسم</th>';
    result += '<th style="padding: 12px; border: 1px solid #ddd; text-align: right;">الكود</th>';
    result += '<th style="padding: 12px; border: 1px solid #ddd; text-align: right;">المرحلة</th>';
    result += '<th style="padding: 12px; border: 1px solid #ddd; text-align: right;">الحالة</th>';
    result += '</tr></thead><tbody>';
    result += '<tr>';
    result += '<td style="padding: 12px; border: 1px solid #ddd; font-size: 18px; font-weight: bold;">' + studentData.full_name_arabic + '</td>';
    result += '<td style="padding: 12px; border: 1px solid #ddd; font-size: 18px; font-weight: bold;">' + studentData.student_code + '</td>';
    result += '<td style="padding: 12px; border: 1px solid #ddd; font-size: 16px;">' + studentData.grade_level + '</td>';
    result += '<td style="padding: 12px; border: 1px solid #ddd; font-size: 16px; color: ' + (studentData.is_confirmed ? 'green' : 'red') + ';">' + 
              (studentData.is_confirmed ? 'مؤكد' : 'غير مؤكد') + '</td>';
    result += '</tr>';
    result += '</tbody></table>';

    // Add student information section
    result += '<div style="margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; border-right: 4px solid #007bff;">';
    result += '<h3 style="margin: 0 0 15px 0; color: #333; text-align: right;">معلومات الطالب</h3>';
    result += '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; text-align: right;">';
    
    if (studentData.whatsapp_phone) {
      result += '<div><strong>رقم الواتساب:</strong> ' + studentData.whatsapp_phone + '</div>';
    }
    if (studentData.subscription_type) {
      result += '<div><strong>نوع الاشتراك:</strong> ' + studentData.subscription_type + '</div>';
    }
    if (studentData.enrollment_date) {
      result += '<div><strong>تاريخ التسجيل:</strong> ' + formatDate(studentData.enrollment_date) + '</div>';
    }
    if (studentData.transfer_date) {
      result += '<div><strong>تاريخ التحويل:</strong> ' + formatDate(studentData.transfer_date) + '</div>';
    }
    
    result += '</div></div>';

    // Add performance data if available
    if (studentData.performance) {
      result += createPerformanceTable(studentData.performance);
    }

    // Add subscription information
    if (studentData.subscription) {
      result += createSubscriptionInfo(studentData.subscription);
    }
    
    res.json({
      success: true,
      data: studentData,
      html: result
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في البحث',
      html: '<p style="color: red; font-weight: bold;">حدث خطأ في البحث</p>'
    });
  }
});

// Search student by code
async function searchStudentByCode(code) {
  try {
    const { data, error } = await db
      .from('students')
      .select(`
        *,
        student_performance(*),
        subscriptions(*)
      `)
      .ilike('student_code', `%${code}%`)
      .single();

    if (error) throw error;
    
    if (data) {
      return {
        ...data,
        performance: data.student_performance || [],
        subscription: data.subscriptions?.[0] || null
      };
    }
    return null;
  } catch (error) {
    console.error('Database search error:', error);
    return null;
  }
}

// Analytics endpoint for real data
app.get('/api/analytics', async (req, res) => {
  try {
    if (dbType !== 'supabase' || !db) {
      return res.status(400).json({
        success: false,
        message: 'Analytics only available with Supabase database'
      });
    }

    // Get student summary data
    const { data: students, error } = await db
      .from('student_summary')
      .select('*');

    if (error) throw error;

    // Calculate analytics
    const analytics = {
      total_students: students.length,
      confirmed_students: students.filter(s => s.is_confirmed).length,
      pending_confirmation: students.filter(s => !s.is_confirmed).length,
      grade_distribution: {},
      subscription_distribution: {},
      recent_enrollments: 0,
      monthly_revenue: 0
    };

    // Grade distribution
    students.forEach(student => {
      const grade = student.grade_level;
      analytics.grade_distribution[grade] = (analytics.grade_distribution[grade] || 0) + 1;
    });

    // Subscription distribution
    students.forEach(student => {
      const subscription = student.subscription_type;
      analytics.subscription_distribution[subscription] = (analytics.subscription_distribution[subscription] || 0) + 1;
    });

    // Recent enrollments (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    analytics.recent_enrollments = students.filter(student => 
      new Date(student.created_at) > thirtyDaysAgo
    ).length;

    // Calculate monthly revenue
    students.forEach(student => {
      if (student.subscription_type.includes('شهري')) {
        analytics.monthly_revenue += 120;
      } else if (student.subscription_type.includes('الترم')) {
        analytics.monthly_revenue += 600 / 3; // Divide term payment by 3 months
      }
    });

    res.json({
      success: true,
      analytics
    });

  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating analytics'
    });
  }
});

// Student management endpoints
app.post('/api/students', async (req, res) => {
  try {
    const studentData = req.body;
    
    if (!studentData.full_name_arabic || !studentData.grade_level) {
      return res.status(400).json({
        success: false,
        message: 'Student name and grade level are required'
      });
    }

    if (dbType === 'supabase' && db) {
      // Generate student code
      const gradePrefix = studentData.grade_level === 'Prep 1' ? 'P1' : 
                         studentData.grade_level.replace('Grade ', 'G');
      
      const { count } = await db
        .from('students')
        .select('*', { count: 'exact', head: true })
        .eq('grade_level', studentData.grade_level);

      const studentNumber = (count || 0) + 1;
      const studentCode = `${gradePrefix}${studentNumber.toString().padStart(3, '0')}`;

      const studentRecord = {
        ...studentData,
        student_code: studentCode,
        enrollment_date: studentData.enrollment_date || new Date().toISOString().split('T')[0]
      };

      const { data, error } = await db
        .from('students')
        .insert(studentRecord)
        .select()
        .single();

      if (error) throw error;

      res.json({
        success: true,
        data
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Database not configured for write operations'
      });
    }

  } catch (error) {
    console.error('Add student error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding student'
    });
  }
});

// Get all students
app.get('/api/students', async (req, res) => {
  try {
    const { grade_level, is_confirmed } = req.query;
    
    let query = db.from('student_summary').select('*');
    
    if (grade_level) {
      query = query.eq('grade_level', grade_level);
    }
    
    if (is_confirmed !== undefined) {
      query = query.eq('is_confirmed', is_confirmed === 'true');
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;

    res.json({
      success: true,
      data
    });

  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching students'
    });
  }
});

// Update student
app.put('/api/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    if (dbType === 'supabase' && db) {
      const { data, error } = await db
        .from('students')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      res.json({
        success: true,
        data
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Database not configured for write operations'
      });
    }

  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating student'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    database: dbType,
    connected: !!db,
    timestamp: new Date().toISOString()
  });
});

// Helper functions
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ar-EG');
}

function createPerformanceTable(performance) {
  if (!performance || performance.length === 0) return '';
  
  let result = '<div style="margin: 20px 0;">';
  result += '<h3 style="text-align: right; color: #333;">سجل الأداء</h3>';
  result += '<table style="width: 100%; border-collapse: collapse;">';
  result += '<thead><tr style="background: #f8f9fa;">';
  result += '<th style="padding: 8px; border: 1px solid #ddd; text-align: right;">الشهر</th>';
  result += '<th style="padding: 8px; border: 1px solid #ddd; text-align: right;">الجلسة 1</th>';
  result += '<th style="padding: 8px; border: 1px solid #ddd; text-align: right;">الجلسة 2</th>';
  result += '<th style="padding: 8px; border: 1px solid #ddd; text-align: right;">الجلسة 3</th>';
  result += '<th style="padding: 8px; border: 1px solid #ddd; text-align: right;">الجلسة 4</th>';
  result += '<th style="padding: 8px; border: 1px solid #ddd; text-align: right;">التقييم النهائي</th>';
  result += '</tr></thead><tbody>';
  
  performance.forEach(record => {
    result += '<tr>';
    result += '<td style="padding: 8px; border: 1px solid #ddd; text-align: right;">' + record.month + '</td>';
    result += '<td style="padding: 8px; border: 1px solid #ddd; text-align: center;">' + (record.session1_perf || '-') + '</td>';
    result += '<td style="padding: 8px; border: 1px solid #ddd; text-align: center;">' + (record.session2_perf || '-') + '</td>';
    result += '<td style="padding: 8px; border: 1px solid #ddd; text-align: center;">' + (record.session3_perf || '-') + '</td>';
    result += '<td style="padding: 8px; border: 1px solid #ddd; text-align: center;">' + (record.session4_perf || '-') + '</td>';
    result += '<td style="padding: 8px; border: 1px solid #ddd; text-align: center;">' + (record.final_evaluation || '-') + '</td>';
    result += '</tr>';
  });
  
  result += '</tbody></table></div>';
  return result;
}

function createSubscriptionInfo(subscription) {
  if (!subscription) return '';
  
  let result = '<div style="margin: 20px 0; padding: 15px; background: #e8f5e8; border-radius: 8px; border-right: 4px solid #28a745;">';
  result += '<h3 style="margin: 0 0 15px 0; color: #333; text-align: right;">معلومات الاشتراك</h3>';
  result += '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; text-align: right;">';
  result += '<div><strong>نوع الاشتراك:</strong> ' + subscription.subscription_type + '</div>';
  result += '<div><strong>المبلغ:</strong> ' + subscription.amount + ' ج.م</div>';
  result += '<div><strong>تاريخ البداية:</strong> ' + formatDate(subscription.start_date) + '</div>';
  result += '<div><strong>تاريخ الانتهاء:</strong> ' + formatDate(subscription.end_date) + '</div>';
  result += '<div><strong>الحالة:</strong> <span style="color: ' + (subscription.status === 'active' ? 'green' : 'red') + ';">' + 
            (subscription.status === 'active' ? 'نشط' : 'منتهي') + '</span></div>';
  result += '</div></div>';
  return result;
}

// Mock data function
function getMockData(code) {
  const mockData = {
    'G4001': {
      student_code: 'G4001',
      full_name_arabic: 'فارس سامح عيد سالم',
      grade_level: 'Grade 4',
      subscription_type: 'اشتراك شهري 120ج',
      whatsapp_phone: '1093216126',
      is_confirmed: true,
      enrollment_date: '2025-08-10'
    },
    'G5001': {
      student_code: 'G5001',
      full_name_arabic: 'رقيه إسلام جميل قطب',
      grade_level: 'Grade 5',
      subscription_type: 'اشتراك شهري 120ج',
      whatsapp_phone: '01286051077',
      is_confirmed: true,
      enrollment_date: '2025-08-07'
    }
  };
  
  return mockData[code] || null;
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Real Data Server running on port ${PORT}`);
  console.log(`📊 Database type: ${dbType}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📈 Analytics: http://localhost:${PORT}/api/analytics`);
  console.log(`👥 Students API: http://localhost:${PORT}/api/students`);
});

module.exports = app;


