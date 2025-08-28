const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Google Sheets import script
async function importGoogleSheetsData() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Supabase credentials not found');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log('📥 Starting Google Sheets Import...');
    
    // Sample data structure based on your Google Sheets
    // You can replace this with actual CSV import or API calls
    const googleSheetsData = [
      {
        timestamp: '2025-08-11 12:30:13',
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
        full_name_arabic: 'سما محمد وفاي',
        grade_level: 'Grade 5',
        subscription_type: 'اشتراك شهري 120ج',
        transfer_phone: '01276988338',
        whatsapp_phone: '01279983885',
        transfer_time: '11:55:00',
        transfer_date: '2025-08-09',
        transfer_image_url: null
      },
      {
        timestamp: '2025-08-11 16:07:03',
        full_name_arabic: 'لمار محمد السيد عبدالحميد الشاذلي',
        grade_level: 'Grade 5',
        subscription_type: 'اشتراك شهري 120ج',
        transfer_phone: '01002072022',
        whatsapp_phone: '01019895801',
        transfer_time: '16:00:00',
        transfer_date: '2025-08-11',
        transfer_image_url: null
      },
      {
        timestamp: '2025-08-11 16:09:22',
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
        timestamp: '2025-08-10 20:52:36',
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

    console.log(`📊 Importing ${googleSheetsData.length} students...`);

    let successCount = 0;
    let errorCount = 0;

    for (const studentData of googleSheetsData) {
      try {
        // Generate student code based on grade level and existing students
        const gradePrefix = studentData.grade_level === 'Prep 1' ? 'P1' : 
                           studentData.grade_level.replace('Grade ', 'G');
        
        // Get count of existing students in this grade
        const { count } = await supabase
          .from('students')
          .select('*', { count: 'exact', head: true })
          .eq('grade_level', studentData.grade_level);

        const studentNumber = (count || 0) + 1;
        const studentCode = `${gradePrefix}${studentNumber.toString().padStart(3, '0')}`;

        // Prepare student record
        const studentRecord = {
          student_code: studentCode,
          full_name_arabic: studentData.full_name_arabic,
          grade_level: studentData.grade_level,
          subscription_type: studentData.subscription_type,
          transfer_phone: studentData.transfer_phone,
          whatsapp_phone: studentData.whatsapp_phone,
          transfer_time: studentData.transfer_time,
          transfer_date: studentData.transfer_date,
          transfer_image_url: studentData.transfer_image_url,
          is_confirmed: !!studentData.transfer_image_url, // Confirmed if image URL exists
          enrollment_date: studentData.transfer_date
        };

        // Insert student
        const { data: student, error } = await supabase
          .from('students')
          .insert(studentRecord)
          .select()
          .single();

        if (error) {
          console.log(`❌ Error importing ${studentData.full_name_arabic}:`, error.message);
          errorCount++;
        } else {
          console.log(`✅ Imported: ${studentCode} - ${studentData.full_name_arabic}`);
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

          await supabase
            .from('subscriptions')
            .insert(subscriptionRecord);

        }
      } catch (error) {
        console.log(`❌ Error processing ${studentData.full_name_arabic}:`, error.message);
        errorCount++;
      }
    }

    console.log('');
    console.log('📊 Import Summary:');
    console.log(`✅ Successfully imported: ${successCount} students`);
    console.log(`❌ Errors: ${errorCount} students`);
    console.log(`📈 Total processed: ${googleSheetsData.length} students`);

    // Generate import report
    const report = {
      timestamp: new Date().toISOString(),
      total_records: googleSheetsData.length,
      successful_imports: successCount,
      failed_imports: errorCount,
      grade_distribution: {}
    };

    // Calculate grade distribution
    for (const student of googleSheetsData) {
      const grade = student.grade_level;
      report.grade_distribution[grade] = (report.grade_distribution[grade] || 0) + 1;
    }

    // Save report
    const reportPath = path.join(__dirname, '../logs/import-report.json');
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log('📄 Import report saved to: logs/import-report.json');

  } catch (error) {
    console.error('❌ Import failed:', error);
  }
}

// CSV import function (for when you export Google Sheets as CSV)
async function importFromCSV(csvFilePath) {
  console.log(`📥 Importing from CSV: ${csvFilePath}`);
  
  try {
    const csv = require('csv-parser');
    const fs = require('fs');
    
    const results = [];
    
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        console.log(`📊 Found ${results.length} records in CSV`);
        // Process CSV data similar to Google Sheets data
        // You can implement this based on your CSV structure
      });
      
  } catch (error) {
    console.error('❌ CSV import failed:', error);
  }
}

// Main import function
async function runImport() {
  const importType = process.argv[2] || 'sheets';
  
  if (importType === 'csv' && process.argv[3]) {
    await importFromCSV(process.argv[3]);
  } else {
    await importGoogleSheetsData();
  }
}

// Run import if this file is executed directly
if (require.main === module) {
  runImport();
}

module.exports = { importGoogleSheetsData, importFromCSV };


