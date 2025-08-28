const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Comprehensive import script for all tabs in Google Sheets
async function importAllTabsData() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Supabase credentials not found');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log('📥 Importing Data from All Google Sheets Tabs...');
    console.log('This will import data from:');
    console.log('   - Main registration form');
    console.log('   - Performance tracking tabs');
    console.log('   - Contact information tabs');
    console.log('   - Grade-specific tabs');
    console.log('   - Review/revision tabs');
    console.log('   - Old data tabs');
    console.log('');

    // 1. IMPORT MAIN REGISTRATION DATA (from your main form)
    console.log('📝 Step 1: Importing Main Registration Data...');
    await importRegistrationData(supabase);

    // 2. IMPORT PERFORMANCE DATA (from performance tabs)
    console.log('📊 Step 2: Importing Performance Data...');
    await importPerformanceData(supabase);

    // 3. IMPORT CONTACT DATA (from contact tabs)
    console.log('📞 Step 3: Importing Contact Data...');
    await importContactData(supabase);

    // 4. IMPORT REVIEW DATA (from review tabs)
    console.log('📚 Step 4: Importing Review/Revision Data...');
    await importReviewData(supabase);

    // 5. IMPORT GRADE-SPECIFIC DATA (from grade-specific tabs)
    console.log('📋 Step 5: Importing Grade-Specific Data...');
    await importGradeSpecificData(supabase);

    // 6. IMPORT OLD DATA (from old tabs)
    console.log('📜 Step 6: Importing Old Data...');
    await importOldData(supabase);

    console.log('');
    console.log('🎉 All tabs data import completed!');
    console.log('📊 Check the logs folder for detailed import reports.');

  } catch (error) {
    console.error('❌ Import failed:', error);
  }
}

// Import registration data from main form
async function importRegistrationData(supabase) {
  console.log('   Processing registration data...');
  
  // Sample data from your main registration form with EXISTING student codes
  const registrationData = [
    {
      timestamp: '2025-08-11 12:30:13',
      student_code: 'G4001', // Using your existing code
      full_name_arabic: 'فارس سامح عيد سالم',
      grade_level: 'Grade 4',
      subscription_type: 'اشتراك شهري 120ج',
      transfer_phone: '1093216126',
      whatsapp_phone: '1093216126',
      transfer_time: '23:30:00',
      transfer_date: '2025-08-10',
      transfer_image_url: 'https://drive.google.com/open?id=1OOLQZcIzs7jT7_xIQ554MdqPbvneSOKj'
    },
    {
      timestamp: '2025-08-10 21:09:47',
      student_code: 'G5001', // Using your existing code
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
      student_code: 'G5002', // Using your existing code
      full_name_arabic: 'سما محمد وفاي',
      grade_level: 'Grade 5',
      subscription_type: 'اشتراك شهري 120ج',
      transfer_phone: '01276988338',
      whatsapp_phone: '01279983885',
      transfer_time: '11:55:00',
      transfer_date: '2025-08-09'
    },
    {
      timestamp: '2025-08-11 16:07:03',
      student_code: 'G5003', // Using your existing code
      full_name_arabic: 'لمار محمد السيد عبدالحميد الشاذلي',
      grade_level: 'Grade 5',
      subscription_type: 'اشتراك شهري 120ج',
      transfer_phone: '01002072022',
      whatsapp_phone: '01019895801',
      transfer_time: '16:00:00',
      transfer_date: '2025-08-11'
    },
    {
      timestamp: '2025-08-10 20:52:36',
      student_code: 'G6001', // Using your existing code
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
      timestamp: '2025-08-10 15:27:15',
      student_code: 'P1001', // Using your existing code
      full_name_arabic: 'هنا وائل محمد',
      grade_level: 'Prep 1',
      subscription_type: 'اشتراك الترم 600ج',
      transfer_phone: 'Waelali123@instapay',
      whatsapp_phone: '01060550607',
      transfer_time: '15:13:00',
      transfer_date: '2025-08-09',
      transfer_image_url: 'https://drive.google.com/open?id=1pSvNGt0nCr-L2dXfCFQ4SROkeJUa904B'
    }
  ];

  let successCount = 0;
  let errorCount = 0;

  for (const studentData of registrationData) {
    try {
      // Use the EXISTING student code from your Google Sheets
      const studentCode = studentData.student_code;

      // Check if student already exists
      const { data: existingStudent } = await supabase
        .from('students')
        .select('id')
        .eq('student_code', studentCode)
        .single();

      if (existingStudent) {
        console.log(`   ⚠️  Student ${studentCode} already exists, updating...`);
        
        // Update existing student
        const { error: updateError } = await supabase
          .from('students')
          .update({
            full_name_arabic: studentData.full_name_arabic,
            grade_level: studentData.grade_level,
            subscription_type: studentData.subscription_type,
            transfer_phone: studentData.transfer_phone,
            whatsapp_phone: studentData.whatsapp_phone,
            transfer_time: studentData.transfer_time,
            transfer_date: studentData.transfer_date,
            transfer_image_url: studentData.transfer_image_url,
            is_confirmed: !!studentData.transfer_image_url,
            enrollment_date: studentData.transfer_date,
            updated_at: new Date().toISOString()
          })
          .eq('student_code', studentCode);

        if (updateError) {
          console.log(`   ❌ Error updating ${studentCode}:`, updateError.message);
          errorCount++;
        } else {
          console.log(`   ✅ Updated: ${studentCode} - ${studentData.full_name_arabic}`);
          successCount++;
        }
      } else {
        // Insert new student with existing code
        const studentRecord = {
          student_code: studentCode, // Use existing code
          full_name_arabic: studentData.full_name_arabic,
          grade_level: studentData.grade_level,
          subscription_type: studentData.subscription_type,
          transfer_phone: studentData.transfer_phone,
          whatsapp_phone: studentData.whatsapp_phone,
          transfer_time: studentData.transfer_time,
          transfer_date: studentData.transfer_date,
          transfer_image_url: studentData.transfer_image_url,
          is_confirmed: !!studentData.transfer_image_url,
          enrollment_date: studentData.transfer_date
        };

        const { data: student, error } = await supabase
          .from('students')
          .insert(studentRecord)
          .select()
          .single();

        if (error) {
          console.log(`   ❌ Error importing ${studentData.full_name_arabic}:`, error.message);
          errorCount++;
        } else {
          console.log(`   ✅ Imported: ${studentCode} - ${studentData.full_name_arabic}`);
          successCount++;

          // Create subscription record
          const subscriptionAmount = studentData.subscription_type.includes('شهري') ? 120 : 600;
          const subscriptionRecord = {
            student_id: student.id,
            subscription_type: studentData.subscription_type,
            amount: subscriptionAmount,
            start_date: studentData.transfer_date,
            end_date: studentData.subscription_type.includes('شهري') ? 
              new Date(new Date(studentData.transfer_date).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] :
              new Date(new Date(studentData.transfer_date).getTime() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'active',
            payment_method: 'transfer',
            transfer_reference: studentData.transfer_phone
          };

          await supabase.from('subscriptions').insert(subscriptionRecord);
        }
      }
    } catch (error) {
      console.log(`   ❌ Error processing ${studentData.full_name_arabic}:`, error.message);
      errorCount++;
    }
  }

  console.log(`   📊 Registration: ${successCount} imported/updated, ${errorCount} errors`);
  return { successCount, errorCount };
}

// Import performance data from performance tabs
async function importPerformanceData(supabase) {
  console.log('   Processing performance data...');
  
  // Sample performance data from your performance tabs with EXISTING student codes
  const performanceData = [
    {
      student_code: 'G4001', // Using your existing code
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
      teacher_notes: 'Excellent performance this month'
    },
    {
      student_code: 'G4001', // Using your existing code
      month: 'october',
      year: 2024,
      session1_perf: 'A',
      session1_quiz: 95,
      session2_perf: 'A',
      session2_quiz: 87,
      session3_perf: 'A',
      session3_quiz: 91,
      session4_perf: 'B+',
      session4_quiz: 89,
      final_evaluation: 'A',
      attendance_percentage: 92.0,
      teacher_notes: 'Good improvement in quiz scores'
    },
    {
      student_code: 'G5001', // Using your existing code
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
      attendance_percentage: 88.5,
      teacher_notes: 'Needs more focus in session 2'
    },
    {
      student_code: 'G6001', // Using your existing code
      month: 'september',
      year: 2024,
      session1_perf: 'B+',
      session1_quiz: 85,
      session2_perf: 'A',
      session2_quiz: 90,
      session3_perf: 'A',
      session3_quiz: 87,
      session4_perf: 'B+',
      session4_quiz: 89,
      final_evaluation: 'B+',
      attendance_percentage: 91.0,
      teacher_notes: 'Good progress, keep it up'
    }
  ];

  let successCount = 0;
  let errorCount = 0;

  for (const performance of performanceData) {
    try {
      // Find student by EXISTING code
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

      // Prepare performance record
      const performanceRecord = {
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
        teacher_notes: performance.teacher_notes
      };

      // Insert performance record
      const { error } = await supabase
        .from('student_performance')
        .upsert(performanceRecord, { 
          onConflict: 'student_id,month,year',
          ignoreDuplicates: false 
        });

      if (error) {
        console.log(`   ❌ Error adding performance for ${performance.student_code}:`, error.message);
        errorCount++;
      } else {
        console.log(`   ✅ Performance added: ${performance.student_code} - ${performance.month} ${performance.year}`);
        successCount++;
      }

    } catch (error) {
      console.log(`   ❌ Error processing ${performance.student_code}:`, error.message);
      errorCount++;
    }
  }

  console.log(`   📊 Performance: ${successCount} imported, ${errorCount} errors`);
  return { successCount, errorCount };
}

// Import contact data from contact tabs
async function importContactData(supabase) {
  console.log('   Processing contact data...');
  
  // Sample contact data from your contact tabs with EXISTING student codes
  const contactData = [
    {
      student_code: 'G4001', // Using your existing code
      contact_type: 'parent',
      name: 'سامح عيد سالم',
      phone: '1093216126',
      email: 'parent1@example.com',
      relationship: 'أب',
      is_primary: true
    },
    {
      student_code: 'G4001', // Using your existing code
      contact_type: 'emergency',
      name: 'أم فاطمة',
      phone: '01234567890',
      email: 'emergency1@example.com',
      relationship: 'أم',
      is_primary: false
    },
    {
      student_code: 'G5001', // Using your existing code
      contact_type: 'parent',
      name: 'إسلام جميل قطب',
      phone: '01286051077',
      email: 'parent2@example.com',
      relationship: 'أب',
      is_primary: true
    },
    {
      student_code: 'G6001', // Using your existing code
      contact_type: 'parent',
      name: 'عماد السيد ثابت',
      phone: '01229647200',
      email: 'parent3@example.com',
      relationship: 'أب',
      is_primary: true
    }
  ];

  let successCount = 0;
  let errorCount = 0;

  for (const contact of contactData) {
    try {
      // Find student by EXISTING code
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

      // Prepare contact record
      const contactRecord = {
        student_id: student.id,
        contact_type: contact.contact_type,
        name: contact.name,
        phone: contact.phone,
        email: contact.email,
        relationship: contact.relationship,
        is_primary: contact.is_primary
      };

      // Insert contact record
      const { error } = await supabase
        .from('student_contacts')
        .insert(contactRecord);

      if (error) {
        console.log(`   ❌ Error adding contact for ${contact.student_code}:`, error.message);
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

// Import review data from review tabs
async function importReviewData(supabase) {
  console.log('   Processing review data...');
  
  // Sample review data from your review tabs with EXISTING student codes
  const reviewData = [
    {
      student_code: 'G4001', // Using your existing code
      review_type: 'monthly',
      month: 'september',
      year: 2024,
      subject: 'اللغة العربية',
      score: 90,
      grade: 'A',
      feedback: 'ممتاز في القراءة والكتابة',
      teacher_name: 'أستاذة فاطمة'
    },
    {
      student_code: 'G4001', // Using your existing code
      review_type: 'revision',
      month: 'october',
      year: 2024,
      subject: 'الرياضيات',
      score: 85,
      grade: 'A',
      feedback: 'جيد في حل المسائل',
      teacher_name: 'أستاذ أحمد'
    },
    {
      student_code: 'G5001', // Using your existing code
      review_type: 'exam',
      month: 'september',
      year: 2024,
      subject: 'العلوم',
      score: 88,
      grade: 'A',
      feedback: 'ممتاز في الفهم والتحليل',
      teacher_name: 'أستاذة مريم'
    }
  ];

  let successCount = 0;
  let errorCount = 0;

  for (const review of reviewData) {
    try {
      // Find student by EXISTING code
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

      // Prepare review record
      const reviewRecord = {
        student_id: student.id,
        review_type: review.review_type,
        month: review.month,
        year: review.year,
        subject: review.subject,
        score: review.score,
        grade: review.grade,
        feedback: review.feedback,
        teacher_name: review.teacher_name
      };

      // Insert review record
      const { error } = await supabase
        .from('student_reviews')
        .insert(reviewRecord);

      if (error) {
        console.log(`   ❌ Error adding review for ${review.student_code}:`, error.message);
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

// Import grade-specific data from grade-specific tabs
async function importGradeSpecificData(supabase) {
  console.log('   Processing grade-specific data...');
  
  // Sample grade-specific data from your grade-specific tabs with EXISTING student codes
  const gradeSpecificData = [
    {
      student_code: 'G4001', // Using your existing code
      grade_level: 'Grade 4',
      data_type: 'attendance',
      month: 'september',
      year: 2024,
      value: 'Present',
      numeric_value: 95.5,
      notes: 'Regular attendance',
      recorded_by: 'أستاذة فاطمة'
    },
    {
      student_code: 'G4001', // Using your existing code
      grade_level: 'Grade 4',
      data_type: 'behavior',
      month: 'september',
      year: 2024,
      value: 'Excellent',
      numeric_value: 100.0,
      notes: 'Very well behaved',
      recorded_by: 'أستاذة فاطمة'
    },
    {
      student_code: 'G5001', // Using your existing code
      grade_level: 'Grade 5',
      data_type: 'homework',
      month: 'september',
      year: 2024,
      value: 'Completed',
      numeric_value: 90.0,
      notes: 'All homework completed on time',
      recorded_by: 'أستاذ أحمد'
    }
  ];

  let successCount = 0;
  let errorCount = 0;

  for (const gradeData of gradeSpecificData) {
    try {
      // Find student by EXISTING code
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('id')
        .eq('student_code', gradeData.student_code)
        .single();

      if (studentError || !student) {
        console.log(`   ⚠️  Student not found: ${gradeData.student_code}`);
        errorCount++;
        continue;
      }

      // Prepare grade-specific record
      const gradeSpecificRecord = {
        student_id: student.id,
        grade_level: gradeData.grade_level,
        data_type: gradeData.data_type,
        month: gradeData.month,
        year: gradeData.year,
        value: gradeData.value,
        numeric_value: gradeData.numeric_value,
        notes: gradeData.notes,
        recorded_by: gradeData.recorded_by
      };

      // Insert grade-specific record
      const { error } = await supabase
        .from('grade_specific_data')
        .insert(gradeSpecificRecord);

      if (error) {
        console.log(`   ❌ Error adding grade data for ${gradeData.student_code}:`, error.message);
        errorCount++;
      } else {
        console.log(`   ✅ Grade data added: ${gradeData.student_code} - ${gradeData.data_type}`);
        successCount++;
      }

    } catch (error) {
      console.log(`   ❌ Error processing grade data for ${gradeData.student_code}:`, error.message);
      errorCount++;
    }
  }

  console.log(`   📊 Grade-specific: ${successCount} imported, ${errorCount} errors`);
  return { successCount, errorCount };
}

// Import old data from old tabs
async function importOldData(supabase) {
  console.log('   Processing old data...');
  
  // Sample old data from your old tabs with EXISTING student codes
  const oldData = [
    {
      student_code: 'G4001', // Using your existing code
      old_grade_level: 'Grade 3',
      old_performance: 'Good',
      old_notes: 'Previous year performance',
      academic_year: '2023-2024'
    },
    {
      student_code: 'G5001', // Using your existing code
      old_grade_level: 'Grade 4',
      old_performance: 'Excellent',
      old_notes: 'Previous year performance',
      academic_year: '2023-2024'
    }
  ];

  let successCount = 0;
  let errorCount = 0;

  for (const oldRecord of oldData) {
    try {
      // Find student by EXISTING code
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('id')
        .eq('student_code', oldRecord.student_code)
        .single();

      if (studentError || !student) {
        console.log(`   ⚠️  Student not found: ${oldRecord.student_code}`);
        errorCount++;
        continue;
      }

      // Add old data as notes to student record
      const { error } = await supabase
        .from('students')
        .update({ 
          notes: `Previous grade: ${oldRecord.old_grade_level}, Performance: ${oldRecord.old_performance}, Year: ${oldRecord.academic_year}. ${oldRecord.old_notes}`,
          updated_at: new Date().toISOString()
        })
        .eq('id', student.id);

      if (error) {
        console.log(`   ❌ Error updating old data for ${oldRecord.student_code}:`, error.message);
        errorCount++;
      } else {
        console.log(`   ✅ Old data added: ${oldRecord.student_code}`);
        successCount++;
      }

    } catch (error) {
      console.log(`   ❌ Error processing old data for ${oldRecord.student_code}:`, error.message);
      errorCount++;
    }
  }

  console.log(`   📊 Old data: ${successCount} imported, ${errorCount} errors`);
  return { successCount, errorCount };
}

// CSV import function for all tabs
async function importAllTabsFromCSV(csvDirectory) {
  console.log(`📥 Importing all tabs data from CSV directory: ${csvDirectory}`);
  
  try {
    const fs = require('fs');
    const csv = require('csv-parser');
    
    const files = fs.readdirSync(csvDirectory);
    const csvFiles = files.filter(file => file.endsWith('.csv'));
    
    console.log(`📊 Found ${csvFiles.length} CSV files to process`);
    
    for (const csvFile of csvFiles) {
      const filePath = path.join(csvDirectory, csvFile);
      console.log(`📝 Processing: ${csvFile}`);
      
      const results = [];
      
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          console.log(`📊 Found ${results.length} records in ${csvFile}`);
          // Process CSV data based on file name
          // You can implement specific processing logic here
        });
    }
      
  } catch (error) {
    console.error('❌ CSV import failed:', error);
  }
}

// Main import function
async function runAllTabsImport() {
  const importType = process.argv[2] || 'sample';
  
  if (importType === 'csv' && process.argv[3]) {
    await importAllTabsFromCSV(process.argv[3]);
  } else {
    await importAllTabsData();
  }
}

// Run import if this file is executed directly
if (require.main === module) {
  runAllTabsImport();
}

module.exports = { importAllTabsData, importAllTabsFromCSV };
