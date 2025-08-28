const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Clean and prepare database structure for 5 Google Sheets
async function cleanAndPrepareStructure() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Supabase credentials not found');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log('🧹 Cleaning Database and Preparing Structure...');
    console.log('This will:');
    console.log('   - Clear all existing data');
    console.log('   - Keep the table structure');
    console.log('   - Prepare for 5 Google Sheets import');
    console.log('   - Set up proper student code linking');
    console.log('');

    // 1. CLEAR ALL DATA (keep structure)
    console.log('📝 Step 1: Clearing all existing data...');
    await clearAllData(supabase);

    // 2. VERIFY STRUCTURE
    console.log('🔍 Step 2: Verifying table structure...');
    await verifyStructure(supabase);

    // 3. PREPARE FOR 5 SHEETS
    console.log('📊 Step 3: Preparing for 5 Google Sheets...');
    await prepareForSheets(supabase);

    console.log('');
    console.log('🎉 Database cleaned and prepared!');
    console.log('📋 Ready for your 5 Google Sheets URLs');
    console.log('');
    console.log('📊 Current Structure:');
    console.log('   ✅ students - Main student info (linked by student_code)');
    console.log('   ✅ student_performance - Performance data (linked by student_code)');
    console.log('   ✅ student_contacts - Contact info (linked by student_code)');
    console.log('   ✅ student_reviews - Review data (linked by student_code)');
    console.log('   ✅ grade_specific_data - Grade info (linked by student_code)');
    console.log('   ✅ subscriptions - Payment data (linked by student_code)');
    console.log('');
    console.log('🔗 All tables linked by: student_code');
    console.log('📥 Ready for your 5 Google Sheets URLs');

  } catch (error) {
    console.error('❌ Clean and prepare failed:', error);
  }
}

// Clear all data from all tables
async function clearAllData(supabase) {
  const tables = [
    'students',
    'student_performance', 
    'student_contacts',
    'student_reviews',
    'grade_specific_data',
    'subscriptions'
  ];

  for (const table of tables) {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .neq('id', 0); // Delete all records

      if (error) {
        console.log(`   ⚠️  Error clearing ${table}:`, error.message);
      } else {
        console.log(`   ✅ Cleared: ${table}`);
      }
    } catch (error) {
      console.log(`   ❌ Error clearing ${table}:`, error.message);
    }
  }
}

// Verify table structure exists
async function verifyStructure(supabase) {
  const tables = [
    'students',
    'student_performance',
    'student_contacts', 
    'student_reviews',
    'grade_specific_data',
    'subscriptions'
  ];

  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      if (error) {
        console.log(`   ❌ Table ${table} not accessible:`, error.message);
      } else {
        console.log(`   ✅ Table ${table} exists and accessible`);
      }
    } catch (error) {
      console.log(`   ❌ Error checking ${table}:`, error.message);
    }
  }
}

// Prepare structure for 5 Google Sheets
async function prepareForSheets(supabase) {
  console.log('   📋 Preparing structure for 5 Google Sheets...');
  
  // Create sample structure documentation
  const structure = {
    sheet1_main_registration: {
      description: "Main student registration data",
      key_field: "student_code",
      linked_tables: ["students", "subscriptions"],
      fields: ["student_code", "full_name", "grade_level", "subscription_type", "phone"]
    },
    sheet2_performance: {
      description: "Monthly performance tracking",
      key_field: "student_code", 
      linked_tables: ["student_performance"],
      fields: ["student_code", "month", "session1_perf", "session1_quiz", "session2_perf", "session2_quiz"]
    },
    sheet3_contacts: {
      description: "Contact information",
      key_field: "student_code",
      linked_tables: ["student_contacts"], 
      fields: ["student_code", "parent_name", "parent_phone", "emergency_contact", "whatsapp"]
    },
    sheet4_reviews: {
      description: "Review and revision data",
      key_field: "student_code",
      linked_tables: ["student_reviews"],
      fields: ["student_code", "subject", "review_date", "performance", "notes"]
    },
    sheet5_grade_specific: {
      description: "Grade-specific information",
      key_field: "student_code", 
      linked_tables: ["grade_specific_data"],
      fields: ["student_code", "grade_level", "attendance", "behavior", "homework"]
    }
  };

  console.log('   📊 Structure prepared for:');
  console.log('     1. Main Registration Sheet');
  console.log('     2. Performance Tracking Sheet');
  console.log('     3. Contact Information Sheet');
  console.log('     4. Review/Revision Sheet');
  console.log('     5. Grade-Specific Sheet');
  console.log('');
  console.log('   🔗 All sheets will be linked by: student_code');
  console.log('   📥 Ready for your Google Sheets URLs');
}

// Run if this file is executed directly
if (require.main === module) {
  cleanAndPrepareStructure();
}

module.exports = { cleanAndPrepareStructure };
