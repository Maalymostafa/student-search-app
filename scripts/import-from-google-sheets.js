const { createClient } = require('@supabase/supabase-js');
const { google } = require('googleapis');
require('dotenv').config();

// Google Sheets API setup
const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY || 'google-service-account.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const sheets = google.sheets({ version: 'v4', auth });

async function importFromGoogleSheets() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Supabase credentials not found');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log('📥 Importing Data Directly from Google Sheets...');
    console.log('');

    // Your Google Sheets IDs (replace with your actual sheet IDs)
    const sheetsConfig = [
      {
        name: 'Registration Form',
        sheetId: '1LvZOVJ9zsJ-24KWn2QAkxFE-SJ32HoyGQTnfYYPEqZ0',
        tabs: [
          { name: 'Form Responses 1', targetTable: 'students' }
        ]
      },
      {
        name: 'Performance Tracking',
        sheetId: '1beB1l393rTMkiYwEc8MKSCCrAEdiDfIJlnqaXAs1HKM',
        tabs: [
          { name: 'September', targetTable: 'student_performance' },
          { name: 'October', targetTable: 'student_performance' },
          { name: 'November', targetTable: 'student_performance' },
          { name: 'December', targetTable: 'student_performance' }
        ]
      },
      {
        name: 'Contact Information',
        sheetId: '15RDG22wiRDfq4ARmoJ3F7VNkE-mCC0Z0HwgwI0WsXUo',
        tabs: [
          { name: 'Parent Contacts', targetTable: 'student_contacts' },
          { name: 'Emergency Contacts', targetTable: 'student_contacts' },
          { name: 'WhatsApp Contacts', targetTable: 'student_contacts' }
        ]
      },
      {
        name: 'Review Data',
        sheetId: '18Vf9EXXziS4sqbzOU5UhhjQ20FYFgNzV9Sp69uhEuws',
        tabs: [
          { name: 'Monthly Reviews', targetTable: 'student_reviews' },
          { name: 'Revision Data', targetTable: 'student_reviews' },
          { name: 'Exam Results', targetTable: 'student_reviews' }
        ]
      },
      {
        name: 'Grade Specific',
        sheetId: '13DW-TMY9kMgkhVpdn1nouexUETx6rNcP9jvT4hfUjIc',
        tabs: [
          { name: 'Grade 4', targetTable: 'grade_specific_data' },
          { name: 'Grade 5', targetTable: 'grade_specific_data' },
          { name: 'Grade 6', targetTable: 'grade_specific_data' },
          { name: 'Prep 1', targetTable: 'grade_specific_data' }
        ]
      }
    ];

    for (const sheetConfig of sheetsConfig) {
      console.log(`📊 Processing: ${sheetConfig.name}`);
      
      for (const tab of sheetConfig.tabs) {
        try {
          console.log(`   📝 Importing tab: ${tab.name}`);
          
          // Read data from Google Sheet
          const response = await sheets.spreadsheets.values.get({
            spreadsheetId: sheetConfig.sheetId,
            range: tab.name,
          });

          const rows = response.data.values;
          
          if (!rows || rows.length === 0) {
            console.log(`   ⚠️  No data found in tab: ${tab.name}`);
            continue;
          }

          console.log(`   📊 Found ${rows.length} rows in ${tab.name}`);

          // Process data based on target table
          await processSheetData(supabase, tab.targetTable, rows, tab.name);
          
        } catch (error) {
          console.log(`   ❌ Error importing ${tab.name}:`, error.message);
        }
      }
    }

    console.log('');
    console.log('🎉 Google Sheets import completed!');

  } catch (error) {
    console.error('❌ Import failed:', error);
  }
}

async function processSheetData(supabase, targetTable, rows, tabName) {
  if (rows.length < 2) {
    console.log(`   ⚠️  Not enough data in ${tabName}`);
    return;
  }

  const headers = rows[0];
  const dataRows = rows.slice(1);

  let successCount = 0;
  let errorCount = 0;

  for (const row of dataRows) {
    try {
      // Create data object from headers and row
      const data = {};
      headers.forEach((header, index) => {
        if (row[index] !== undefined) {
          data[header.toLowerCase().replace(/\s+/g, '_')] = row[index];
        }
      });

      // Process data based on target table
      let processedData;
      
      switch (targetTable) {
        case 'students':
          processedData = processStudentData(data);
          break;
        case 'student_performance':
          processedData = processPerformanceData(data, tabName);
          break;
        case 'student_contacts':
          processedData = processContactData(data, tabName);
          break;
        case 'student_reviews':
          processedData = processReviewData(data, tabName);
          break;
        case 'grade_specific_data':
          processedData = processGradeSpecificData(data, tabName);
          break;
        default:
          processedData = data;
      }

      if (processedData) {
        const { error } = await supabase
          .from(targetTable)
          .upsert(processedData, { onConflict: 'student_code' });

        if (error) {
          console.log(`   ❌ Error inserting data:`, error.message);
          errorCount++;
        } else {
          successCount++;
        }
      }

    } catch (error) {
      console.log(`   ❌ Error processing row:`, error.message);
      errorCount++;
    }
  }

  console.log(`   ✅ ${successCount} records imported, ${errorCount} errors`);
}

function processStudentData(data) {
  return {
    student_code: data.student_code || data.code,
    full_name_arabic: data.full_name_arabic || data.name,
    grade_level: data.grade_level || data.grade,
    subscription_type: data.subscription_type,
    transfer_phone: data.transfer_phone,
    whatsapp_phone: data.whatsapp_phone,
    transfer_time: data.transfer_time,
    transfer_date: data.transfer_date,
    transfer_image_url: data.transfer_image_url,
    is_confirmed: !!data.transfer_image_url,
    enrollment_date: data.transfer_date || data.enrollment_date
  };
}

function processPerformanceData(data, tabName) {
  const month = tabName.toLowerCase();
  
  return {
    student_code: data.student_code || data.code,
    month: month,
    year: 2024,
    session1_perf: data.session1_perf || data.session_1_perf,
    session1_quiz: parseInt(data.session1_quiz) || 0,
    session2_perf: data.session2_perf || data.session_2_perf,
    session2_quiz: parseInt(data.session2_quiz) || 0,
    session3_perf: data.session3_perf || data.session_3_perf,
    session3_quiz: parseInt(data.session3_quiz) || 0,
    session4_perf: data.session4_perf || data.session_4_perf,
    session4_quiz: parseInt(data.session4_quiz) || 0,
    final_evaluation: data.final_evaluation,
    attendance_percentage: parseFloat(data.attendance_percentage) || 0,
    teacher_notes: data.teacher_notes || data.notes
  };
}

function processContactData(data, tabName) {
  return {
    student_code: data.student_code || data.code,
    contact_type: tabName.toLowerCase().includes('parent') ? 'parent' : 
                  tabName.toLowerCase().includes('emergency') ? 'emergency' : 'whatsapp',
    name: data.name || data.contact_name,
    phone: data.phone || data.contact_phone,
    email: data.email || data.contact_email,
    relationship: data.relationship,
    is_primary: tabName.toLowerCase().includes('parent')
  };
}

function processReviewData(data, tabName) {
  return {
    student_code: data.student_code || data.code,
    review_type: tabName.toLowerCase().includes('monthly') ? 'monthly' :
                 tabName.toLowerCase().includes('revision') ? 'revision' : 'exam',
    month: data.month,
    year: parseInt(data.year) || 2024,
    subject: data.subject,
    score: parseInt(data.score) || 0,
    grade: data.grade,
    feedback: data.feedback || data.teacher_feedback,
    teacher_name: data.teacher_name || data.teacher
  };
}

function processGradeSpecificData(data, tabName) {
  const gradeLevel = tabName.replace('Grade ', 'Grade ').replace('Prep ', 'Prep ');
  
  return {
    student_code: data.student_code || data.code,
    grade_level: gradeLevel,
    data_type: data.data_type || 'attendance',
    month: data.month,
    year: parseInt(data.year) || 2024,
    value: data.value,
    numeric_value: parseFloat(data.numeric_value) || 0,
    notes: data.notes,
    recorded_by: data.recorded_by || data.teacher
  };
}

// CSV import function (alternative method)
async function importFromCSV(csvDirectory) {
  console.log(`📥 Importing from CSV directory: ${csvDirectory}`);
  
  const fs = require('fs');
  const csv = require('csv-parser');
  const path = require('path');
  
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Supabase credentials not found');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
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
          
          // Determine target table based on filename
          let targetTable = 'students';
          if (csvFile.includes('performance')) targetTable = 'student_performance';
          if (csvFile.includes('contact')) targetTable = 'student_contacts';
          if (csvFile.includes('review')) targetTable = 'student_reviews';
          if (csvFile.includes('grade')) targetTable = 'grade_specific_data';
          
          // Process and import data
          await processCSVData(supabase, targetTable, results, csvFile);
        });
    }
      
  } catch (error) {
    console.error('❌ CSV import failed:', error);
  }
}

async function processCSVData(supabase, targetTable, data, filename) {
  let successCount = 0;
  let errorCount = 0;

  for (const row of data) {
    try {
      let processedData;
      
      switch (targetTable) {
        case 'students':
          processedData = processStudentData(row);
          break;
        case 'student_performance':
          processedData = processPerformanceData(row, filename);
          break;
        case 'student_contacts':
          processedData = processContactData(row, filename);
          break;
        case 'student_reviews':
          processedData = processReviewData(row, filename);
          break;
        case 'grade_specific_data':
          processedData = processGradeSpecificData(row, filename);
          break;
        default:
          processedData = row;
      }

      if (processedData) {
        const { error } = await supabase
          .from(targetTable)
          .upsert(processedData, { onConflict: 'student_code' });

        if (error) {
          console.log(`   ❌ Error inserting data:`, error.message);
          errorCount++;
        } else {
          successCount++;
        }
      }

    } catch (error) {
      console.log(`   ❌ Error processing row:`, error.message);
      errorCount++;
    }
  }

  console.log(`   ✅ ${successCount} records imported, ${errorCount} errors from ${filename}`);
}

// Main function
async function runImport() {
  const importType = process.argv[2] || 'sheets';
  
  if (importType === 'csv' && process.argv[3]) {
    await importFromCSV(process.argv[3]);
  } else {
    await importFromGoogleSheets();
  }
}

// Run if this file is executed directly
if (require.main === module) {
  runImport();
}

module.exports = { importFromGoogleSheets, importFromCSV };


