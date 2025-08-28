const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Manual database update script that works with existing grade tables
async function updateDatabaseManually() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Supabase credentials not found');
    console.log('Please check your .env file for SUPABASE_URL and SUPABASE_ANON_KEY');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('🚀 Starting manual database update...');

  // New student data to add (based on your Google Sheets)
  const newStudents = [
    {
      name: 'فارس سامح عيد سالم',
      grade: 'g4',
      student_code: 'G4002',
      is_confirmed: true,
      september: {
        session1_perf: 'A',
        session1_quiz: '90',
        session2_perf: 'A',
        session2_quiz: '88'
      }
    },
    {
      name: 'رقيه إسلام جميل قطب',
      grade: 'g5',
      student_code: 'G5003',
      is_confirmed: true,
      october: {
        session1_perf: 'A',
        session1_quiz: '92',
        session2_perf: 'B+',
        session2_quiz: '85'
      }
    },
    {
      name: 'سما محمد وفاي',
      grade: 'g5',
      student_code: 'G5004',
      is_confirmed: true,
      november: {
        session1_perf: 'B+',
        session1_quiz: '87',
        session2_perf: 'A',
        session2_quiz: '91'
      }
    },
    {
      name: 'لمار محمد السيد عبدالحميد الشاذلي',
      grade: 'g5',
      student_code: 'G5005',
      is_confirmed: true,
      december: {
        session1_perf: 'A',
        session1_quiz: '93',
        session2_perf: 'A',
        session2_quiz: '89'
      }
    },
    {
      name: 'ايسل اسامه الشحات احمد',
      grade: 'g5',
      student_code: 'G5006',
      is_confirmed: true,
      september: {
        session1_perf: 'A',
        session1_quiz: '94',
        session2_perf: 'A',
        session2_quiz: '90'
      }
    },
    {
      name: 'عبد الرحمن جودت عيد عبد الفتاح',
      grade: 'g5',
      student_code: 'G5007',
      is_confirmed: true,
      october: {
        session1_perf: 'A',
        session1_quiz: '91',
        session2_perf: 'A',
        session2_quiz: '88'
      }
    },
    {
      name: 'فريده عماد السيد ثابت',
      grade: 'g6',
      student_code: 'G6002',
      is_confirmed: true,
      november: {
        session1_perf: 'B+',
        session1_quiz: '86',
        session2_perf: 'A',
        session2_quiz: '92'
      }
    },
    {
      name: 'هنا وائل محمد',
      grade: 'p1',
      student_code: 'P1002',
      is_confirmed: true,
      december: {
        session1_perf: 'A',
        session1_quiz: '95',
        session2_perf: 'A',
        session2_quiz: '93'
      }
    }
  ];

  let successCount = 0;
  let errorCount = 0;

  console.log(`📊 Processing ${newStudents.length} students...`);

  for (const student of newStudents) {
    try {
      // Check if student already exists
      const { data: existingStudent } = await supabase
        .from(student.grade)
        .select('student_code')
        .eq('student_code', student.student_code)
        .single();

      if (existingStudent) {
        console.log(`⚠️  Student ${student.student_code} already exists - updating...`);

        // Update existing student
        const { error } = await supabase
          .from(student.grade)
          .update({
            name: student.name,
            is_confirmed: student.is_confirmed,
            september: student.september || {},
            october: student.october || {},
            november: student.november || {},
            december: student.december || {}
          })
          .eq('student_code', student.student_code);

        if (error) {
          console.log(`❌ Error updating ${student.name}:`, error.message);
          errorCount++;
        } else {
          console.log(`🔄 Updated: ${student.student_code} - ${student.name}`);
          successCount++;
        }
      } else {
        // Insert new student
        const { error } = await supabase
          .from(student.grade)
          .insert({
            name: student.name,
            student_code: student.student_code,
            is_confirmed: student.is_confirmed,
            september: student.september || {},
            october: student.october || {},
            november: student.november || {},
            december: student.december || {}
          });

        if (error) {
          console.log(`❌ Error adding ${student.name}:`, error.message);
          errorCount++;
        } else {
          console.log(`✅ Added: ${student.student_code} - ${student.name}`);
          successCount++;
        }
      }
    } catch (error) {
      console.log(`❌ Error processing ${student.name}:`, error.message);
      errorCount++;
    }
  }

  console.log('');
  console.log('📊 Update Summary:');
  console.log(`✅ Successfully processed: ${successCount} students`);
  console.log(`❌ Errors: ${errorCount} students`);
  console.log(`📈 Total processed: ${newStudents.length} students`);

  // Show current database stats
  try {
    console.log('');
    console.log('📈 Current Database Stats:');

    const grades = ['g4', 'g5', 'g6', 'p1'];
    for (const grade of grades) {
      const { count } = await supabase
        .from(grade)
        .select('*', { count: 'exact', head: true });
      console.log(`   ${grade.toUpperCase()}: ${count || 0} students`);
    }
  } catch (error) {
    console.log('⚠️  Could not fetch database stats');
  }
}

// Update performance data for existing students
async function updatePerformanceData() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Supabase credentials not found');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('📊 Updating performance data...');

  // Performance updates for existing students
  const performanceUpdates = [
    {
      student_code: 'G4001',
      grade: 'g4',
      month: 'december',
      data: {
        session1_perf: 'A',
        session1_quiz: '96',
        session2_perf: 'A',
        session2_quiz: '94',
        session3_perf: 'A',
        session3_quiz: '92',
        session4_perf: 'A',
        session4_quiz: '95'
      }
    },
    {
      student_code: 'G5001',
      grade: 'g5',
      month: 'december',
      data: {
        session1_perf: 'A',
        session1_quiz: '93',
        session2_perf: 'B+',
        session2_quiz: '89',
        session3_perf: 'A',
        session3_quiz: '91',
        session4_perf: 'A',
        session4_quiz: '94'
      }
    }
  ];

  for (const update of performanceUpdates) {
    try {
      // Get current student data
      const { data: student, error: fetchError } = await supabase
        .from(update.grade)
        .select('*')
        .eq('student_code', update.student_code)
        .single();

      if (fetchError || !student) {
        console.log(`⚠️  Student ${update.student_code} not found`);
        continue;
      }

      // Update the specific month's data
      const updatedMonthData = {
        ...student[update.month],
        ...update.data
      };

      const { error: updateError } = await supabase
        .from(update.grade)
        .update({
          [update.month]: updatedMonthData
        })
        .eq('student_code', update.student_code);

      if (updateError) {
        console.log(`❌ Error updating performance for ${update.student_code}:`, updateError.message);
      } else {
        console.log(`✅ Updated performance for ${update.student_code} (${update.month})`);
      }
    } catch (error) {
      console.log(`❌ Error processing ${update.student_code}:`, error.message);
    }
  }
}

// Add new performance data for a month
async function addMonthlyPerformance(month = 'january') {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Supabase credentials not found');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log(`📅 Adding ${month} performance data for all students...`);

  const grades = ['g4', 'g5', 'g6', 'p1'];

  for (const grade of grades) {
    try {
      // Get all students in this grade
      const { data: students, error } = await supabase
        .from(grade)
        .select('student_code, name');

      if (error) {
        console.log(`❌ Error fetching ${grade} students:`, error.message);
        continue;
      }

      console.log(`Processing ${students.length} students in ${grade.toUpperCase()}...`);

      for (const student of students) {
        // Add default performance structure for the new month
        const monthlyPerformance = {
          session1_perf: '',
          session1_quiz: '',
          session2_perf: '',
          session2_quiz: '',
          session3_perf: '',
          session3_quiz: '',
          session4_perf: '',
          session4_quiz: ''
        };

        const { error: updateError } = await supabase
          .from(grade)
          .update({
            [month]: monthlyPerformance
          })
          .eq('student_code', student.student_code);

        if (updateError) {
          console.log(`❌ Error adding ${month} data for ${student.student_code}:`, updateError.message);
        } else {
          console.log(`✅ Added ${month} structure for ${student.student_code}`);
        }
      }
    } catch (error) {
      console.log(`❌ Error processing ${grade}:`, error.message);
    }
  }
}

// Main function
async function main() {
  const operation = process.argv[2] || 'update';

  switch (operation) {
    case 'update':
    case 'add':
      await updateDatabaseManually();
      break;
    case 'performance':
      await updatePerformanceData();
      break;
    case 'month':
      const month = process.argv[3] || 'january';
      await addMonthlyPerformance(month);
      break;
    default:
      console.log('Usage:');
      console.log('  node update-database-manual.js update    # Add/update students');
      console.log('  node update-database-manual.js performance # Update performance data');
      console.log('  node update-database-manual.js month [month_name] # Add monthly structure');
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { updateDatabaseManually, updatePerformanceData, addMonthlyPerformance };
