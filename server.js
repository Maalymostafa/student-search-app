const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database configuration
let db = null;
let dbType = process.env.DB_TYPE || 'supabase'; // 'supabase' or 'firebase'

// Initialize database based on environment variable
if (dbType === 'supabase') {
  const { createClient } = require('@supabase/supabase-js');
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  
  if (supabaseUrl && supabaseKey) {
    db = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Supabase connected');
  } else {
    console.log('⚠️  Supabase credentials not found');
  }
} else if (dbType === 'firebase') {
  const admin = require('firebase-admin');
  
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    db = admin.firestore();
    console.log('✅ Firebase connected');
  } catch (error) {
    console.log('⚠️  Firebase credentials not found or invalid');
  }
}

// Search endpoint - matches Google Apps Script logic exactly
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

    const sheetPrefix = code.substring(0, 2).toUpperCase(); // أول حرفين من الكود
    const allowedSheets = ['G4', 'G5', 'G6', 'P1'];

    if (!allowedSheets.includes(sheetPrefix)) {
      return res.json({
        success: false,
        message: 'الكود غير صالح أو لا ينتمي لأي مستوى معروف',
        html: '<p style="color: red; font-weight: bold;">الكود غير صالح أو لا ينتمي لأي مستوى معروف</p>'
      });
    }

    let studentData = null;

    if (dbType === 'supabase' && db) {
      studentData = await searchInSupabase(code, sheetPrefix);
    } else if (dbType === 'firebase' && db) {
      studentData = await searchInFirebase(code, sheetPrefix);
    } else {
      // Fallback to mock data for testing
      studentData = getMockData(code, sheetPrefix);
    }

    if (!studentData) {
      return res.json({
        success: false,
        message: 'الكود غير صحيح تاكد من الكود',
        html: '<p style="color: red; font-weight: bold;">الكود غير صحيح تاكد من الكود</p>'
      });
    }

    // Generate HTML for new structure
    result += '<table><thead><tr><th>Name</th><th>Student Code</th></tr></thead><tbody>';
    result += '<tr>' +
            '<td style="font-size: 30px; font-weight: bold;">' + studentData.name + '</td>' +
            '<td style="font-size: 30px; font-weight: bold;">' + studentData.student_code + '</td>' +
          '</tr>';
    result += '</tbody></table>';

    result += createNewPerformanceTable(studentData);
    result += createNewAdditionalInfo(studentData);
    
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

// Supabase search function - matches new database structure
async function searchInSupabase(code, sheetPrefix) {
  try {
    const normalizedInputCode = code.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
    
    // First, find the student
    const { data: studentData, error: studentError } = await db
      .from('students')
      .select('*')
      .ilike('student_code', `%${normalizedInputCode}%`)
      .single();

    if (studentError || !studentData) {
      return null;
    }
    
    // Then get performance data for all months
    const { data: performanceData, error: performanceError } = await db
      .from('student_performance')
      .select('*')
      .eq('student_id', studentData.id)
      .in('month', ['september', 'october', 'november', 'december'])
      .eq('year', new Date().getFullYear());

    if (performanceError) {
      console.error('Performance data error:', performanceError);
    }
    
    // Combine student and performance data
    const result = {
      ...studentData,
      september: {},
      october: {},
      november: {},
      december: {}
    };
    
    // Organize performance data by month
    if (performanceData) {
      performanceData.forEach(perf => {
        result[perf.month] = perf;
      });
    }
    
    return convertToArrayFormat(result);
  } catch (error) {
    console.error('Supabase search error:', error);
    return null;
  }
}

// Firebase search function - matches new database structure
async function searchInFirebase(code, sheetPrefix) {
  try {
    const normalizedInputCode = code.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
    
    // First, find the student
    const studentSnapshot = await db
      .collection('students')
      .where('student_code', '==', normalizedInputCode)
      .limit(1)
      .get();

    if (studentSnapshot.empty) return null;
    
    const studentDoc = studentSnapshot.docs[0];
    const studentData = { id: studentDoc.id, ...studentDoc.data() };
    
    // Then get performance data for all months
    const performanceSnapshot = await db
      .collection('student_performance')
      .where('student_id', '==', studentData.id)
      .where('year', '==', new Date().getFullYear())
      .get();

    // Combine student and performance data
    const result = {
      ...studentData,
      september: {},
      october: {},
      november: {},
      december: {}
    };
    
    // Organize performance data by month
    performanceSnapshot.docs.forEach(doc => {
      const perfData = doc.data();
      result[perfData.month] = perfData;
    });
    
    return convertToArrayFormat(result);
  } catch (error) {
    console.error('Firebase search error:', error);
    return null;
  }
}

// Convert database object to new format
function convertToArrayFormat(data) {
  // New format with detailed session data
  const result = {
    id: data.id || '',
    name: data.name || data.full_name_arabic || '',
    student_code: data.student_code || '',
    is_confirmed: data.is_confirmed || false,
  };

  // Add performance data for each month
  const months = ['september', 'october', 'november', 'december'];
  
  months.forEach(month => {
    // Get performance data for this month
    const monthData = data[month] || {};
    
    // Session data
    for (let session = 1; session <= 4; session++) {
      result[`${month}_session${session}_attendance`] = monthData[`session${session}_attendance`] || 0;
      result[`${month}_session${session}_question1`] = monthData[`session${session}_question1`] || 0;
      result[`${month}_session${session}_question2`] = monthData[`session${session}_question2`] || 0;
      result[`${month}_session${session}_quiz`] = monthData[`session${session}_quiz`] || 0;
    }
    
    // Monthly totals
    result[`${month}_total_attendance`] = monthData.month_total_attendance || 0;
    result[`${month}_total_questions`] = monthData.month_total_questions || 0;
    result[`${month}_total_quiz`] = monthData.month_total_quiz || 0;
    result[`${month}_total_score`] = monthData.month_total_score || 0;
  });
  
  return result;
}

// Mock data for testing - matches new detailed session structure
function getMockData(code, sheetPrefix) {
  // Return data in the new format with detailed session breakdown
  return {
    id: '1',
    name: 'Ahmed Hassan',
    student_code: code,
    is_confirmed: true,
    
    // First Semester - September
    'september_session1_attendance': 1,
    'september_session1_question1': 2,
    'september_session1_question2': 1,
    'september_session1_quiz': 2,
    'september_session2_attendance': 0,
    'september_session2_question1': 1,
    'september_session2_question2': 0,
    'september_session2_quiz': 1,
    'september_session3_attendance': 1,
    'september_session3_question1': 2,
    'september_session3_question2': 2,
    'september_session3_quiz': 2,
    'september_session4_attendance': 1,
    'september_session4_question1': 1,
    'september_session4_question2': 2,
    'september_session4_quiz': 1,
    'september_total_attendance': 3,
    'september_total_questions': 11,
    'september_total_quiz': 6,
    'september_total_score': 20,
    
    // First Semester - October
    'october_session1_attendance': 1,
    'october_session1_question1': 2,
    'october_session1_question2': 2,
    'october_session1_quiz': 2,
    'october_session2_attendance': 1,
    'october_session2_question1': 1,
    'october_session2_question2': 2,
    'october_session2_quiz': 1,
    'october_session3_attendance': 0,
    'october_session3_question1': 0,
    'october_session3_question2': 0,
    'october_session3_quiz': 0,
    'october_session4_attendance': 1,
    'october_session4_question1': 2,
    'october_session4_question2': 1,
    'october_session4_quiz': 2,
    'october_total_attendance': 3,
    'october_total_questions': 8,
    'october_total_quiz': 5,
    'october_total_score': 16,
    
    // First Semester - November
    'november_session1_attendance': 1,
    'november_session1_question1': 2,
    'november_session1_question2': 2,
    'november_session1_quiz': 2,
    'november_session2_attendance': 1,
    'november_session2_question1': 2,
    'november_session2_question2': 2,
    'november_session2_quiz': 2,
    'november_session3_attendance': 1,
    'november_session3_question1': 2,
    'november_session3_question2': 2,
    'november_session3_quiz': 2,
    'november_session4_attendance': 1,
    'november_session4_question1': 2,
    'november_session4_question2': 2,
    'november_session4_quiz': 2,
    'november_total_attendance': 4,
    'november_total_questions': 16,
    'november_total_quiz': 8,
    'november_total_score': 28,
    
    // First Semester - December
    'december_session1_attendance': 1,
    'december_session1_question1': 2,
    'december_session1_question2': 2,
    'december_session1_quiz': 2,
    'december_session2_attendance': 1,
    'december_session2_question1': 2,
    'december_session2_question2': 2,
    'december_session2_quiz': 2,
    'december_session3_attendance': 1,
    'december_session3_question1': 2,
    'december_session3_question2': 2,
    'december_session3_quiz': 2,
    'december_session4_attendance': 1,
    'december_session4_question1': 2,
    'december_session4_question2': 2,
    'december_session4_quiz': 2,
    'december_total_attendance': 4,
    'december_total_questions': 16,
    'december_total_quiz': 8,
    'december_total_score': 28,
  };
}

// Generate performance table - exactly like Google Apps Script
function createPerformanceTable(rowData) {
  return `
    <table>
      <thead>
        <tr>
          <th rowspan="2" style="font-size: 18px; font-weight: bold;">Month</th>
          <th colspan="2" style="font-size: 18px; font-weight: bold;">Session 1</th>
          <th colspan="2" style="font-size: 18px; font-weight: bold;">Session 2</th>
          <th colspan="2" style="font-size: 18px; font-weight: bold;">Session 3</th>
          <th colspan="2" style="font-size: 18px; font-weight: bold;">Session 4</th>
          <th rowspan="2" style="font-size: 18px; font-weight: bold;">Final Evaluation</th>
        </tr>
        <tr>
          <th style="font-size: 16px; font-weight: bold;">Perf.</th>
          <th style="font-size: 16px; font-weight: bold;">Quiz</th>
          <th style="font-size: 16px; font-weight: bold;">Perf.</th>
          <th style="font-size: 16px; font-weight: bold;">Quiz</th>
          <th style="font-size: 16px; font-weight: bold;">Perf.</th>
          <th style="font-size: 16px; font-weight: bold;">Quiz</th>
          <th style="font-size: 16px; font-weight: bold;">Perf.</th>
          <th style="font-size: 16px; font-weight: bold;">Quiz</th>
        </tr>
      </thead>
      <tbody>
        ${renderMonthRow("September", rowData, 7)}
        ${renderMonthRow("October", rowData, 18)}
        ${renderMonthRow("November", rowData, 29)}
        ${renderMonthRow("December", rowData, 40)}
      </tbody>
    </table>
  `;
}

// Render month row - exactly like Google Apps Script
function renderMonthRow(month, rowData, startIndex) {
  return `
    <tr>
      <td>${month}</td>
      <td>${rowData[startIndex]   || ''}</td><td>${rowData[startIndex + 1] || ''}</td>
      <td>${rowData[startIndex + 2] || ''}</td><td>${rowData[startIndex + 3] || ''}</td>
      <td>${rowData[startIndex + 4] || ''}</td><td>${rowData[startIndex + 5] || ''}</td>
      <td>${rowData[startIndex + 6] || ''}</td><td>${rowData[startIndex + 7] || ''}</td>
      <td>${rowData[startIndex + 8] || ''}</td>
    </tr>
  `;
}

// Additional info - exactly like Google Apps Script
function additionalInfo(rowData) {
  const isConfirmed = rowData[2] === true || rowData[2] === "TRUE";
  
  return `
<p style="color: ${isConfirmed ? 'green' : 'red'}; font-weight: bold; font-size: 50px;">
  ${isConfirmed ? 'تم تأكيد الحجز' : 'لم يتم تأكيد الحجز بعد'}
</p>
  `;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    database: dbType,
    connected: !!db,
    timestamp: new Date().toISOString()
  });
});

// Student registration endpoint
app.post('/api/register-student', async (req, res) => {
  try {
    const {
      full_name_arabic,
      grade_level,
      student_number,
      parent_number,
      subscription_type,
      transfer_phone,
      whatsapp_phone,
      transfer_date,
      transfer_time,
      notes
    } = req.body;

    // Validate required fields
    if (!full_name_arabic || !grade_level || !student_number || !parent_number || !subscription_type || !transfer_phone || !whatsapp_phone || !transfer_date || !transfer_time) {
      return res.json({
        success: false,
        message: 'جميع الحقول المطلوبة يجب ملؤها'
      });
    }

    // Generate student code based on grade level
    const gradePrefix = grade_level === 'Grade 4' ? 'G4' : 
                       grade_level === 'Grade 5' ? 'G5' : 
                       grade_level === 'Grade 6' ? 'G6' : 
                       grade_level === 'Prep 1' ? 'P1' : 'G4';

    // Get current count for this grade to generate unique code
    let studentCode;
    if (dbType === 'supabase' && db) {
      const { data: existingStudents, error } = await db
        .from('students')
        .select('student_code')
        .like('student_code', `${gradePrefix}%`);

      if (error) {
        console.error('Error getting existing students:', error);
        return res.json({
          success: false,
          message: 'حدث خطأ في إنشاء كود الطالب'
        });
      }

      const nextNumber = (existingStudents?.length || 0) + 1;
      studentCode = `${gradePrefix}${String(nextNumber).padStart(3, '0')}`;
    } else {
      // Fallback for demo mode
      studentCode = `${gradePrefix}001`;
    }

    // Insert student data
    if (dbType === 'supabase' && db) {
      const { error } = await db
        .from('students')
        .insert({
          student_code: studentCode,
          full_name_arabic,
          grade_level,
          student_number,
          parent_number,
          subscription_type,
          transfer_phone,
          whatsapp_phone,
          transfer_time,
          transfer_date,
          notes,
          is_confirmed: false,
          enrollment_date: transfer_date,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error inserting student:', error);
        return res.json({
          success: false,
          message: 'حدث خطأ في تسجيل الطالب'
        });
      }
    }

    res.json({
      success: true,
      message: 'تم تسجيل الطالب بنجاح',
      student_code: studentCode
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.json({
      success: false,
      message: 'حدث خطأ في التسجيل'
    });
  }
});

// Serve registration form
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'registration.html'));
});

// Serve main page with login options
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'startup.html'));
});

// Serve standalone demo page
app.get('/demo', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'standalone.html'));
});

// Serve student login
app.get('/student-login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'student-login.html'));
});

// Serve student results
app.get('/student-results', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'student-results.html'));
});

// Serve parent login
app.get('/parent-login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'parent-login.html'));
});

// Serve parent dashboard
app.get('/parent-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'parent-dashboard.html'));
});

// Serve subject selection
app.get('/subject-selection', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'subject-selection.html'));
});

// Serve subject results
app.get('/subject-results', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'subject-results.html'));
});

// Serve test subject selection
app.get('/test-subject-selection', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'test-subject-selection.html'));
});

// Serve admin login
app.get('/admin-login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin-login.html'));
});

// Serve admin dashboard
app.get('/admin-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin-dashboard.html'));
});

// Student login API
app.post('/api/student-login', async (req, res) => {
  try {
    const { student_code, phone_number, choice } = req.body;

    if (!student_code || !phone_number) {
      return res.json({
        success: false,
        message: 'Student code and phone number are required'
      });
    }

    // Verify student exists and phone matches
    if (dbType === 'supabase' && db) {
      try {
        const { data: student, error } = await db
          .from('students')
          .select('*')
          .eq('student_code', student_code)
          .eq('whatsapp_phone', phone_number)
          .single();

        if (error || !student) {
          // Fall back to demo mode if database query fails
          if (student_code.match(/^[GP][1-6]\d{3}$/) && phone_number.length >= 10) {
            return res.json({
              success: true,
              message: 'Login successful (demo mode)',
              demo: true
            });
          } else {
            return res.json({
              success: false,
              message: 'Invalid student code or phone number'
            });
          }
        }

        res.json({
          success: true,
          message: 'Login successful',
          student: student
        });
      } catch (dbError) {
        // Fall back to demo mode if database connection fails
        if (student_code.match(/^[GP][1-6]\d{3}$/) && phone_number.length >= 10) {
          res.json({
            success: true,
            message: 'Login successful (demo mode)',
            demo: true
          });
        } else {
          res.json({
            success: false,
            message: 'Invalid student code or phone number'
          });
        }
      }
    } else {
      // Demo mode - accept any valid format
      if (student_code.match(/^[GP][1-6]\d{3}$/) && phone_number.length >= 10) {
        res.json({
          success: true,
          message: 'Login successful (demo mode)',
          demo: true
        });
      } else {
        res.json({
          success: false,
          message: 'Invalid student code or phone number'
        });
      }
    }
  } catch (error) {
    console.error('Student login error:', error);
    res.json({
      success: false,
      message: 'Login failed'
    });
  }
});

// Parent login API
app.post('/api/parent-login', async (req, res) => {
  try {
    const { parent_phone } = req.body;

    if (!parent_phone) {
      return res.json({
        success: false,
        message: 'Parent phone number is required'
      });
    }

    // Find children by parent phone
    if (dbType === 'supabase' && db) {
      try {
        const { data: children, error } = await db
          .from('students')
          .select('*')
          .eq('parent_number', parent_phone);

        if (error) {
          // Fall back to demo mode if database query fails
          return res.json({
            success: true,
            message: 'Login successful (demo mode)',
            demo: true,
            children: [
              { student_code: 'G4001', full_name_arabic: 'فارس سامح عيد سالم', grade_level: 'Grade 4' },
              { student_code: 'G5001', full_name_arabic: 'رقيه إسلام جميل قطب', grade_level: 'Grade 5' }
            ]
          });
        }

        if (!children || children.length === 0) {
          // Fall back to demo mode if no children found
          return res.json({
            success: true,
            message: 'Login successful (demo mode)',
            demo: true,
            children: [
              { student_code: 'G4001', full_name_arabic: 'فارس سامح عيد سالم', grade_level: 'Grade 4' },
              { student_code: 'G5001', full_name_arabic: 'رقيه إسلام جميل قطب', grade_level: 'Grade 5' }
            ]
          });
        }

        res.json({
          success: true,
          message: 'Login successful',
          children: children
        });
      } catch (dbError) {
        // Fall back to demo mode if database connection fails
        res.json({
          success: true,
          message: 'Login successful (demo mode)',
          demo: true,
          children: [
            { student_code: 'G4001', full_name_arabic: 'فارس سامح عيد سالم', grade_level: 'Grade 4' },
            { student_code: 'G5001', full_name_arabic: 'رقيه إسلام جميل قطب', grade_level: 'Grade 5' }
          ]
        });
      }
    } else {
      // Demo mode - accept any phone number
      res.json({
        success: true,
        message: 'Login successful (demo mode)',
        demo: true,
        children: [
          { student_code: 'G4001', full_name_arabic: 'فارس سامح عيد سالم', grade_level: 'Grade 4' },
          { student_code: 'G5001', full_name_arabic: 'رقيه إسلام جميل قطب', grade_level: 'Grade 5' }
        ]
      });
    }
  } catch (error) {
    console.error('Parent login error:', error);
    res.json({
      success: false,
      message: 'Login failed'
    });
  }
});

// New HTML generation functions for the updated structure
function createNewPerformanceTable(studentData) {
  let html = '<div style="margin: 20px 0; overflow-x: auto;">';
  html += '<table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">';
  
  // Header row 1
  html += '<tr style="background-color: #0288D1; color: white;">';
  html += '<th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Month</th>';
  html += '<th style="padding: 8px; border: 1px solid #ddd; text-align: center;">Session 1</th>';
  html += '<th style="padding: 8px; border: 1px solid #ddd; text-align: center;">Session 2</th>';
  html += '<th style="padding: 8px; border: 1px solid #ddd; text-align: center;">Session 3</th>';
  html += '<th style="padding: 8px; border: 1px solid #ddd; text-align: center;">Session 4</th>';
  html += '<th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Monthly Total</th>';
  html += '</tr>';
  
  // Header row 2
  html += '<tr style="background-color: #0288D1; color: white;">';
  html += '<th style="padding: 12px; border: 1px solid #ddd; text-align: center;"></th>';
  html += '<th style="padding: 4px; border: 1px solid #ddd; text-align: center; font-size: 12px;">Att.<br>Q1<br>Q2<br>Quiz</th>';
  html += '<th style="padding: 4px; border: 1px solid #ddd; text-align: center; font-size: 12px;">Att.<br>Q1<br>Q2<br>Quiz</th>';
  html += '<th style="padding: 4px; border: 1px solid #ddd; text-align: center; font-size: 12px;">Att.<br>Q1<br>Q2<br>Quiz</th>';
  html += '<th style="padding: 4px; border: 1px solid #ddd; text-align: center; font-size: 12px;">Att.<br>Q1<br>Q2<br>Quiz</th>';
  html += '<th style="padding: 4px; border: 1px solid #ddd; text-align: center; font-size: 12px;">Att.<br>Ques.<br>Quiz<br>Total</th>';
  html += '</tr>';
  
  // Data rows
  const months = [
    { name: 'September', key: 'september' },
    { name: 'October', key: 'october' },
    { name: 'November', key: 'november' },
    { name: 'December', key: 'december' }
  ];
  
  months.forEach(month => {
    html += '<tr>';
    html += `<td style="padding: 12px; border: 1px solid #ddd; text-align: center; font-weight: 600; font-size: 16px;">${month.name}</td>`;
    
    // Sessions 1-4
    for (let session = 1; session <= 4; session++) {
      const attendance = studentData[`${month.key}_session${session}_attendance`] || 0;
      const q1 = studentData[`${month.key}_session${session}_question1`] || 0;
      const q2 = studentData[`${month.key}_session${session}_question2`] || 0;
      const quiz = studentData[`${month.key}_session${session}_quiz`] || 0;
      
      html += `<td style="padding: 4px; border: 1px solid #ddd; text-align: center; font-size: 12px;">`;
      html += `<div style="color: ${attendance === 1 ? 'green' : 'red'};">${attendance}</div>`;
      html += `<div style="color: ${q1 === 2 ? 'green' : q1 === 1 ? 'orange' : 'red'};">${q1}</div>`;
      html += `<div style="color: ${q2 === 2 ? 'green' : q2 === 1 ? 'orange' : 'red'};">${q2}</div>`;
      html += `<div style="color: ${quiz === 2 ? 'green' : quiz === 1 ? 'orange' : 'red'};">${quiz}</div>`;
      html += '</td>';
    }
    
    // Monthly totals
    const totalAttendance = studentData[`${month.key}_total_attendance`] || 0;
    const totalQuestions = studentData[`${month.key}_total_questions`] || 0;
    const totalQuiz = studentData[`${month.key}_total_quiz`] || 0;
    const totalScore = studentData[`${month.key}_total_score`] || 0;
    
    html += `<td style="padding: 4px; border: 1px solid #ddd; text-align: center; font-size: 12px; font-weight: bold; color: #00838F;">`;
    html += `<div>${totalAttendance}</div>`;
    html += `<div>${totalQuestions}</div>`;
    html += `<div>${totalQuiz}</div>`;
    html += `<div>${totalScore}</div>`;
    html += '</td>';
    
    html += '</tr>';
  });
  
  // Overall totals row
  const overallTotal = (studentData.september_total_score || 0) + 
                      (studentData.october_total_score || 0) + 
                      (studentData.november_total_score || 0) + 
                      (studentData.december_total_score || 0);
  
  html += '<tr style="background-color: #E3F2FD;">';
  html += '<td style="padding: 12px; border: 1px solid #ddd; text-align: center; font-weight: bold; font-size: 16px; color: #00838F;">OVERALL</td>';
  html += '<td colspan="4" style="border: 1px solid #ddd;"></td>';
  html += `<td style="padding: 8px; border: 1px solid #ddd; text-align: center; font-weight: bold; color: #00838F;">`;
  html += `<div>Total Score: ${overallTotal}</div>`;
  html += `<div style="font-size: 16px; color: #0288D1;">Grade: ${getGradeFromScore(overallTotal)}</div>`;
  html += '</td>';
  html += '</tr>';
  
  html += '</table>';
  html += '</div>';
  
  // Add Detailed Session Results Section
  html += createDetailedSessionResults(studentData);
  
  return html;
}

function createDetailedSessionResults(studentData) {
  let html = '<div style="margin: 30px 0; padding: 20px; background-color: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">';
  
  // Section Header
  html += '<div style="background-color: #00838F; color: white; padding: 16px; border-radius: 12px 12px 0 0; margin: -20px -20px 20px -20px;">';
  html += '<h2 style="margin: 0; text-align: center; font-size: 18px; font-weight: bold;">Detailed Session Results</h2>';
  html += '</div>';
  
  const months = [
    { name: 'September', key: 'september' },
    { name: 'October', key: 'october' },
    { name: 'November', key: 'november' },
    { name: 'December', key: 'december' }
  ];
  
  months.forEach(month => {
    const monthScore = studentData[`${month.key}_total_score`] || 0;
    const monthGrade = getGradeFromScore(monthScore);
    
    html += '<div style="margin-bottom: 20px; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">';
    
    // Month Header
    html += '<div style="background-color: #E3F2FD; padding: 12px; display: flex; justify-content: space-between; align-items: center;">';
    html += `<h3 style="margin: 0; font-size: 16px; font-weight: bold; color: #00838F;">${month.name}</h3>`;
    html += '<div style="display: flex; align-items: center; gap: 8px;">';
    html += `<span style="font-weight: 600; font-size: 14px;">Score: ${monthScore}</span>`;
    html += `<span style="background-color: ${getGradeColor(monthGrade)}; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 12px;">Grade: ${monthGrade}</span>`;
    html += '</div>';
    html += '</div>';
    
    // Sessions Details
    html += '<div style="padding: 16px;">';
    
    for (let session = 1; session <= 4; session++) {
      const attendance = studentData[`${month.key}_session${session}_attendance`] || 0;
      const q1 = studentData[`${month.key}_session${session}_question1`] || 0;
      const q2 = studentData[`${month.key}_session${session}_question2`] || 0;
      const quiz = studentData[`${month.key}_session${session}_quiz`] || 0;
      const sessionTotal = attendance + q1 + q2 + quiz;
      
      html += '<div style="margin-bottom: 12px; padding: 12px; background-color: #f8f9fa; border-radius: 8px; border: 1px solid #e9ecef;">';
      
      // Session Header
      html += '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">';
      html += `<h4 style="margin: 0; font-size: 14px; font-weight: bold; color: #0277BD;">Session ${session}</h4>`;
      html += `<span style="background-color: ${getScoreColor(sessionTotal)}; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 12px;">Total: ${sessionTotal}/7</span>`;
      html += '</div>';
      
      // Session Details Grid
      html += '<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;">';
      
      html += createDetailItem('Attendance', attendance, 1);
      html += createDetailItem('Question 1', q1, 2);
      html += createDetailItem('Question 2', q2, 2);
      html += createDetailItem('Quiz', quiz, 2);
      
      html += '</div>';
      html += '</div>';
    }
    
    html += '</div>';
    html += '</div>';
  });
  
  html += '</div>';
  return html;
}

function createDetailItem(label, score, maxScore) {
  const color = score >= 2 ? 'green' : score >= 1 ? 'orange' : 'red';
  return `<div style="text-align: center; padding: 8px; background-color: white; border-radius: 6px; border: 1px solid #dee2e6;">
    <div style="font-size: 11px; font-weight: 500; color: #6c757d; margin-bottom: 4px;">${label}</div>
    <div style="font-size: 14px; font-weight: bold; color: ${color};">${score}/${maxScore}</div>
  </div>`;
}

function getScoreColor(score) {
  if (score >= 6) return 'green';
  if (score >= 4) return 'orange';
  return 'red';
}

function getGradeColor(grade) {
  switch (grade) {
    case 'A': return 'green';
    case 'B+': return 'lightgreen';
    case 'B': return 'blue';
    case 'C+': return 'orange';
    case 'C': return 'deeporange';
    default: return 'red';
  }
}

function createNewAdditionalInfo(studentData) {
  let html = '<div style="margin: 20px 0; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">';
  html += '<h3 style="margin: 0 0 15px 0; color: #333;">Student Information</h3>';
  
  // Basic info
  html += '<div style="margin-bottom: 15px;">';
  html += '<strong>Student Code:</strong> ' + (studentData.student_code || 'N/A') + '<br>';
  html += '<strong>Name:</strong> ' + (studentData.name || 'N/A') + '<br>';
  html += '<strong>Status:</strong> ' + (studentData.is_confirmed ? 'Confirmed' : 'Pending') + '<br>';
  html += '</div>';
  
  // Performance summary
  const totalScore = (studentData.september_total_score || 0) + 
                    (studentData.october_total_score || 0) + 
                    (studentData.november_total_score || 0) + 
                    (studentData.december_total_score || 0);
  
  html += '<div style="margin-top: 15px; padding: 15px; background-color: white; border-radius: 6px; border-left: 4px solid #007bff;">';
  html += '<h4 style="margin: 0 0 10px 0; color: #007bff;">Performance Summary</h4>';
  html += '<strong>Total Score:</strong> ' + totalScore + '<br>';
  html += '<strong>Overall Grade:</strong> ' + getGradeFromScore(totalScore) + '<br>';
  html += '<strong>Average Monthly Score:</strong> ' + Math.round(totalScore / 4) + '<br>';
  html += '</div>';
  
  html += '</div>';
  return html;
}

function getGradeFromScore(score) {
  if (score >= 100) return 'A';
  if (score >= 80) return 'B+';
  if (score >= 60) return 'B';
  if (score >= 40) return 'C+';
  if (score >= 20) return 'C';
  return 'D';
}

// Serve static files after specific routes
app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Database type: ${dbType}`);
  console.log(`🌐 Visit: http://localhost:${PORT}`);
});
