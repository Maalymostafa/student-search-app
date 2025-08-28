const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Import performance data from Google Sheets
async function importPerformanceData() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Supabase credentials not found');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log('📊 Importing Performance Data...');
    console.log('This handles performance tracking sheets for:');
    console.log('   - Grade 4, 5, 6, Prep 1');
    console.log('   - Monthly performance records');
    console.log('   - Session-based grading');
    console.log('   - Quiz scores and attendance');
    console.log('');

    // Sample performance data structure (you can replace with actual CSV import)
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
      },
      {
        student_code: 'P1001',
        month: 'september',
        year: 2024,
        session1_perf: 'A',
        session1_quiz: 92,
        session2_perf: 'A',
        session2_quiz: 88,
        session3_perf: 'A',
        session3_quiz: 90,
        session4_perf: 'A',
        session4_quiz: 94,
        final_evaluation: 'A',
        attendance_percentage: 96.0,
        teacher_notes: 'Outstanding performance'
      }
    ];

    console.log(`📝 Processing ${performanceData.length} performance records...`);

    let successCount = 0;
    let errorCount = 0;

    for (const performance of performanceData) {
      try {
        // Find student by code
        const { data: student, error: studentError } = await supabase
          .from('students')
          .select('id')
          .eq('student_code', performance.student_code)
          .single();

        if (studentError || !student) {
          console.log(`⚠️  Student not found: ${performance.student_code}`);
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
          console.log(`❌ Error adding performance for ${performance.student_code}:`, error.message);
          errorCount++;
        } else {
          console.log(`✅ Performance added: ${performance.student_code} - ${performance.month} ${performance.year}`);
          successCount++;
        }

      } catch (error) {
        console.log(`❌ Error processing ${performance.student_code}:`, error.message);
        errorCount++;
      }
    }

    console.log('');
    console.log('📊 Performance Import Summary:');
    console.log(`✅ Successfully imported: ${successCount} records`);
    console.log(`❌ Errors: ${errorCount} records`);
    console.log(`📈 Total processed: ${performanceData.length} records`);

    // Generate import report
    const report = {
      timestamp: new Date().toISOString(),
      import_type: 'performance',
      total_records: performanceData.length,
      successful_imports: successCount,
      failed_imports: errorCount,
      grade_distribution: {}
    };

    // Calculate grade distribution
    for (const performance of performanceData) {
      const grade = performance.student_code.substring(0, 2);
      report.grade_distribution[grade] = (report.grade_distribution[grade] || 0) + 1;
    }

    // Save report
    const reportPath = path.join(__dirname, '../logs/performance-import-report.json');
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log('📄 Performance import report saved to: logs/performance-import-report.json');

  } catch (error) {
    console.error('❌ Performance import failed:', error);
  }
}

// CSV import function for performance data
async function importPerformanceFromCSV(csvFilePath) {
  console.log(`📥 Importing performance data from CSV: ${csvFilePath}`);
  
  try {
    const csv = require('csv-parser');
    const fs = require('fs');
    
    const results = [];
    
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        console.log(`📊 Found ${results.length} performance records in CSV`);
        // Process CSV data similar to performance data
        // You can implement this based on your CSV structure
      });
      
  } catch (error) {
    console.error('❌ CSV import failed:', error);
  }
}

// Main import function
async function runPerformanceImport() {
  const importType = process.argv[2] || 'sample';
  
  if (importType === 'csv' && process.argv[3]) {
    await importPerformanceFromCSV(process.argv[3]);
  } else {
    await importPerformanceData();
  }
}

// Run import if this file is executed directly
if (require.main === module) {
  runPerformanceImport();
}

module.exports = { importPerformanceData, importPerformanceFromCSV };
