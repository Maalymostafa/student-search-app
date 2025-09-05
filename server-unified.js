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
let dbType = process.env.DB_TYPE || 'supabase';

// Initialize database based on environment variable
if (dbType === 'supabase') {
  const { createClient } = require('@supabase/supabase-js');
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  
  if (supabaseUrl && supabaseKey) {
    db = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Supabase connected (Unified Schema)');
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
    console.log('✅ Firebase connected (Unified Schema)');
  } catch (error) {
    console.log('⚠️  Firebase credentials not found or invalid');
  }
}

// IMPROVED: Unified search function for Supabase
async function searchInSupabaseUnified(code, sheetPrefix) {
  try {
    // First try unified table
    const { data: unifiedData, error: unifiedError } = await db
      .from('students_unified')
      .select('*')
      .eq('student_code', code)
      .single();
      
    if (!unifiedError && unifiedData) {
      console.log('✅ Found in unified table:', code);
      return unifiedData;
    }
    
    // Fallback to legacy tables
    const tableName = sheetPrefix.toLowerCase();
    const { data, error } = await db
      .from(tableName)
      .select('*')
      .eq('student_code', code)
      .single();
      
    if (error) {
      console.log(`⚠️  Student not found in ${tableName}:`, code);
      return null;
    }
    
    console.log('✅ Found in legacy table:', tableName, code);
    return data;
  } catch (error) {
    console.error('Database search error:', error);
    return null;
  }
}

// IMPROVED: Unified search function for Firebase  
async function searchInFirebaseUnified(code, sheetPrefix) {
  try {
    // First try unified collection
    const unifiedSnapshot = await db.collection('students_unified')
      .where('student_code', '==', code)
      .limit(1)
      .get();
      
    if (!unifiedSnapshot.empty) {
      const data = unifiedSnapshot.docs[0].data();
      data.id = unifiedSnapshot.docs[0].id;
      console.log('✅ Found in unified collection:', code);
      return data;
    }
    
    // Fallback to legacy collections
    const collectionName = sheetPrefix.toLowerCase();
    const snapshot = await db.collection(collectionName)
      .where('student_code', '==', code)
      .limit(1)
      .get();
      
    if (snapshot.empty) {
      console.log(`⚠️  Student not found in ${collectionName}:`, code);
      return null;
    }
    
    const data = snapshot.docs[0].data();
    data.id = snapshot.docs[0].id;
    console.log('✅ Found in legacy collection:', collectionName, code);
    return data;
  } catch (error) {
    console.error('Firebase search error:', error);
    return null;
  }
}

// API ENDPOINTS

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    version: '2.0-unified',
    database: dbType,
    timestamp: new Date().toISOString()
  });
});

// Search endpoint - UNIFIED VERSION
app.get('/api/search', async (req, res) => {
  res.json({
    message: "Student Search API - Unified Schema",
    version: "2.0",
    usage: "POST to this endpoint with student code",
    example: { code: "G4001" },
    improvements: [
      "✅ Unified database schema",
      "✅ Better error handling", 
      "✅ Backwards compatibility",
      "✅ Performance optimized"
    ]
  });
});

app.post('/api/search', async (req, res) => {
  try {
    const { code } = req.body;

    if (!code || code.length < 2) {
      return res.json({
        success: false,
        message: 'برجاء كتابة الكود',
        html: '<p style="color: red; font-weight: bold;">برجاء كتابة الكود</p>'
      });
    }

    const sheetPrefix = code.substring(0, 2).toUpperCase();
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
      studentData = await searchInSupabaseUnified(code, sheetPrefix);
    } else if (dbType === 'firebase' && db) {
      studentData = await searchInFirebaseUnified(code, sheetPrefix);
    } else {
      studentData = getMockData(code, sheetPrefix);
    }

    if (!studentData) {
      return res.json({
        success: false,
        message: 'لا يوجد طالب بهذا الكود',
        html: '<p style="color: orange; font-weight: bold;">لا يوجد طالب بهذا الكود</p>'
      });
    }

    // Generate HTML response (same format as before)
    const html = generateStudentHTML(studentData, sheetPrefix);

    res.json({
      success: true,
      message: 'تم العثور على الطالب',
      html: html,
      data: studentData,
      version: '2.0-unified'
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في البحث',
      html: '<p style="color: red; font-weight: bold;">حدث خطأ في البحث</p>',
      error: error.message
    });
  }
});

// Generate HTML response (preserved from original)
function generateStudentHTML(data, sheetPrefix) {
  // Use either full_name_arabic or name field for compatibility
  const studentName = data.full_name_arabic || data.name || 'غير محدد';
  
  let html = `
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 15px; color: white; margin: 10px 0; box-shadow: 0 8px 25px rgba(0,0,0,0.2);">
      <h2 style="margin: 0; font-size: 24px; text-align: center;">📋 بيانات الطالب</h2>
    </div>
    
    <div style="background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); margin: 15px 0; border-right: 5px solid #4CAF50;">
      <h3 style="color: #2c3e50; margin: 0 0 15px 0; font-size: 20px;">
        <span style="color: #27ae60;">👤</span> ${studentName}
      </h3>
      <p style="color: #7f8c8d; margin: 5px 0; font-size: 16px;">
        <strong style="color: #34495e;">كود الطالب:</strong> 
        <span style="background: #ecf0f1; padding: 5px 10px; border-radius: 5px; color: #2c3e50; font-weight: bold;">${data.student_code}</span>
      </p>
      <p style="color: #7f8c8d; margin: 5px 0; font-size: 16px;">
        <strong style="color: #34495e;">المستوى:</strong> 
        <span style="background: #3498db; color: white; padding: 5px 10px; border-radius: 5px; font-weight: bold;">${sheetPrefix}</span>
      </p>
      <p style="color: #7f8c8d; margin: 5px 0; font-size: 16px;">
        <strong style="color: #34495e;">حالة التأكيد:</strong> 
        <span style="color: ${data.is_confirmed ? '#27ae60' : '#e74c3c'}; font-weight: bold;">
          ${data.is_confirmed ? '✅ مؤكد' : '⏳ في الانتظار'}
        </span>
      </p>
    </div>
  `;

  // Add performance data for each month
  const months = [
    { key: 'september', name: 'سبتمبر', color: '#e74c3c' },
    { key: 'october', name: 'أكتوبر', color: '#f39c12' },
    { key: 'november', name: 'نوفمبر', color: '#2ecc71' },
    { key: 'december', name: 'ديسمبر', color: '#3498db' }
  ];

  months.forEach(month => {
    if (data[month.key] && typeof data[month.key] === 'object') {
      html += generateMonthHTML(data[month.key], month.name, month.color);
    }
  });

  return html;
}

function generateMonthHTML(monthData, monthName, color) {
  return `
    <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); margin: 15px 0; border-right: 5px solid ${color};">
      <h4 style="color: ${color}; margin: 0 0 15px 0; font-size: 18px;">
        <span style="font-size: 20px;">📅</span> ${monthName}
      </h4>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
        ${[1, 2, 3, 4].map(session => `
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 3px solid ${color};">
            <h5 style="color: #2c3e50; margin: 0 0 10px 0; font-size: 14px;">الجلسة ${session}</h5>
            <p style="margin: 5px 0; font-size: 12px; color: #666;">
              <strong>الأداء:</strong> 
              <span style="color: ${color}; font-weight: bold;">${monthData[`session${session}_perf`] || 'غير محدد'}</span>
            </p>
            <p style="margin: 5px 0; font-size: 12px; color: #666;">
              <strong>الاختبار:</strong> 
              <span style="color: ${color}; font-weight: bold;">${monthData[`session${session}_quiz`] || 'غير محدد'}</span>
            </p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// Mock data function (preserved for testing)
function getMockData(code, sheetPrefix) {
  return {
    id: Math.floor(Math.random() * 1000),
    student_code: code,
    name: `طالب تجريبي ${code}`,
    full_name_arabic: `طالب تجريبي ${code}`,
    grade_level: sheetPrefix,
    is_confirmed: true,
    september: {
      session1_perf: 'A', session1_quiz: '95',
      session2_perf: 'B+', session2_quiz: '88',
      session3_perf: 'A', session3_quiz: '92',
      session4_perf: 'A-', session4_quiz: '90'
    },
    october: {
      session1_perf: 'A', session1_quiz: '93',
      session2_perf: 'A', session2_quiz: '95',
      session3_perf: 'B+', session3_quiz: '87',
      session4_perf: 'A', session4_quiz: '91'
    }
  };
}

// Static file serving
app.use(express.static('public'));

// Serve static HTML files without .html extension
const routes = [
  'index', 'standalone', 'student-login', 'parent-login', 'teacher-login',
  'assistant-login', 'admin-login', 'student-results', 'parent-dashboard',
  'teacher-dashboard', 'admin-dashboard', 'assistant-data-entry',
  'financial-dashboard', 'subject-selection', 'subject-results',
  'test-subject-selection', 'registration'
];

routes.forEach(route => {
  app.get(`/${route}`, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', `${route}.html`));
  });
});

// Demo route
app.get('/demo', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'standalone.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Database: ${dbType}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🎯 Version: 2.0-unified`);
});
