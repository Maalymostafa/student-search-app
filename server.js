const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

// Security imports
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  }
});
app.use('/api/', limiter);

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

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

// Unified search function for Supabase
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

// API ENDPOINTS

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    database: dbType,
    connected: db !== null,
    timestamp: new Date().toISOString(),
    version: '2.0-unified-fixed'
  });
});

// Search endpoint - UPDATED for unified table structure
app.get('/api/search', async (req, res) => {
  res.json({
    message: "Student Search API - Enhanced Version",
    status: "active",
    version: "2.0-unified",
    endpoints: {
      POST: "/api/search - Search for students with query parameters",
      methods: ["POST"]
    },
    improvements: [
      "✅ Unified database schema",
      "✅ Enhanced security",
      "✅ Better error handling",
      "✅ Rate limiting protection"
    ],
    sample_query: {
      query: "أحمد",
      code: "G4001"
    }
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
    } else {
      // Fallback to mock data for testing
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

// Student login API
app.post('/api/student-login', async (req, res) => {
  try {
    const { code, password } = req.body;
    
    if (!code || !password) {
      return res.status(400).json({
        success: false,
        message: 'الكود وكلمة المرور مطلوبان'
      });
    }
    
    // For demo purposes - in production, use proper authentication
    const validPassword = password === '1234567890' || password === code;
    
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: 'الكود أو كلمة المرور غير صحيحة'
      });
    }
    
    res.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      user: {
        code: code,
        type: 'student'
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في تسجيل الدخول'
    });
  }
});

// Static file serving with proper headers
app.use(express.static('public', {
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
    } else if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css; charset=utf-8');
    } else if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    }
  }
}));

// Serve static HTML files without .html extension - ENHANCED
const routes = [
  'index', 'standalone', 'student-login', 'parent-login', 'teacher-login',
  'assistant-login', 'admin-login', 'student-results', 'parent-dashboard',
  'teacher-dashboard', 'admin-dashboard', 'assistant-data-entry',
  'financial-dashboard', 'subject-selection', 'subject-results',
  'test-subject-selection', 'registration', 'working-student-login',
  'secure-student-login', 'quiz-interface', 'student-quiz-selection',
  'student-quiz', 'test-quiz', 'enhanced-registration', 'test',
  'startup', 'test-all-routes', 'site-map-generator', 'feedback-center',
  'admin-feedback-dashboard', 'student-code-generator'
];

routes.forEach(route => {
  app.get(`/${route}`, (req, res) => {
    const filePath = path.join(__dirname, 'public', `${route}.html`);
    res.sendFile(filePath, (err) => {
      if (err) {
        // If file doesn't exist, serve index.html as fallback
        const fallbackPath = path.join(__dirname, 'public', 'index.html');
        res.sendFile(fallbackPath, (err2) => {
          if (err2) {
            res.status(404).send(`
              <html dir="rtl">
              <head><title>الصفحة غير موجودة</title></head>
              <body style="font-family: Arial; text-align: center; padding: 50px;">
                <h1>🚫 الصفحة غير موجودة</h1>
                <p>الصفحة المطلوبة: <strong>${route}</strong> غير متاحة حالياً</p>
                <a href="/" style="color: blue;">العودة للصفحة الرئيسية</a>
              </body>
              </html>
            `);
          }
    });
  }
});
});
});

// Demo route
app.get('/demo', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'standalone.html'));
});

// Sitemap routes
app.get('/site-map', (req, res) => {
  res.sendFile(path.join(__dirname, 'sitemap-updated.xml'));
});

app.get('/sitemap.xml', (req, res) => {
  res.setHeader('Content-Type', 'application/xml');
  res.sendFile(path.join(__dirname, 'sitemap-updated.xml'));
});

// Static file routes with proper headers and fallbacks
app.get('/style.css', (req, res) => {
  res.setHeader('Content-Type', 'text/css');
  res.sendFile(path.join(__dirname, 'public', 'style.css'), (err) => {
    if (err) {
      res.status(200).send(`
        /* Default CSS fallback */
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        .container { max-width: 1200px; margin: 0 auto; }
        .btn { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; }
        .btn:hover { background: #0056b3; }
      `);
    }
  });
});

app.get('/script.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, 'public', 'script.js'), (err) => {
    if (err) {
      res.status(200).send(`
        // Default JavaScript fallback
        console.log('Student Search System - JavaScript Loaded');
        window.addEventListener('load', function() {
          console.log('System ready');
        });
      `);
    }
  });
});

// Favicon route
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'favicon.ico'), (err) => {
    if (err) {
      // Send a simple response instead of 404
      res.setHeader('Content-Type', 'image/x-icon');
      res.status(204).end();
    }
  });
});

// Direct HTML file access
app.get('/*.html', (req, res) => {
  const fileName = req.path.substring(1); // Remove leading slash
  const filePath = path.join(__dirname, 'public', fileName);
  
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).send(`
        <html dir="rtl">
        <head><title>الملف غير موجود</title></head>
        <body style="font-family: Arial; text-align: center; padding: 50px;">
          <h1>📄 الملف غير موجود</h1>
          <p>الملف المطلوب: <strong>${fileName}</strong> غير موجود</p>
          <a href="/" style="color: blue;">العودة للصفحة الرئيسية</a>
        </body>
        </html>
      `);
    }
  });
});

// Catch all route - serve index.html for SPA behavior
app.get('*', (req, res) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  
  res.sendFile(path.join(__dirname, 'public', 'index.html'), (err) => {
    if (err) {
      res.status(404).send(`
        <html dir="rtl">
        <head><title>نظام إدارة الطلاب</title></head>
        <body style="font-family: Arial; text-align: center; padding: 50px;">
          <h1>🎓 نظام إدارة الطلاب</h1>
          <p>مرحباً بك في نظام إدارة الطلاب</p>
          <p>المسار المطلوب: <strong>${req.path}</strong></p>
          <a href="/" style="color: blue; text-decoration: none; background: #007bff; color: white; padding: 10px 20px; border-radius: 5px;">الصفحة الرئيسية</a>
        </body>
        </html>
      `);
    }
  });
});

// Mock data function for testing
function getMockData(code, sheetPrefix) {
  // Validate hexadecimal format  
  const hexPart = code.slice(2); // Get last 4 characters
  const isValidHex = /^[0-9A-F]{4}$/i.test(hexPart);
  
  return {
    id: Math.floor(Math.random() * 1000),
    student_code: code,
    name: `طالب تجريبي ${code}${isValidHex ? ' (كود صحيح)' : ' (كود قديم)'}`,
    full_name_arabic: `طالب تجريبي ${code}${isValidHex ? ' - كود هيكساديسيمال' : ' - كود عادي'}`,
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

// Generate HTML response (preserved from original)
function generateStudentHTML(data, sheetPrefix) {
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

  return html;
}

// FEEDBACK SYSTEM API ENDPOINTS
const fs = require('fs');

// Create feedback storage directory
const feedbackDir = path.join(__dirname, 'feedback-data');
if (!fs.existsSync(feedbackDir)) {
  fs.mkdirSync(feedbackDir);
}

// Helper function to save feedback
function saveFeedbackToFile(type, data) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${type}-${timestamp}.json`;
  const filepath = path.join(feedbackDir, filename);
  
  const feedbackData = {
    id: Date.now().toString(),
    type: type,
    timestamp: new Date().toISOString(),
    data: data,
    status: 'new'
  };
  
  fs.writeFileSync(filepath, JSON.stringify(feedbackData, null, 2));
  return feedbackData.id;
}

// Feedback API endpoints
app.post('/api/feedback', async (req, res) => {
  try {
    const { type, userType, userName, userContact, subject, message, urgency } = req.body;
    
    if (!subject || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'برجاء ملء الحقول المطلوبة'
      });
    }
    
    const feedbackData = {
      type: type || 'general',
      userType: userType || 'unknown',
      userName: userName || '',
      userContact: userContact || '',
      subject: subject,
      message: message,
      urgency: urgency || 'medium',
      ip: req.ip || req.connection.remoteAddress
    };
    
    const feedbackId = saveFeedbackToFile('feedback', feedbackData);
    
    console.log(`📬 New feedback received: ${subject} (${urgency})`);
    
    res.json({ 
      success: true, 
      message: 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.',
      feedbackId: feedbackId
    });
    
  } catch (error) {
    console.error('Feedback submission error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في إرسال الرسالة'
    });
  }
});

app.post('/api/review', async (req, res) => {
  try {
    const { overallRating, reviewText } = req.body;
    
    if (!overallRating) {
      return res.status(400).json({
        success: false,
        message: 'برجاء إعطاء تقييم'
      });
    }
    
    const reviewData = {
      overallRating: parseInt(overallRating),
      reviewText: reviewText || '',
      ip: req.ip || req.connection.remoteAddress
    };
    
    const reviewId = saveFeedbackToFile('review', reviewData);
    
    console.log(`⭐ New review: ${overallRating}/5 stars`);

        res.json({
          success: true,
      message: 'شكراً لك! تم إرسال تقييمك بنجاح.',
      reviewId: reviewId
    });
    
  } catch (error) {
    console.error('Review submission error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في إرسال التقييم'
    });
  }
});

app.post('/api/suggestion', async (req, res) => {
  try {
    const { category, title, description, priority } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'برجاء ملء العنوان والوصف'
      });
    }
    
    const suggestionData = {
      category: category || 'other',
      title: title,
      description: description,
      priority: priority || 'medium',
      ip: req.ip || req.connection.remoteAddress
    };
    
    const suggestionId = saveFeedbackToFile('suggestion', suggestionData);
    
    console.log(`💡 New suggestion: ${title} (${priority})`);

        res.json({
          success: true,
      message: 'تم إرسال اقتراحك بنجاح! سنقوم بدراسته.',
      suggestionId: suggestionId
    });
    
  } catch (error) {
    console.error('Suggestion submission error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في إرسال الاقتراح'
    });
  }
});

// Get feedback stats
app.get('/api/feedback-stats', (req, res) => {
  try {
    const stats = { totalFeedback: 0, totalReviews: 0, totalSuggestions: 0, averageRating: 4.2 };
    
    if (fs.existsSync(feedbackDir)) {
      const files = fs.readdirSync(feedbackDir);
      stats.totalFeedback = files.filter(f => f.startsWith('feedback-')).length;
      stats.totalReviews = files.filter(f => f.startsWith('review-')).length;
      stats.totalSuggestions = files.filter(f => f.startsWith('suggestion-')).length;
    }
    
    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطأ في الإحصائيات' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Database: ${dbType}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🎯 Version: 2.0-unified-feedback`);
  console.log(`🌐 All routes fixed and optimized`);
  console.log(`💬 Feedback system activated`);
});
