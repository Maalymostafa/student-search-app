const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Database verification script
async function verifyDatabase() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Supabase credentials not found');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('🔍 Verifying database update...');
  console.log('');

  // Test database connection
  try {
    const { data, error } = await supabase.from('g4').select('count', { count: 'exact', head: true });
    if (error) {
      console.log('❌ Database connection failed:', error.message);
      return;
    }
    console.log('✅ Database connection successful');
  } catch (error) {
    console.log('❌ Database connection error:', error.message);
    return;
  }

  console.log('');

  // Verify each grade table
  const grades = ['g4', 'g5', 'g6', 'p1'];
  let totalStudents = 0;

  for (const grade of grades) {
    try {
      const { data: students, error, count } = await supabase
        .from(grade)
        .select('*', { count: 'exact' });

      if (error) {
        console.log(`❌ Error fetching ${grade.toUpperCase()} students:`, error.message);
        continue;
      }

      console.log(`📊 ${grade.toUpperCase()}: ${count} students`);
      totalStudents += count;

      // Show recent students (last 3)
      if (students && students.length > 0) {
        const recent = students.slice(-3);
        recent.forEach(student => {
          console.log(`   - ${student.student_code}: ${student.name} ${student.is_confirmed ? '✅' : '⚠️'}`);
        });
      }
      console.log('');
    } catch (error) {
      console.log(`❌ Error processing ${grade}:`, error.message);
    }
  }

  console.log(`📈 Total students in database: ${totalStudents}`);
  console.log('');

  // Test specific newly added students
  console.log('🔍 Verifying newly added students:');
  const newStudentCodes = ['G4002', 'G5003', 'G5004', 'G5005', 'G5006', 'G5007', 'G6002', 'P1002'];

  for (const code of newStudentCodes) {
    try {
      const grade = code.toLowerCase().substring(0, 2);
      const { data: student, error } = await supabase
        .from(grade)
        .select('*')
        .eq('student_code', code)
        .single();

      if (error) {
        console.log(`❌ ${code}: Not found`);
      } else {
        console.log(`✅ ${code}: ${student.name} (confirmed: ${student.is_confirmed})`);

        // Check if they have performance data
        const months = ['september', 'october', 'november', 'december'];
        const hasPerformance = months.some(month =>
          student[month] && Object.keys(student[month]).length > 0
        );
        if (hasPerformance) {
          console.log(`   📊 Has performance data`);
        }
      }
    } catch (error) {
      console.log(`❌ ${code}: Error -`, error.message);
    }
  }

  console.log('');

  // Test search functionality
  console.log('🔍 Testing search functionality:');
  try {
    const testCode = 'G4002';
    const grade = testCode.toLowerCase().substring(0, 2);

    const { data: searchResult, error } = await supabase
      .from(grade)
      .select('*')
      .eq('student_code', testCode)
      .single();

    if (error) {
      console.log(`❌ Search test failed for ${testCode}:`, error.message);
    } else {
      console.log(`✅ Search test successful for ${testCode}:`);
      console.log(`   Name: ${searchResult.name}`);
      console.log(`   Confirmed: ${searchResult.is_confirmed}`);

      // Show performance data if available
      const months = ['september', 'october', 'november', 'december'];
      months.forEach(month => {
        if (searchResult[month] && Object.keys(searchResult[month]).length > 0) {
          console.log(`   ${month}: ${JSON.stringify(searchResult[month])}`);
        }
      });
    }
  } catch (error) {
    console.log('❌ Search test error:', error.message);
  }

  console.log('');
  console.log('✅ Database verification completed!');
}

// Performance data verification
async function verifyPerformanceData() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('📊 Verifying performance data...');

  const testStudents = [
    { code: 'G4001', grade: 'g4' },
    { code: 'G5001', grade: 'g5' }
  ];

  for (const student of testStudents) {
    try {
      const { data, error } = await supabase
        .from(student.grade)
        .select('*')
        .eq('student_code', student.code)
        .single();

      if (error) {
        console.log(`❌ ${student.code}: Not found`);
        continue;
      }

      console.log(`✅ ${student.code}: ${data.name}`);

      const months = ['september', 'october', 'november', 'december'];
      months.forEach(month => {
        if (data[month] && Object.keys(data[month]).length > 0) {
          const monthData = data[month];
          const sessions = Object.keys(monthData).filter(key => key.includes('session')).length / 2;
          console.log(`   ${month}: ${sessions} sessions recorded`);
        }
      });
    } catch (error) {
      console.log(`❌ ${student.code}: Error -`, error.message);
    }
  }
}

// Main execution
async function main() {
  await verifyDatabase();
  console.log('');
  await verifyPerformanceData();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { verifyDatabase, verifyPerformanceData };
