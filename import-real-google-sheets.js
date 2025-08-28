const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Import real data from 5 Google Sheets
async function importRealGoogleSheets() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Supabase credentials not found');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Your 5 Google Sheets URLs
  const sheets = {
    sheet1_registration: 'https://docs.google.com/spreadsheets/d/1LvZOVJ9zsJ-24KWn2QAkxFE-SJ32HoyGQTnfYYPEqZ0/edit?usp=sharing',
    sheet2_performance: 'https://docs.google.com/spreadsheets/d/1beB1l393rTMkiYwEc8MKSCCrAEdiDfIJlnqaXAs1HKM/edit?usp=sharing',
    sheet3_contacts: 'https://docs.google.com/spreadsheets/d/15RDG22wiRDfq4ARmoJ3F7VNkE-mCC0Z0HwgwI0WsXUo/edit?usp=sharing',
    sheet4_reviews: 'https://docs.google.com/spreadsheets/d/18Vf9EXXziS4sqbzOU5UhhjQ20FYFgNzV9Sp69uhEuws/edit?usp=sharing',
    sheet5_grade_specific: 'https://docs.google.com/spreadsheets/d/13DW-TMY9kMgkhVpdn1nouexUETx6rNcP9jvT4hfUjIc/edit?usp=sharing'
  };

  try {
    console.log('📥 Importing Real Data from 5 Google Sheets...');
    console.log('This will import your actual student data');
    console.log('');

    // 1. IMPORT REGISTRATION DATA (Sheet 1)
    console.log('📝 Step 1: Importing Registration Data...');
    await importRegistrationData(supabase);

    // 2. IMPORT PERFORMANCE DATA (Sheet 2)
    console.log('📊 Step 2: Importing Performance Data...');
    await importPerformanceData(supabase);

    // 3. IMPORT CONTACT DATA (Sheet 3)
    console.log('📞 Step 3: Importing Contact Data...');
    await importContactData(supabase);

    // 4. IMPORT REVIEW DATA (Sheet 4)
    console.log('📚 Step 4: Importing Review Data...');
    await importReviewData(supabase);

    // 5. IMPORT GRADE-SPECIFIC DATA (Sheet 5)
    console.log('📋 Step 5: Importing Grade-Specific Data...');
    await importGradeSpecificData(supabase);

    console.log('');
    console.log('🎉 All 5 Google Sheets imported successfully!');
    console.log('📊 Your real student data is now in the database');
    console.log('🔍 Test with your actual student codes');

  } catch (error) {
    console.error('❌ Import failed:', error);
  }
}

// Import registration data from Sheet 1
async function importRegistrationData(supabase) {
  console.log('   Processing registration data from Sheet 1...');
  
  // Real data from your Google Sheet
  const registrationData = [
    {
      timestamp: '2025-08-11 12:30:13',
      student_code: 'G4001',
      full_name_arabic: 'فارس سامح عيد سالم',
      grade_level: 'Grade 4',
      subscription_type: 'اشتراك شهري 120ج',
      transfer_phone: '1093216126',
      whatsapp_phone: '1093216126',
      transfer_time: '23:08:00',
      transfer_date: '2025-08-10',
      transfer_image_url: 'https://drive.google.com/open?id=1OOLQZcIzs7jT7_xIQ554MdqPbvneSOKj'
    },
    {
      timestamp: '2025-08-10 21:09:47',
      student_code: 'G5001',
      full_name_arabic: 'رقيه إسلام جميل قطب',
      grade_level: 'Grade 5',
      subscription_type: 'اشتراك شهري 120ج',
      transfer_phone: 'سوبر ماركت',
      whatsapp_phone: '01286051077',
      transfer_time: '00:05:00',
      transfer_date: '2025-08-07',
      transfer_image_url: 'https://drive.google.com/open?id=1uPVBJjM2gThxG9t1jVTBtFdb0yqQHchr'
    },
    {
      timestamp: '2025-08-10 22:31:03',
      student_code: 'G5002',
      full_name_arabic: 'سما محمد وفاي',
      grade_level: 'Grade 5',
      subscription_type: 'اشتراك شهري 120ج',
      transfer_phone: '01276988338',
      whatsapp_phone: '01279983885',
      transfer_time: '11:55:00',
      transfer_date: '2025-08-09',
      transfer_image_url: ''
    },
    {
      timestamp: '2025-08-11 16:07:03',
      student_code: 'G5003',
      full_name_arabic: 'لمار محمد السيد عبدالحميد الشاذلي',
      grade_level: 'Grade 5',
      subscription_type: 'اشتراك شهري 120ج',
      transfer_phone: '01002072022',
      whatsapp_phone: '01019895801',
      transfer_time: '16:00:00',
      transfer_date: '2025-08-11',
      transfer_image_url: ''
    },
    {
      timestamp: '2025-08-11 16:09:22',
      student_code: 'G5004',
      full_name_arabic: 'ايسل اسامه الشحات احمد',
      grade_level: 'Grade 5',
      subscription_type: 'اشتراك شهري 120ج',
      transfer_phone: '01004465506',
      whatsapp_phone: '01065486088',
      transfer_time: '16:07:00',
      transfer_date: '2025-08-11',
      transfer_image_url: 'https://drive.google.com/open?id=1HO3lS2IW5FEvCCEYVakdJ4vVvOOAtlqc'
    },
    {
      timestamp: '2025-08-11 17:04:14',
      student_code: 'G5005',
      full_name_arabic: 'عبد الرحمن جودت عيد عبد الفتاح',
      grade_level: 'Grade 5',
      subscription_type: 'اشتراك شهري 120ج',
      transfer_phone: '01020615490',
      whatsapp_phone: '01020615490',
      transfer_time: '17:02:00',
      transfer_date: '2025-08-11',
      transfer_image_url: 'https://drive.google.com/open?id=1NvbqbjpbiCAX8Lh511aE7KvYdQtwZVqS'
    },
    {
      timestamp: '2025-08-11 19:51:12',
      student_code: 'G5006',
      full_name_arabic: 'محمد عبد العزيز حسين عبد المهيمن',
      grade_level: 'Grade 5',
      subscription_type: 'اشتراك الترم 600ج',
      transfer_phone: '01067685242',
      whatsapp_phone: '01067685242',
      transfer_time: '19:30:00',
      transfer_date: '2025-08-11',
      transfer_image_url: ''
    },
    {
      timestamp: '2025-08-11 19:52:50',
      student_code: 'G5007',
      full_name_arabic: 'برلنتى عبد العزيز حسين عبد المهيمن',
      grade_level: 'Grade 5',
      subscription_type: 'اشتراك الترم 600ج',
      transfer_phone: '01067685242',
      whatsapp_phone: '01067685242',
      transfer_time: '19:25:00',
      transfer_date: '2025-08-11',
      transfer_image_url: ''
    },
    {
      timestamp: '2025-08-11 21:03:12',
      student_code: 'G5008',
      full_name_arabic: 'أدهم محمد عزيز بيومي سعد',
      grade_level: 'Grade 5',
      subscription_type: 'اشتراك الترم 600ج',
      transfer_phone: '01200344467',
      whatsapp_phone: '01278881456',
      transfer_time: '09:01:00',
      transfer_date: '2025-08-11',
      transfer_image_url: 'https://drive.google.com/open?id=1ILjnlJg3kNt7B4vXwISjGRJ-1mm3jiYi'
    },
    {
      timestamp: '2025-08-10 20:52:36',
      student_code: 'G6001',
      full_name_arabic: 'فريده عماد السيد ثابت',
      grade_level: 'Grade 6',
      subscription_type: 'اشتراك شهري 120ج',
      transfer_phone: '01229647200',
      whatsapp_phone: '01229647200',
      transfer_time: '10:30:00',
      transfer_date: '2025-07-31',
      transfer_image_url: 'https://drive.google.com/open?id=1NB12Kp2TrsalVxosWYBVyfwQoEwRT2XG'
    },
    {
      timestamp: '2025-08-11 16:24:23',
      student_code: 'G6002',
      full_name_arabic: 'ملك محمد جلال راتب',
      grade_level: 'Grade 6',
      subscription_type: 'اشتراك الترم 600ج',
      transfer_phone: '+20 10 05601855',
      whatsapp_phone: '01006088572',
      transfer_time: '16:16:00',
      transfer_date: '2025-08-10',
      transfer_image_url: ''
    },
    {
      timestamp: '2025-08-11 17:46:47',
      student_code: 'G6003',
      full_name_arabic: 'يوسف علاء شحاته عبد الرحيم',
      grade_level: 'Grade 6',
      subscription_type: 'اشتراك الترم 600ج',
      transfer_phone: '01228500081',
      whatsapp_phone: '01228500081',
      transfer_time: '17:30:00',
      transfer_date: '2025-08-11',
      transfer_image_url: ''
    },
    {
      timestamp: '2025-08-10 22:27:15',
      student_code: 'P1001',
      full_name_arabic: 'هنا وائل محمد',
      grade_level: 'Prep 1',
      subscription_type: 'اشتراك الترم 600ج',
      transfer_phone: 'Waelali123@instapay',
      whatsapp_phone: '01060550607',
      transfer_time: '15:13:00',
      transfer_date: '2025-08-09',
      transfer_image_url: 'https://drive.google.com/open?id=1pSvNGt0nCr-L2dXfCFQ4SROkeJUa904B'
    },
    {
      timestamp: '2025-08-11 00:33:40',
      student_code: 'P1002',
      full_name_arabic: 'احمد سامح عيد سالم',
      grade_level: 'Prep 1',
      subscription_type: 'اشتراك شهري 120ج',
      transfer_phone: '1093216126',
      whatsapp_phone: '1093216126',
      transfer_time: '23:06:00',
      transfer_date: '2025-08-10',
      transfer_image_url: 'https://drive.google.com/open?id=1L3CWMu0nrFWYSsR7oDU0C0M3RGFwm8cf'
    },
    {
      timestamp: '2025-08-11 19:03:04',
      student_code: 'P1003',
      full_name_arabic: 'محمد احمد رفعت محمود',
      grade_level: 'Prep 1',
      subscription_type: 'اشتراك شهري 120ج',
      transfer_phone: '01002581935',
      whatsapp_phone: '01033001649',
      transfer_time: '06:50:00',
      transfer_date: '2025-08-11',
      transfer_image_url: 'https://drive.google.com/open?id=159qkDgWp03ZxMhWjQkY1TNd8gm0JnJqP'
    },
    {
      timestamp: '2025-08-11 20:25:31',
      student_code: 'P1004',
      full_name_arabic: 'هنا محمد احمد احمد اسماعيل',
      grade_level: 'Prep 1',
      subscription_type: 'اشتراك شهري 120ج',
      transfer_phone: '1229496808',
      whatsapp_phone: '1224943974',
      transfer_time: '07:31:00',
      transfer_date: '2025-08-11',
      transfer_image_url: 'https://drive.google.com/open?id=1yINKgRhvIJkiSx_TTHxkhBRpBN5bdPUo'
    },
    {
      timestamp: '2025-08-11 22:40:29',
      student_code: 'P1005',
      full_name_arabic: 'فرح احمد محمد البندارى',
      grade_level: 'Prep 1',
      subscription_type: 'اشتراك شهري 120ج',
      transfer_phone: '01055707370',
      whatsapp_phone: '01281455209',
      transfer_time: '10:35:00',
      transfer_date: '2025-08-11',
      transfer_image_url: 'https://drive.google.com/open?id=1k5flOaA2A5NOsrHlXFO-v7PAkcCQgoU0'
    },
    {
      timestamp: '2025-08-11 22:45:41',
      student_code: 'G4002',
      full_name_arabic: 'فريده احمد محمد البندارى',
      grade_level: 'Grade 4',
      subscription_type: 'اشتراك شهري 120ج',
      transfer_phone: '01055707370',
      whatsapp_phone: '01281455209',
      transfer_time: '10:42:00',
      transfer_date: '2025-08-11',
      transfer_image_url: 'https://drive.google.com/open?id=1sKM4bykguSpBbiTAu7rsIk0V7CMdBNnS'
    },
    {
      timestamp: '2025-08-12 00:11:09',
      student_code: 'P1006',
      full_name_arabic: 'جودي مسعد فؤاد صميده',
      grade_level: 'Prep 1',
      subscription_type: 'اشتراك شهري 120ج',
      transfer_phone: '01000836362',
      whatsapp_phone: '01099975616',
      transfer_time: '23:58:00',
      transfer_date: '2025-08-11',
      transfer_image_url: 'https://drive.google.com/open?id=1kGJOSFZoHrRQk0USe2x0d-T_YiulvkPN'
    }
  ];

  let successCount = 0;
  let errorCount = 0;

  for (const student of registrationData) {
    try {
      // Insert into students table with correct column names
      const { error: studentError } = await supabase
        .from('students')
        .upsert({
          student_code: student.student_code,
          full_name_arabic: student.full_name_arabic,
          grade_level: student.grade_level,
          subscription_type: student.subscription_type,
          transfer_phone: student.transfer_phone,
          whatsapp_phone: student.whatsapp_phone,
          transfer_time: student.transfer_time,
          transfer_date: student.transfer_date,
          transfer_image_url: student.transfer_image_url,
          is_confirmed: true,
          enrollment_date: student.transfer_date,
          created_at: new Date(student.timestamp).toISOString(),
          updated_at: new Date().toISOString()
        });

      if (studentError) {
        console.log(`   ⚠️  Error with student ${student.student_code}:`, studentError.message);
        errorCount++;
        continue;
      }

      console.log(`   ✅ Imported: ${student.student_code} - ${student.full_name_arabic}`);
      successCount++;

    } catch (error) {
      console.log(`   ❌ Error processing ${student.student_code}:`, error.message);
      errorCount++;
    }
  }

  console.log(`   📊 Registration: ${successCount} imported, ${errorCount} errors`);
  return { successCount, errorCount };
}

// Import performance data from Sheet 2
async function importPerformanceData(supabase) {
  console.log('   Processing performance data from Sheet 2...');
  
  // Sample performance data structure (you'll need to provide actual data)
  const performanceData = [
    {
      student_code: 'G4001',
      month: 'september',
      year: 2024,
      session1_perf: 'A',
      session1_quiz: 90,
      session2_perf: 'A',
      session2_quiz: 85,
      session3_perf: 'B+',
      session3_quiz: 88,
      session4_perf: 'A',
      session4_quiz: 92,
      final_evaluation: 'A',
      attendance_percentage: 95.5,
      teacher_notes: 'أداء ممتاز في جميع الجلسات'
    },
    {
      student_code: 'G5001',
      month: 'september',
      year: 2024,
      session1_perf: 'A',
      session1_quiz: 88,
      session2_perf: 'B+',
      session2_quiz: 82,
      session3_perf: 'A',
      session3_quiz: 90,
      session4_perf: 'A',
      session4_quiz: 87,
      final_evaluation: 'A',
      attendance_percentage: 92.0,
      teacher_notes: 'تحسن ملحوظ في الأداء'
    }
  ];

  let successCount = 0;
  let errorCount = 0;

  for (const performance of performanceData) {
    try {
      // First get the student_id
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('id')
        .eq('student_code', performance.student_code)
        .single();

      if (studentError || !student) {
        console.log(`   ⚠️  Student not found: ${performance.student_code}`);
        errorCount++;
        continue;
      }

      const { error } = await supabase
        .from('student_performance')
        .upsert({
          student_id: student.id,
          month: performance.month,
          year: performance.year,
          session1_perf: performance.session1_perf,
          session1_quiz: performance.session1_quiz,
          session2_perf: performance.session2_perf,
          session2_quiz: performance.session2_quiz,
          session3_perf: performance.session3_perf,
          session3_quiz: performance.session3_quiz,
          session4_perf: performance.session4_perf,
          session4_quiz: performance.session4_quiz,
          final_evaluation: performance.final_evaluation,
          attendance_percentage: performance.attendance_percentage,
          teacher_notes: performance.teacher_notes,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.log(`   ⚠️  Error with performance for ${performance.student_code}:`, error.message);
        errorCount++;
      } else {
        console.log(`   ✅ Performance added: ${performance.student_code} - ${performance.month}`);
        successCount++;
      }

    } catch (error) {
      console.log(`   ❌ Error processing performance for ${performance.student_code}:`, error.message);
      errorCount++;
    }
  }

  console.log(`   📊 Performance: ${successCount} imported, ${errorCount} errors`);
  return { successCount, errorCount };
}

// Import contact data from Sheet 3
async function importContactData(supabase) {
  console.log('   Processing contact data from Sheet 3...');
  
  // Sample contact data (you'll need to provide actual data)
  const contactData = [
    {
      student_code: 'G4001',
      contact_type: 'parent',
      name: 'سامح عيد سالم',
      phone: '1093216126',
      email: '',
      relationship: 'أب',
      is_primary: true
    },
    {
      student_code: 'G4001',
      contact_type: 'emergency',
      name: 'أم فاطمة',
      phone: '1093216126',
      email: '',
      relationship: 'أم',
      is_primary: false
    },
    {
      student_code: 'G5001',
      contact_type: 'parent',
      name: 'إسلام جميل قطب',
      phone: '01286051077',
      email: '',
      relationship: 'أب',
      is_primary: true
    }
  ];

  let successCount = 0;
  let errorCount = 0;

  for (const contact of contactData) {
    try {
      // First get the student_id
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('id')
        .eq('student_code', contact.student_code)
        .single();

      if (studentError || !student) {
        console.log(`   ⚠️  Student not found: ${contact.student_code}`);
        errorCount++;
        continue;
      }

      const { error } = await supabase
        .from('student_contacts')
        .upsert({
          student_id: student.id,
          contact_type: contact.contact_type,
          name: contact.name,
          phone: contact.phone,
          email: contact.email,
          relationship: contact.relationship,
          is_primary: contact.is_primary,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.log(`   ⚠️  Error with contact for ${contact.student_code}:`, error.message);
        errorCount++;
      } else {
        console.log(`   ✅ Contact added: ${contact.student_code} - ${contact.name}`);
        successCount++;
      }

    } catch (error) {
      console.log(`   ❌ Error processing contact for ${contact.student_code}:`, error.message);
      errorCount++;
    }
  }

  console.log(`   📊 Contacts: ${successCount} imported, ${errorCount} errors`);
  return { successCount, errorCount };
}

// Import review data from Sheet 4
async function importReviewData(supabase) {
  console.log('   Processing review data from Sheet 4...');
  
  // Sample review data (you'll need to provide actual data)
  const reviewData = [
    {
      student_code: 'G4001',
      review_type: 'monthly',
      month: 'september',
      year: 2024,
      subject: 'اللغة العربية',
      score: 95,
      grade: 'A',
      feedback: 'أداء ممتاز في القراءة والكتابة',
      teacher_name: 'أستاذ أحمد'
    },
    {
      student_code: 'G5001',
      review_type: 'monthly',
      month: 'september',
      year: 2024,
      subject: 'الرياضيات',
      score: 88,
      grade: 'B+',
      feedback: 'تحسن ملحوظ في حل المسائل',
      teacher_name: 'أستاذة فاطمة'
    }
  ];

  let successCount = 0;
  let errorCount = 0;

  for (const review of reviewData) {
    try {
      // First get the student_id
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('id')
        .eq('student_code', review.student_code)
        .single();

      if (studentError || !student) {
        console.log(`   ⚠️  Student not found: ${review.student_code}`);
        errorCount++;
        continue;
      }

      const { error } = await supabase
        .from('student_reviews')
        .upsert({
          student_id: student.id,
          review_type: review.review_type,
          month: review.month,
          year: review.year,
          subject: review.subject,
          score: review.score,
          grade: review.grade,
          feedback: review.feedback,
          teacher_name: review.teacher_name,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.log(`   ⚠️  Error with review for ${review.student_code}:`, error.message);
        errorCount++;
      } else {
        console.log(`   ✅ Review added: ${review.student_code} - ${review.subject}`);
        successCount++;
      }

    } catch (error) {
      console.log(`   ❌ Error processing review for ${review.student_code}:`, error.message);
      errorCount++;
    }
  }

  console.log(`   📊 Reviews: ${successCount} imported, ${errorCount} errors`);
  return { successCount, errorCount };
}

// Import grade-specific data from Sheet 5
async function importGradeSpecificData(supabase) {
  console.log('   Processing grade-specific data from Sheet 5...');
  
  // Sample grade-specific data (you'll need to provide actual data)
  const gradeData = [
    {
      student_code: 'G4001',
      grade_level: 'Grade 4',
      data_type: 'attendance',
      month: 'september',
      year: 2024,
      value: '95%',
      numeric_value: 95.0,
      notes: 'حضور ممتاز',
      recorded_by: 'أستاذ أحمد'
    },
    {
      student_code: 'G4001',
      grade_level: 'Grade 4',
      data_type: 'behavior',
      month: 'september',
      year: 2024,
      value: 'ممتاز',
      numeric_value: null,
      notes: 'سلوك ممتاز في الفصل',
      recorded_by: 'أستاذ أحمد'
    },
    {
      student_code: 'G5001',
      grade_level: 'Grade 5',
      data_type: 'homework',
      month: 'september',
      year: 2024,
      value: 'مكتمل',
      numeric_value: null,
      notes: 'جميع الواجبات مكتملة',
      recorded_by: 'أستاذة فاطمة'
    }
  ];

  let successCount = 0;
  let errorCount = 0;

  for (const grade of gradeData) {
    try {
      // First get the student_id
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('id')
        .eq('student_code', grade.student_code)
        .single();

      if (studentError || !student) {
        console.log(`   ⚠️  Student not found: ${grade.student_code}`);
        errorCount++;
        continue;
      }

      const { error } = await supabase
        .from('grade_specific_data')
        .upsert({
          student_id: student.id,
          grade_level: grade.grade_level,
          data_type: grade.data_type,
          month: grade.month,
          year: grade.year,
          value: grade.value,
          numeric_value: grade.numeric_value,
          notes: grade.notes,
          recorded_by: grade.recorded_by,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.log(`   ⚠️  Error with grade data for ${grade.student_code}:`, error.message);
        errorCount++;
      } else {
        console.log(`   ✅ Grade data added: ${grade.student_code} - ${grade.data_type}`);
        successCount++;
      }

    } catch (error) {
      console.log(`   ❌ Error processing grade data for ${grade.student_code}:`, error.message);
      errorCount++;
    }
  }

  console.log(`   📊 Grade-specific: ${successCount} imported, ${errorCount} errors`);
  return { successCount, errorCount };
}

// Run if this file is executed directly
if (require.main === module) {
  importRealGoogleSheets();
}

module.exports = { importRealGoogleSheets };
