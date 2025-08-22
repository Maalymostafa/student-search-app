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

    // Generate HTML exactly like Google Apps Script
    result += '<table><thead><tr><th>Name</th><th>Student Code</th></tr></thead><tbody>';
    result += '<tr>' +
            '<td style="font-size: 30px; font-weight: bold;">' + studentData.name + '</td>' +
            '<td style="font-size: 30px; font-weight: bold;">' + studentData.student_code + '</td>' +
          '</tr>';
    result += '</tbody></table>';

    result += createPerformanceTable(studentData);
    result += additionalInfo(studentData);
    
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

// Supabase search function - matches Google Sheets structure
async function searchInSupabase(code, sheetPrefix) {
  try {
    const normalizedInputCode = code.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
    
    const { data, error } = await db
      .from(sheetPrefix.toLowerCase())
      .select('*')
      .ilike('student_code', `%${normalizedInputCode}%`)
      .single();

    if (error) throw error;
    
    // Convert to array format like Google Sheets
    if (data) {
      return convertToArrayFormat(data);
    }
    return null;
  } catch (error) {
    console.error('Supabase search error:', error);
    return null;
  }
}

// Firebase search function - matches Google Sheets structure
async function searchInFirebase(code, sheetPrefix) {
  try {
    const normalizedInputCode = code.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
    
    const snapshot = await db
      .collection(sheetPrefix.toLowerCase())
      .where('student_code', '==', normalizedInputCode)
      .limit(1)
      .get();

    if (snapshot.empty) return null;
    
    const doc = snapshot.docs[0];
    const data = { id: doc.id, ...doc.data() };
    return convertToArrayFormat(data);
  } catch (error) {
    console.error('Firebase search error:', error);
    return null;
  }
}

// Convert database object to array format like Google Sheets
function convertToArrayFormat(data) {
  // Google Sheets format: [id, name, is_confirmed, student_code, ...performance_data]
  const rowData = [];
  
  // Map database fields to array positions
  rowData[0] = data.id || '';
  rowData[1] = data.name || '';
  rowData[2] = data.is_confirmed || false;
  rowData[3] = data.student_code || '';
  
  // Performance data starting from index 7 (September)
  if (data.september) {
    rowData[7] = data.september.session1_perf || '';
    rowData[8] = data.september.session1_quiz || '';
    rowData[9] = data.september.session2_perf || '';
    rowData[10] = data.september.session2_quiz || '';
    rowData[11] = data.september.session3_perf || '';
    rowData[12] = data.september.session3_quiz || '';
    rowData[13] = data.september.session4_perf || '';
    rowData[14] = data.september.session4_quiz || '';
    rowData[15] = data.september.final_evaluation || '';
  }
  
  // October (index 18)
  if (data.october) {
    rowData[18] = data.october.session1_perf || '';
    rowData[19] = data.october.session1_quiz || '';
    rowData[20] = data.october.session2_perf || '';
    rowData[21] = data.october.session2_quiz || '';
    rowData[22] = data.october.session3_perf || '';
    rowData[23] = data.october.session3_quiz || '';
    rowData[24] = data.october.session4_perf || '';
    rowData[25] = data.october.session4_quiz || '';
    rowData[26] = data.october.final_evaluation || '';
  }
  
  // November (index 29)
  if (data.november) {
    rowData[29] = data.november.session1_perf || '';
    rowData[30] = data.november.session1_quiz || '';
    rowData[31] = data.november.session2_perf || '';
    rowData[32] = data.november.session2_quiz || '';
    rowData[33] = data.november.session3_perf || '';
    rowData[34] = data.november.session3_quiz || '';
    rowData[35] = data.november.session4_perf || '';
    rowData[36] = data.november.session4_quiz || '';
    rowData[37] = data.november.final_evaluation || '';
  }
  
  // December (index 40)
  if (data.december) {
    rowData[40] = data.december.session1_perf || '';
    rowData[41] = data.december.session1_quiz || '';
    rowData[42] = data.december.session2_perf || '';
    rowData[43] = data.december.session2_quiz || '';
    rowData[44] = data.december.session3_perf || '';
    rowData[45] = data.december.session3_quiz || '';
    rowData[46] = data.december.session4_perf || '';
    rowData[47] = data.december.session4_quiz || '';
    rowData[48] = data.december.final_evaluation || '';
  }
  
  return rowData;
}

// Mock data for testing - matches Google Sheets structure
function getMockData(code, sheetPrefix) {
  const rowData = [];
  
  // Basic info
  rowData[0] = '1';
  rowData[1] = 'Test Student';
  rowData[2] = true; // is_confirmed
  rowData[3] = code;
  
  // September (index 7-15)
  rowData[7] = 'A'; rowData[8] = '90';
  rowData[9] = 'A'; rowData[10] = '85';
  rowData[11] = 'B+'; rowData[12] = '88';
  rowData[13] = 'A'; rowData[14] = '92';
  rowData[15] = 'A';
  
  // October (index 18-26)
  rowData[18] = 'A'; rowData[19] = '95';
  rowData[20] = 'A'; rowData[21] = '87';
  rowData[22] = 'A'; rowData[23] = '91';
  rowData[24] = 'B+'; rowData[25] = '89';
  rowData[26] = 'A';
  
  // November (index 29-37)
  rowData[29] = 'A'; rowData[30] = '93';
  rowData[31] = 'A'; rowData[32] = '88';
  rowData[33] = 'A'; rowData[34] = '90';
  rowData[35] = 'A'; rowData[36] = '94';
  rowData[37] = 'A';
  
  // December (index 40-48)
  rowData[40] = 'A'; rowData[41] = '96';
  rowData[42] = 'A'; rowData[43] = '89';
  rowData[44] = 'A'; rowData[45] = '92';
  rowData[46] = 'A'; rowData[47] = '95';
  rowData[48] = 'A';
  
  return rowData;
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

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Database type: ${dbType}`);
  console.log(`🌐 Visit: http://localhost:${PORT}`);
});
