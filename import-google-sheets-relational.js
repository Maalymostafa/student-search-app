const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

/**
 * Google Sheets to Relational Database Import Script
 *
 * This script imports data from the Google Sheets structure observed in the original sheet
 * and converts it into the normalized relational database structure.
 */

async function importGoogleSheetsToRelational() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Supabase credentials not found');
    console.log('Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log('📥 Starting Google Sheets to Relational Database Import...');
    console.log('');

    // Sample data based on the Google Sheets analysis
    const googleSheetsData = [
      {
        timestamp: '2025-07-18T19:05:14',
        is_confirmed: true,
        student_code: 'G50065',
        full_name_arabic: 'جنا احمد عبد الجواد مهران',
        transfer_phone: '01026133141',
        whatsapp_phone: '01026133141',
        transfer_date: '2025-07-18',
        transfer_time: '19:03:00',
        has_notes: true,
        transfer_image_url: 'https://drive.google.com/open?id=16PWHb5coGMQzAAJQl2X6dFmXlhlE1IlW',
        grade_level: 'Grade 5',
        subscription_type: 'اشتراك الترم 600ج',
        amount: 600
      },
      {
        timestamp: '2025-07-18T19:06:54',
        is_confirmed: true,
        student_code: 'G50066',
        full_name_arabic: 'سجدة محمد ممدوح نصار',
        transfer_phone: '01094054201',
        whatsapp_phone: '01094054201',
        transfer_date: '2025-07-18',
        transfer_time: '19:07:00',
        has_notes: true,
        transfer_image_url: 'https://drive.google.com/open?id=1R7Nngj88AI36uj9yxLlbFPGnaGZu7Ttx',
        grade_level: 'Grade 5',
        subscription_type: 'اشتراك شهري 120ج',
        amount: 120
      },
      {
        timestamp: '2025-07-18T19:09:44',
        is_confirmed: true,
        student_code: 'G60065',
        full_name_arabic: 'حمزة محمد ماهر جمال',
        transfer_phone: '01019055980',
        whatsapp_phone: '01019055980',
        transfer_date: '2025-07-18',
        transfer_time: '19:06:00',
        has_notes: true,
        transfer_image_url: 'https://drive.google.com/open?id=17SQh1wqtNh0VfCLpwCmKlXVRTxjDF4mO',
        grade_level: 'Grade 6',
        subscription_type: 'اشتراك شهري 120ج',
        amount: 120
      },
      {
        timestamp: '2025-07-18T19:21:42',
        is_confirmed: true,
        student_code: 'G60066',
        full_name_arabic: 'سدره الحسن عصام محمد',
        transfer_phone: '01118776270',
        whatsapp_phone: '01118776270',
        transfer_date: '2025-07-18',
        transfer_time: '07:18:00',
        has_notes: true,
        transfer_image_url: 'https://drive.google.com/open?id=1RYshEX_W6xwDtvaPaOCm1O8IEAN5Q30K',
        grade_level: 'Grade 6',
        subscription_type: 'اشتراك شهري 120ج',
        amount: 120
      },
      {
        timestamp: '2025-07-18T19:41:52',
        is_confirmed: true,
        student_code: 'P10065',
        full_name_arabic: 'يوسف محمد حامد صالح',
        transfer_phone: '01099277947',
        whatsapp_phone: '01099277947',
        transfer_date: '2025-07-18',
        transfer_time: '19:34:00',
        has_notes: true,
        transfer_image_url: 'https://drive.google.com/open?id=1CeG6rlqm7s5aVbzmPH-zCSMQBtd_LBsu',
        grade_level: 'Prep 1',
        subscription_type: 'اشتراك الترم 600ج',
        amount: 600
      },
      {
        timestamp: '2025-07-18T19:44:42',
        is_confirmed: true,
        student_code: 'P10066',
        full_name_arabic: 'سلمي طارق فكري',
        transfer_phone: '01094989968',
        whatsapp_phone: '01151330558',
        transfer_date: '2025-07-18',
        transfer_time: '19:43:00',
        has_notes: true,
        transfer_image_url: 'https://drive.google.com/open?id=1TsRI_Q0QiIezZipJYjAh3Hz8UhbCYSoM',
        grade_level: 'Prep 1',
        subscription_type: 'اشتراك شهري 120ج',
        amount: 120
      },
      {
        timestamp: '2025-07-19T10:51:18',
        is_confirmed: true,
        student_code: 'P1006A',
        full_name_arabic: 'فارس محمد طارق السيد',
        transfer_phone: '01097590987',
        whatsapp_phone: '01097590987',
        transfer_date: '2025-07-19',
        transfer_time: '10:48:00',
        has_notes: true,
        transfer_image_url: 'https://drive.google.com/open?id=1Yj7h1pX1frLln0N9mry-rFCnu9uWPXGA',
        grade_level: 'Prep 1',
        subscription_type: 'اشتراك الترم 600ج',
        amount: 600
      },
      {
        timestamp: '2025-07-19T11:13:39',
        is_confirmed: true,
        student_code: 'G40066',
        full_name_arabic: 'أنس محمد السيد العربي',
        transfer_phone: '01018185230',
        whatsapp_phone: '01018185230',
        transfer_date: '2025-07-19',
        transfer_time: '11:09:00',
        has_notes: true,
        transfer_image_url: 'https://drive.google.com/open?id=19y4C-Aqq_n44VRGrPyLn5EVZDNgCJ15j',
        grade_level: 'Grade 4',
        subscription_type: 'اشتراك شهري 120ج',
        amount: 120
      }
    ];

    // Get lookup data
    const { data: gradeLevels } = await supabase.from('grade_levels').select('*');
    const { data: subscriptionTypes } = await supabase.from('subscription_types').select('*');

    if (!gradeLevels || !subscriptionTypes) {
      console.log('❌ Lookup tables not found. Please run create-relational-database.js first');
      return;
    }

    console.log(`📊 Processing ${googleSheetsData.length} student records...`);
    console.log('');

    let successCount = 0;
    let errorCount = 0;
    const importSummary = {
      students_created: 0,
      registrations_created: 0,
      contacts_created: 0,
      payments_created: 0,
      subscriptions_created: 0,
      errors: []
    };

    for (const record of googleSheetsData) {
      try {
        // 1. Determine grade level ID
        let gradeLevel = null;
        if (record.grade_level.includes('Grade 4')) gradeLevel = gradeLevels.find(g => g.code === 'G4');
        else if (record.grade_level.includes('Grade 5')) gradeLevel = gradeLevels.find(g => g.code === 'G5');
        else if (record.grade_level.includes('Grade 6')) gradeLevel = gradeLevels.find(g => g.code === 'G6');
        else if (record.grade_level.includes('Prep 1')) gradeLevel = gradeLevels.find(g => g.code === 'P1');

        // 2. Determine subscription type ID
        const subscriptionType = record.subscription_type.includes('شهري') ?
          subscriptionTypes.find(s => s.code === 'MONTHLY_120') :
          subscriptionTypes.find(s => s.code === 'TERM_600');

        // 3. Check if student already exists
        const { data: existingStudent } = await supabase
          .from('students')
          .select('id')
          .eq('student_code', record.student_code)
          .single();

        let studentId;

        if (existingStudent) {
          studentId = existingStudent.id;
          console.log(`🔄 Student ${record.student_code} already exists - updating registration...`);
        } else {
          // 4. Create student record
          const { data: newStudent, error: studentError } = await supabase
            .from('students')
            .insert({
              student_code: record.student_code,
              full_name_arabic: record.full_name_arabic,
              grade_level_id: gradeLevel?.id,
              is_active: true
            })
            .select()
            .single();

          if (studentError) {
            console.log(`❌ Error creating student ${record.student_code}:`, studentError.message);
            importSummary.errors.push(`Student ${record.student_code}: ${studentError.message}`);
            errorCount++;
            continue;
          }

          studentId = newStudent.id;
          importSummary.students_created++;
          console.log(`✅ Created student: ${record.student_code} - ${record.full_name_arabic}`);
        }

        // 5. Create registration record
        const { data: registration, error: regError } = await supabase
          .from('registrations')
          .insert({
            student_id: studentId,
            registration_timestamp: record.timestamp,
            registration_date: record.timestamp.split('T')[0],
            subscription_type_id: subscriptionType?.id,
            transfer_phone: record.transfer_phone,
            whatsapp_phone: record.whatsapp_phone,
            transfer_amount: record.amount,
            transfer_date: record.transfer_date,
            transfer_time: record.transfer_time,
            transfer_image_url: record.transfer_image_url,
            is_confirmed: record.is_confirmed,
            has_notes: record.has_notes,
            academic_year: '2025',
            semester: 'term1',
            registration_source: 'google_sheets'
          })
          .select()
          .single();

        if (regError) {
          console.log(`❌ Error creating registration for ${record.student_code}:`, regError.message);
          importSummary.errors.push(`Registration ${record.student_code}: ${regError.message}`);
          errorCount++;
          continue;
        }

        importSummary.registrations_created++;

        // 6. Create contact records
        if (record.transfer_phone) {
          await supabase.from('student_contacts').insert({
            student_id: studentId,
            contact_type: 'transfer_phone',
            phone_number: record.transfer_phone,
            is_primary: true,
            notes: 'Phone used for payment transfer'
          });
          importSummary.contacts_created++;
        }

        if (record.whatsapp_phone && record.whatsapp_phone !== record.transfer_phone) {
          await supabase.from('student_contacts').insert({
            student_id: studentId,
            contact_type: 'whatsapp_phone',
            phone_number: record.whatsapp_phone,
            is_whatsapp: true,
            notes: 'WhatsApp contact number'
          });
          importSummary.contacts_created++;
        }

        // 7. Create payment record
        const { error: paymentError } = await supabase
          .from('payments')
          .insert({
            student_id: studentId,
            registration_id: registration.id,
            payment_method: 'bank_transfer',
            amount: record.amount,
            currency: 'EGP',
            payment_date: record.transfer_date,
            payment_time: record.transfer_time,
            transfer_phone: record.transfer_phone,
            payment_proof_url: record.transfer_image_url,
            payment_status: record.is_confirmed ? 'confirmed' : 'pending',
            confirmed_at: record.is_confirmed ? record.timestamp : null
          });

        if (!paymentError) {
          importSummary.payments_created++;
        }

        // 8. Create subscription record
        const startDate = new Date(record.transfer_date);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + (subscriptionType?.duration_months || 1));

        const { error: subscriptionError } = await supabase
          .from('subscriptions')
          .insert({
            student_id: studentId,
            registration_id: registration.id,
            subscription_type_id: subscriptionType?.id,
            start_date: record.transfer_date,
            end_date: endDate.toISOString().split('T')[0],
            amount_paid: record.amount,
            payment_status: record.is_confirmed ? 'active' : 'pending'
          });

        if (!subscriptionError) {
          importSummary.subscriptions_created++;
        }

        successCount++;

      } catch (error) {
        console.log(`❌ Error processing ${record.student_code}:`, error.message);
        importSummary.errors.push(`Processing ${record.student_code}: ${error.message}`);
        errorCount++;
      }
    }

    // 9. Create import history record
    await supabase.from('import_history').insert({
      import_type: 'google_sheets_relational',
      source_file: 'Google Sheets Student Registration System',
      total_records: googleSheetsData.length,
      successful_imports: successCount,
      failed_imports: errorCount,
      import_summary: importSummary,
      started_at: new Date().toISOString()
    });

    console.log('');
    console.log('📊 Import Summary:');
    console.log(`✅ Successfully processed: ${successCount} records`);
    console.log(`❌ Errors: ${errorCount} records`);
    console.log(`📈 Total processed: ${googleSheetsData.length} records`);
    console.log('');
    console.log('📋 Relational Data Created:');
    console.log(`   👥 Students: ${importSummary.students_created}`);
    console.log(`   📝 Registrations: ${importSummary.registrations_created}`);
    console.log(`   📞 Contacts: ${importSummary.contacts_created}`);
    console.log(`   💰 Payments: ${importSummary.payments_created}`);
    console.log(`   📅 Subscriptions: ${importSummary.subscriptions_created}`);

    if (importSummary.errors.length > 0) {
      console.log('');
      console.log('⚠️  Import Errors:');
      importSummary.errors.forEach(error => console.log(`   - ${error}`));
    }

    console.log('');
    console.log('🎉 Google Sheets to Relational Database Import Completed!');
    console.log('');
    console.log('🔄 Next Steps:');
    console.log('   1. Test: node test-relational-database.js');
    console.log('   2. Query: SELECT * FROM student_summary;');
    console.log('   3. Analytics: SELECT * FROM registration_analytics;');

  } catch (error) {
    console.error('❌ Import failed:', error);
  }
}

// Helper function to parse Arabic grade levels
function parseGradeLevel(gradeLevelText) {
  if (gradeLevelText.includes('Grade 4') || gradeLevelText.includes('الرابع')) return 'G4';
  if (gradeLevelText.includes('Grade 5') || gradeLevelText.includes('الخامس')) return 'G5';
  if (gradeLevelText.includes('Grade 6') || gradeLevelText.includes('السادس')) return 'G6';
  if (gradeLevelText.includes('Prep 1') || gradeLevelText.includes('الأول الإعدادي')) return 'P1';
  return null;
}

// Helper function to parse subscription types
function parseSubscriptionType(subscriptionText) {
  if (subscriptionText.includes('شهري') || subscriptionText.includes('120')) return 'MONTHLY_120';
  if (subscriptionText.includes('الترم') || subscriptionText.includes('600')) return 'TERM_600';
  return null;
}

// Run import if this file is executed directly
if (require.main === module) {
  importGoogleSheetsToRelational();
}

module.exports = { importGoogleSheetsToRelational };
