const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function setupMultiSheetsDatabase() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Supabase credentials not found');
    console.log('Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log('🗄️ Setting up Multi-Sheets Database...');
    console.log('This will create tables for all your Google Sheets data');
    console.log('');
    console.log('⚠️  Note: You need to create the tables manually in Supabase Dashboard');
    console.log('   Go to: https://supabase.com/dashboard/project/[YOUR_PROJECT]/sql');
    console.log('   Run the SQL commands from the setup-sql.sql file');
    console.log('');

    // Check if tables exist
    console.log('🔍 Checking existing tables...');
    
    const { data: students, error: studentsError } = await supabase
      .from('students')
      .select('*')
      .limit(1);

    if (studentsError) {
      console.log('❌ Students table not found. Please create it first.');
      console.log('📋 Run the SQL from setup-sql.sql in your Supabase dashboard');
      return;
    }

    console.log('✅ Students table exists');

    const { data: performance, error: performanceError } = await supabase
      .from('student_performance')
      .select('*')
      .limit(1);

    if (performanceError) {
      console.log('❌ Student performance table not found. Please create it first.');
      return;
    }

    console.log('✅ Student performance table exists');

    const { data: subscriptions, error: subscriptionsError } = await supabase
      .from('subscriptions')
      .select('*')
      .limit(1);

    if (subscriptionsError) {
      console.log('❌ Subscriptions table not found. Please create it first.');
      return;
    }

    console.log('✅ Subscriptions table exists');

    const { data: contacts, error: contactsError } = await supabase
      .from('student_contacts')
      .select('*')
      .limit(1);

    if (contactsError) {
      console.log('❌ Student contacts table not found. Please create it first.');
      return;
    }

    console.log('✅ Student contacts table exists');

    const { data: reviews, error: reviewsError } = await supabase
      .from('student_reviews')
      .select('*')
      .limit(1);

    if (reviewsError) {
      console.log('❌ Student reviews table not found. Please create it first.');
      return;
    }

    console.log('✅ Student reviews table exists');

    const { data: gradeData, error: gradeDataError } = await supabase
      .from('grade_specific_data')
      .select('*')
      .limit(1);

    if (gradeDataError) {
      console.log('❌ Grade specific data table not found. Please create it first.');
      return;
    }

    console.log('✅ Grade specific data table exists');

    console.log('');
    console.log('🎉 All tables exist! Adding sample data...');

    // Add sample data
    await addSampleData(supabase);

    console.log('');
    console.log('🎉 Multi-Sheets Database setup completed successfully!');
    console.log('');
    console.log('📊 Database Structure:');
    console.log('   ✅ students - Main registration data');
    console.log('   ✅ student_performance - Performance tracking');
    console.log('   ✅ subscriptions - Payment management');
    console.log('   ✅ student_contacts - Contact information');
    console.log('   ✅ student_reviews - Review/revision data');
    console.log('   ✅ grade_specific_data - Grade-specific info');
    console.log('');
    console.log('🚀 Next steps:');
    console.log('   1. Run: npm run import-all-tabs');
    console.log('   2. Run: npm run dev-real');
    console.log('   3. Test your data import');

  } catch (error) {
    console.error('❌ Database setup failed:', error);
  }
}

async function addSampleData(supabase) {
  // Sample students from your Google Sheets
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
      is_confirmed: true,
      enrollment_date: '2025-08-10'
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
      is_confirmed: true,
      enrollment_date: '2025-08-07'
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
      is_confirmed: false,
      enrollment_date: '2025-08-09'
    },
    {
      student_code: 'G5003',
      full_name_arabic: 'لمار محمد السيد عبدالحميد الشاذلي',
      grade_level: 'Grade 5',
      subscription_type: 'اشتراك شهري 120ج',
      transfer_phone: '01002072022',
      whatsapp_phone: '01019895801',
      transfer_time: '16:00:00',
      transfer_date: '2025-08-11',
      is_confirmed: false,
      enrollment_date: '2025-08-11'
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
      is_confirmed: true,
      enrollment_date: '2025-07-31'
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
      is_confirmed: true,
      enrollment_date: '2025-08-09'
    }
  ];

  for (const student of sampleStudents) {
    try {
      const { data, error } = await supabase
        .from('students')
        .insert(student)
        .select()
        .single();

      if (error) {
        console.log(`⚠️  Error adding student ${student.student_code}:`, error.message);
      } else {
        console.log(`✅ Added student: ${student.student_code} - ${student.full_name_arabic}`);
        
        // Add subscription record
        const subscriptionAmount = student.subscription_type.includes('شهري') ? 120 : 600;
        const subscriptionRecord = {
          student_id: data.id,
          subscription_type: student.subscription_type,
          amount: subscriptionAmount,
          start_date: student.transfer_date,
          end_date: student.subscription_type.includes('شهري') ? 
            new Date(new Date(student.transfer_date).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] :
            new Date(new Date(student.transfer_date).getTime() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'active',
          payment_method: 'transfer',
          transfer_reference: student.transfer_phone
        };

        await supabase.from('subscriptions').insert(subscriptionRecord);
      }
    } catch (error) {
      console.log(`⚠️  Error adding student ${student.student_code}:`, error.message);
    }
  }
}

// Export functions
module.exports = { setupMultiSheetsDatabase };

// Run if this file is executed directly
if (require.main === module) {
  setupMultiSheetsDatabase();
}
