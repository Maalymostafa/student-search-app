const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Real data database setup script based on Google Sheets structure
async function setupRealDataDatabase() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Supabase credentials not found in environment variables');
    console.log('Please set SUPABASE_URL and SUPABASE_ANON_KEY');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log('🚀 Setting up Real Data Database...');

    // Create main students table based on Google Sheets structure
    console.log('Creating main students table...');
    
    const { error: studentsTableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS students (
          id SERIAL PRIMARY KEY,
          student_code VARCHAR(20) UNIQUE,
          full_name_arabic TEXT NOT NULL,
          grade_level VARCHAR(10) NOT NULL CHECK (grade_level IN ('Grade 4', 'Grade 5', 'Grade 6', 'Prep 1')),
          subscription_type VARCHAR(50) NOT NULL,
          transfer_phone VARCHAR(20),
          whatsapp_phone VARCHAR(20),
          transfer_time TIME,
          transfer_date DATE,
          transfer_image_url TEXT,
          is_confirmed BOOLEAN DEFAULT false,
          enrollment_date DATE DEFAULT CURRENT_DATE,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `
    });

    if (studentsTableError) {
      console.log('⚠️  Students table error:', studentsTableError.message);
    } else {
      console.log('✅ Students table created successfully');
    }

    // Create performance tracking table
    console.log('Creating performance tracking table...');
    
    const { error: performanceTableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS student_performance (
          id SERIAL PRIMARY KEY,
          student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
          month VARCHAR(20) NOT NULL,
          session1_perf VARCHAR(5),
          session1_quiz INTEGER CHECK (session1_quiz >= 0 AND session1_quiz <= 100),
          session2_perf VARCHAR(5),
          session2_quiz INTEGER CHECK (session2_quiz >= 0 AND session2_quiz <= 100),
          session3_perf VARCHAR(5),
          session3_quiz INTEGER CHECK (session3_quiz >= 0 AND session3_quiz <= 100),
          session4_perf VARCHAR(5),
          session4_quiz INTEGER CHECK (session4_quiz >= 0 AND session4_quiz <= 100),
          final_evaluation VARCHAR(5),
          attendance_percentage DECIMAL(5,2) DEFAULT 100.00,
          notes TEXT,
          recorded_at TIMESTAMP DEFAULT NOW()
        );
      `
    });

    if (performanceTableError) {
      console.log('⚠️  Performance table error:', performanceTableError.message);
    } else {
      console.log('✅ Performance tracking table created successfully');
    }

    // Create subscription management table
    console.log('Creating subscription management table...');
    
    const { error: subscriptionTableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS subscriptions (
          id SERIAL PRIMARY KEY,
          student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
          subscription_type VARCHAR(50) NOT NULL,
          amount DECIMAL(10,2) NOT NULL,
          start_date DATE NOT NULL,
          end_date DATE,
          status VARCHAR(20) DEFAULT 'active',
          payment_method VARCHAR(50),
          transfer_reference VARCHAR(100),
          created_at TIMESTAMP DEFAULT NOW()
        );
      `
    });

    if (subscriptionTableError) {
      console.log('⚠️  Subscription table error:', subscriptionTableError.message);
    } else {
      console.log('✅ Subscription management table created successfully');
    }

    // Create indexes for performance
    console.log('Adding performance indexes...');
    
    const indexQueries = [
      'CREATE INDEX IF NOT EXISTS idx_students_grade_level ON students(grade_level);',
      'CREATE INDEX IF NOT EXISTS idx_students_subscription ON students(subscription_type);',
      'CREATE INDEX IF NOT EXISTS idx_students_whatsapp ON students(whatsapp_phone);',
      'CREATE INDEX IF NOT EXISTS idx_students_confirmed ON students(is_confirmed);',
      'CREATE INDEX IF NOT EXISTS idx_performance_student_month ON student_performance(student_id, month);',
      'CREATE INDEX IF NOT EXISTS idx_subscriptions_student ON subscriptions(student_id);',
      'CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);'
    ];

    for (const indexQuery of indexQueries) {
      const { error: indexError } = await supabase.rpc('exec_sql', { sql: indexQuery });
      if (indexError) {
        console.log('⚠️  Index creation warning:', indexError.message);
      }
    }

    // Create views for easy reporting
    console.log('Creating reporting views...');
    
    const viewQuery = `
      CREATE OR REPLACE VIEW student_summary AS
      SELECT 
        s.id,
        s.student_code,
        s.full_name_arabic,
        s.grade_level,
        s.subscription_type,
        s.whatsapp_phone,
        s.is_confirmed,
        s.enrollment_date,
        COUNT(sp.id) as performance_records_count,
        COUNT(sub.id) as subscription_records_count,
        s.created_at
      FROM students s
      LEFT JOIN student_performance sp ON s.id = sp.student_id
      LEFT JOIN subscriptions sub ON s.id = sub.student_id
      GROUP BY s.id, s.student_code, s.full_name_arabic, s.grade_level, s.subscription_type, s.whatsapp_phone, s.is_confirmed, s.enrollment_date, s.created_at
      ORDER BY s.created_at DESC;
    `;

    const { error: viewError } = await supabase.rpc('exec_sql', { sql: viewQuery });
    if (viewError) {
      console.log('⚠️  View creation warning:', viewError.message);
    } else {
      console.log('✅ Student summary view created successfully');
    }

    // Add sample data based on your Google Sheets structure
    console.log('📝 Adding sample data from your Google Sheets...');
    
    const sampleStudents = [
      {
        student_code: 'G4001',
        full_name_arabic: 'فارس سامح عيد سالم',
        grade_level: 'Grade 4',
        subscription_type: 'اشتراك شهري 120ج',
        transfer_phone: '1093216126',
        whatsapp_phone: '1093216126',
        transfer_time: '23:30:00',
        transfer_date: '2025-08-10',
        transfer_image_url: 'https://drive.google.com/open?id=1OOLQZcIzs7jT7_xIQ554MdqPbvneSOKj',
        is_confirmed: true
      },
      {
        student_code: 'G5001',
        full_name_arabic: 'رقيه إسلام جميل قطب',
        grade_level: 'Grade 5',
        subscription_type: 'اشتراك شهري 120ج',
        transfer_phone: 'سوبر ماركت',
        whatsapp_phone: '01286051077',
        transfer_time: '00:05:00',
        transfer_date: '2025-08-07',
        transfer_image_url: 'https://drive.google.com/open?id=1uPVBJjM2gThxG9t1jVTBtFdb0yqQHchr',
        is_confirmed: true
      },
      {
        student_code: 'G5002',
        full_name_arabic: 'سما محمد وفاي',
        grade_level: 'Grade 5',
        subscription_type: 'اشتراك شهري 120ج',
        transfer_phone: '01276988338',
        whatsapp_phone: '01279983885',
        transfer_time: '11:55:00',
        transfer_date: '2025-08-09',
        is_confirmed: false
      },
      {
        student_code: 'G6001',
        full_name_arabic: 'فريده عماد السيد ثابت',
        grade_level: 'Grade 6',
        subscription_type: 'اشتراك شهري 120ج',
        transfer_phone: '01229647200',
        whatsapp_phone: '01229647200',
        transfer_time: '10:30:00',
        transfer_date: '2025-07-31',
        transfer_image_url: 'https://drive.google.com/open?id=1NB12Kp2TrsalVxosWYBVyfwQoEwRT2XG',
        is_confirmed: true
      },
      {
        student_code: 'P1001',
        full_name_arabic: 'هنا وائل محمد',
        grade_level: 'Prep 1',
        subscription_type: 'اشتراك الترم 600ج',
        transfer_phone: 'Waelali123@instapay',
        whatsapp_phone: '01060550607',
        transfer_time: '15:13:00',
        transfer_date: '2025-08-09',
        transfer_image_url: 'https://drive.google.com/open?id=1pSvNGt0nCr-L2dXfCFQ4SROkeJUa904B',
        is_confirmed: true
      }
    ];

    for (const student of sampleStudents) {
      const { error } = await supabase
        .from('students')
        .insert(student);

      if (error) {
        console.log(`⚠️  Error adding student ${student.student_code}:`, error.message);
      } else {
        console.log(`✅ Student ${student.student_code} added successfully`);
      }
    }

    // Add sample performance data
    console.log('📊 Adding sample performance data...');
    
    const { data: students } = await supabase
      .from('students')
      .select('id, student_code');

    if (students && students.length > 0) {
      const samplePerformance = [
        {
          student_id: students[0].id,
          month: 'september',
          session1_perf: 'A',
          session1_quiz: 90,
          session2_perf: 'A',
          session2_quiz: 85,
          session3_perf: 'B+',
          session3_quiz: 88,
          session4_perf: 'A',
          session4_quiz: 92,
          final_evaluation: 'A',
          attendance_percentage: 95.5
        },
        {
          student_id: students[1].id,
          month: 'october',
          session1_perf: 'A',
          session1_quiz: 95,
          session2_perf: 'A',
          session2_quiz: 87,
          session3_perf: 'A',
          session3_quiz: 91,
          session4_perf: 'B+',
          session4_quiz: 89,
          final_evaluation: 'A',
          attendance_percentage: 92.0
        }
      ];

      for (const performance of samplePerformance) {
        const { error } = await supabase
          .from('student_performance')
          .insert(performance);

        if (error) {
          console.log(`⚠️  Error adding performance data:`, error.message);
        } else {
          console.log(`✅ Performance data added for student ${performance.student_id}`);
        }
      }
    }

    console.log('🎉 Real Data Database setup completed successfully!');
    console.log('📊 Database structure created:');
    console.log('   - students table (main student information)');
    console.log('   - student_performance table (academic tracking)');
    console.log('   - subscriptions table (payment management)');
    console.log('   - student_summary view (reporting)');
    console.log('   - Performance indexes for fast searches');
    console.log('');
    console.log('📋 Next steps:');
    console.log('   1. Import your complete Google Sheets data');
    console.log('   2. Set up the enhanced search system');
    console.log('   3. Configure analytics and reporting');
    console.log('   4. Test the system with your real data');

  } catch (error) {
    console.error('❌ Real Data Database setup failed:', error);
  }
}

// Google Sheets data import function
async function importGoogleSheetsData() {
  console.log('📥 Google Sheets Import Function');
  console.log('This function will help you import your Google Sheets data');
  console.log('You can use the import script: scripts/import-google-sheets.js');
}

// Main setup function
async function setupRealDataSystem() {
  const dbType = process.env.DB_TYPE || 'supabase';
  
  console.log(`🗄️  Setting up Real Data System with ${dbType.toUpperCase()}...`);
  
  if (dbType === 'supabase') {
    await setupRealDataDatabase();
    await importGoogleSheetsData();
  } else {
    console.log('❌ Real data setup only available for Supabase currently');
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupRealDataSystem();
}

module.exports = { setupRealDataSystem, setupRealDataDatabase, importGoogleSheetsData };


