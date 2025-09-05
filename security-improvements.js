// SECURITY IMPROVEMENTS - Add these to your server.js
// Run: npm install bcrypt jsonwebtoken express-rate-limit helmet

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// 1. SECURITY MIDDLEWARE (Add after cors and bodyParser)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
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
app.use(limiter);

// Stricter rate limiting for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per windowMs
  skipSuccessfulRequests: true,
  message: {
    error: 'Too many login attempts, please try again later.',
    retryAfter: '15 minutes'
  }
});

// 2. AUTHENTICATION MIDDLEWARE
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// 3. PASSWORD HASHING UTILITIES
async function hashPassword(password) {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

function generateToken(user) {
  return jwt.sign(
    { 
      id: user.id, 
      type: user.type, 
      code: user.code 
    }, 
    JWT_SECRET, 
    { expiresIn: '24h' }
  );
}

// 4. SECURE LOGIN ENDPOINTS

// Student login with security
app.post('/api/student-login', loginLimiter, async (req, res) => {
  try {
    const { code, password } = req.body;

    if (!code || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'الكود وكلمة المرور مطلوبان' 
      });
    }

    // Input validation
    if (code.length < 4 || code.length > 10) {
      return res.status(400).json({ 
        success: false, 
        message: 'الكود غير صالح' 
      });
    }

    // Search for student (use your unified search function)
    let studentData = null;
    if (dbType === 'supabase' && db) {
      studentData = await searchInSupabaseUnified(code, code.substring(0, 2).toUpperCase());
    } else if (dbType === 'firebase' && db) {
      studentData = await searchInFirebaseUnified(code, code.substring(0, 2).toUpperCase());
    }

    if (!studentData) {
      // Don't reveal if student exists or not - security best practice
      return res.status(401).json({ 
        success: false, 
        message: 'الكود أو كلمة المرور غير صحيحة' 
      });
    }

    // For demo purposes, password is phone number or default
    // In production, you should have hashed passwords in database
    const validPassword = password === '1234567890' || 
                         password === studentData.transfer_phone ||
                         password === studentData.whatsapp_phone;

    if (!validPassword) {
      return res.status(401).json({ 
        success: false, 
        message: 'الكود أو كلمة المرور غير صحيحة' 
      });
    }

    // Generate JWT token
    const token = generateToken({
      id: studentData.id,
      type: 'student',
      code: studentData.student_code
    });

    res.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      token: token,
      user: {
        id: studentData.id,
        code: studentData.student_code,
        name: studentData.full_name_arabic || studentData.name,
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

// Protected search endpoint (requires authentication)
app.post('/api/protected-search', authenticateToken, async (req, res) => {
  try {
    const { code } = req.body;
    
    // Only allow students to search their own data
    if (req.user.type === 'student' && req.user.code !== code) {
      return res.status(403).json({
        success: false,
        message: 'غير مصرح لك بالوصول لهذه البيانات'
      });
    }

    // Use your existing search logic here
    // ... (same as /api/search but with authentication)
    
  } catch (error) {
    console.error('Protected search error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في البحث'
    });
  }
});

// 5. INPUT VALIDATION MIDDLEWARE
function validateSearchInput(req, res, next) {
  const { code } = req.body;
  
  if (!code) {
    return res.status(400).json({
      success: false,
      message: 'الكود مطلوب'
    });
  }

  // Basic sanitization
  const sanitizedCode = code.toString().trim().toUpperCase();
  
  // Validation
  if (!/^[A-Z0-9]{4,10}$/.test(sanitizedCode)) {
    return res.status(400).json({
      success: false,
      message: 'الكود يجب أن يحتوي على أحرف وأرقام فقط (4-10 أحرف)'
    });
  }

  req.body.code = sanitizedCode;
  next();
}

// 6. LOGGING MIDDLEWARE
function logRequest(req, res, next) {
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent');
  
  console.log(`${timestamp} - ${req.method} ${req.path} - IP: ${ip} - UA: ${userAgent}`);
  next();
}

// Apply logging to all routes
app.use(logRequest);

// 7. ERROR HANDLING MIDDLEWARE
app.use((error, req, res, next) => {
  console.error('Error:', error);
  
  // Don't expose error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(500).json({
    success: false,
    message: 'حدث خطأ في الخادم',
    ...(isDevelopment && { error: error.message, stack: error.stack })
  });
});

// 8. SECURE HEADERS
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Export functions for use in main server file
module.exports = {
  authenticateToken,
  validateSearchInput,
  hashPassword,
  comparePassword,
  generateToken,
  loginLimiter,
  limiter
};
