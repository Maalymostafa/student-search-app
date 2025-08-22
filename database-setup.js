const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Database setup script for Supabase
async function setupSupabase() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Supabase credentials not found in environment variables');
    console.log('Please set SUPABASE_URL and SUPABASE_ANON_KEY');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log('🚀 Setting up Supabase database...');

    // Create tables using SQL
    const tables = ['g4', 'g5', 'g6', 'p1'];
    
    for (const table of tables) {
      console.log(`Creating table: ${table}`);
      
      const { error } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS ${table} (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            is_confirmed BOOLEAN DEFAULT false,
            student_code TEXT UNIQUE NOT NULL,
            september JSONB DEFAULT '{}',
            october JSONB DEFAULT '{}',
            november JSONB DEFAULT '{}',
            december JSONB DEFAULT '{}'
          );
        `
      });

      if (error) {
        console.log(`⚠️  Table ${table} might already exist or error:`, error.message);
      } else {
        console.log(`✅ Table ${table} created successfully`);
      }
    }

    // Add sample data
    console.log('📝 Adding sample data...');
    
    const sampleData = [
      {
        table: 'g4',
        data: {
          name: 'Ahmed Mohamed',
          is_confirmed: true,
          student_code: 'G4001',
          september: {
            session1_perf: 'A',
            session1_quiz: '90',
            session2_perf: 'A',
            session2_quiz: '85',
            session3_perf: 'B+',
            session3_quiz: '88',
            session4_perf: 'A',
            session4_quiz: '92'
          },
          october: {
            session1_perf: 'A',
            session1_quiz: '95',
            session2_perf: 'A',
            session2_quiz: '87',
            session3_perf: 'A',
            session3_quiz: '91',
            session4_perf: 'B+',
            session4_quiz: '89'
          },
          november: {
            session1_perf: 'A',
            session1_quiz: '93',
            session2_perf: 'A',
            session2_quiz: '88',
            session3_perf: 'A',
            session3_quiz: '90',
            session4_perf: 'A',
            session4_quiz: '94'
          },
          december: {
            session1_perf: 'A',
            session1_quiz: '96',
            session2_perf: 'A',
            session2_quiz: '89',
            session3_perf: 'A',
            session3_quiz: '92',
            session4_perf: 'A',
            session4_quiz: '95'
          }
        }
      },
      {
        table: 'g5',
        data: {
          name: 'Fatima Ali',
          is_confirmed: true,
          student_code: 'G5001',
          september: {
            session1_perf: 'A',
            session1_quiz: '88',
            session2_perf: 'B+',
            session2_quiz: '82',
            session3_perf: 'A',
            session3_quiz: '90',
            session4_perf: 'A',
            session4_quiz: '87'
          },
          october: {
            session1_perf: 'A',
            session1_quiz: '92',
            session2_perf: 'A',
            session2_quiz: '85',
            session3_perf: 'B+',
            session3_quiz: '88',
            session4_perf: 'A',
            session4_quiz: '91'
          },
          november: {
            session1_perf: 'A',
            session1_quiz: '89',
            session2_perf: 'A',
            session2_quiz: '93',
            session3_perf: 'A',
            session3_quiz: '86',
            session4_perf: 'B+',
            session4_quiz: '90'
          },
          december: {
            session1_perf: 'A',
            session1_quiz: '94',
            session2_perf: 'A',
            session2_quiz: '88',
            session3_perf: 'A',
            session3_quiz: '91',
            session4_perf: 'A',
            session4_quiz: '93'
          }
        }
      }
    ];

    for (const item of sampleData) {
      const { error } = await supabase
        .from(item.table)
        .insert(item.data);

      if (error) {
        console.log(`⚠️  Error adding sample data to ${item.table}:`, error.message);
      } else {
        console.log(`✅ Sample data added to ${item.table}`);
      }
    }

    console.log('🎉 Database setup completed successfully!');
    console.log('You can now run the application with: npm run dev');

  } catch (error) {
    console.error('❌ Database setup failed:', error);
  }
}

// Firebase setup function (placeholder)
async function setupFirebase() {
  console.log('🔥 Firebase setup not implemented yet');
  console.log('Please set up Firebase manually using the Firebase Console');
}

// Main setup function
async function setupDatabase() {
  const dbType = process.env.DB_TYPE || 'supabase';
  
  console.log(`🗄️  Setting up ${dbType.toUpperCase()} database...`);
  
  if (dbType === 'supabase') {
    await setupSupabase();
  } else if (dbType === 'firebase') {
    await setupFirebase();
  } else {
    console.log('❌ Unknown database type. Please set DB_TYPE to "supabase" or "firebase"');
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase };
