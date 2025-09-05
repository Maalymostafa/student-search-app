#!/usr/bin/env node

/**
 * Test Database Connection Script
 * This script tests your Supabase connection and verifies table structure
 */

const { createClient } = require('@supabase/supabase-js');

// Configuration - UPDATE THESE WITH YOUR CREDENTIALS
const SUPABASE_URL = 'YOUR_SUPABASE_URL_HERE';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testDatabaseConnection() {
  log('\n🚀 Testing Student Search App Database Connection', 'bright');
  log('================================================\n', 'blue');

  // Check if credentials are set
  if (SUPABASE_URL === 'YOUR_SUPABASE_URL_HERE' || SUPABASE_ANON_KEY === 'YOUR_SUPABASE_ANON_KEY_HERE') {
    log('❌ Error: Please update the credentials in this script first!', 'red');
    log('\n📋 To update credentials:', 'yellow');
    log('1. Open this file: test-database-connection.js', 'cyan');
    log('2. Replace YOUR_SUPABASE_URL_HERE with your actual Supabase URL', 'cyan');
    log('3. Replace YOUR_SUPABASE_ANON_KEY_HERE with your actual anon key', 'cyan');
    log('4. Save the file and run this script again', 'cyan');
    return;
  }

  try {
    log('🔌 Creating Supabase client...', 'blue');
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    log('✅ Supabase client created successfully', 'green');

    // Test 1: Basic Connection
    log('\n📡 Test 1: Testing basic connection...', 'yellow');
    const { data: testData, error: testError } = await supabase
      .from('students')
      .select('count')
      .limit(1);
    
    if (testError) {
      log(`❌ Connection failed: ${testError.message}`, 'red');
      return;
    }
    
    log('✅ Basic connection successful', 'green');

    // Test 2: Check Table Structure
    log('\n📊 Test 2: Checking table structure...', 'yellow');
    
    const tables = [
      'students',
      'student_performance', 
      'subscriptions',
      'student_contacts',
      'student_reviews',
      'grade_specific_data'
    ];

    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          log(`❌ Table '${table}': ${error.message}`, 'red');
        } else {
          log(`✅ Table '${table}': Accessible`, 'green');
        }
      } catch (err) {
        log(`❌ Table '${table}': ${err.message}`, 'red');
      }
    }

    // Test 3: Check Authentication Tables
    log('\n🔐 Test 3: Checking authentication tables...', 'yellow');
    
    const authTables = [
      'users',
      'student_users',
      'parent_users',
      'password_reset_tokens',
      'login_attempts'
    ];

    for (const table of authTables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          log(`❌ Auth table '${table}': ${error.message}`, 'red');
        } else {
          log(`✅ Auth table '${table}': Accessible`, 'green');
        }
      } catch (err) {
        log(`❌ Auth table '${table}': ${err.message}`, 'red');
      }
    }

    // Test 4: Count Records
    log('\n🔢 Test 4: Counting records in main tables...', 'yellow');
    
    try {
      const { count: studentCount, error: studentError } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true });
      
      if (studentError) {
        log(`❌ Error counting students: ${studentError.message}`, 'red');
      } else {
        log(`📊 Students table: ${studentCount || 0} records`, 'cyan');
      }
    } catch (err) {
      log(`❌ Error counting students: ${err.message}`, 'red');
    }

    // Test 5: Test Search Functionality
    log('\n🔍 Test 5: Testing search functionality...', 'yellow');
    
    try {
      const { data: searchResults, error: searchError } = await supabase
        .from('students')
        .select('student_code, full_name_arabic')
        .ilike('full_name_arabic', '%test%')
        .limit(5);
      
      if (searchError) {
        log(`❌ Search test failed: ${searchError.message}`, 'red');
      } else {
        log(`✅ Search functionality working (${searchResults?.length || 0} results)`, 'green');
      }
    } catch (err) {
      log(`❌ Search test failed: ${err.message}`, 'red');
    }

    log('\n🎉 Database connection test completed!', 'bright');
    
    // Summary
    log('\n📋 Summary:', 'yellow');
    log('• If you see mostly ✅ green checkmarks: Your database is ready!', 'green');
    log('• If you see ❌ red X marks: Some tables need to be created', 'red');
    log('• Run the SQL scripts in Supabase if tables are missing', 'cyan');
    
    log('\n📱 Next Steps:', 'yellow');
    log('1. Install the APK on your phone', 'cyan');
    log('2. Test the app with empty database', 'cyan');
    log('3. Import your Google Sheets data', 'cyan');
    log('4. Test with real data', 'cyan');

  } catch (error) {
    log(`\n💥 Fatal error: ${error.message}`, 'red');
    log('\n🔧 Troubleshooting:', 'yellow');
    log('• Check your internet connection', 'cyan');
    log('• Verify your Supabase credentials', 'cyan');
    log('• Make sure your Supabase project is active', 'cyan');
  }
}

// Run the test
testDatabaseConnection();
