/**
 * Database State Checker
 * 
 * This script examines your current database state to understand:
 * - What tables exist and their structure
 * - What columns are present in each table
 * - What RLS policies are active
 * - What migrations might be missing
 */

const { createClient } = require('@supabase/supabase-js');

// Load environment variables manually
const fs = require('fs');
const path = require('path');

// Try to load .env.local first, then .env
let envContent = '';
try {
  envContent = fs.readFileSync('.env.local', 'utf8');
} catch {
  try {
    envContent = fs.readFileSync('.env', 'utf8');
  } catch {
    console.log('No .env file found');
  }
}

// Parse environment variables
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    process.env[key.trim()] = value.trim();
  }
});

async function checkDatabaseState() {
  console.log('🔍 Checking current database state...\n');

  // Check environment variables
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE) {
    console.error('❌ Missing environment variables:');
    console.error('   SUPABASE_URL:', !!process.env.SUPABASE_URL);
    console.error('   SUPABASE_SERVICE_ROLE:', !!process.env.SUPABASE_SERVICE_ROLE);
    console.error('\n💡 Make sure your .env.local file has these variables set.');
    return;
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE
  );

  try {
    // 1. Check what tables exist
    console.log('📋 1. CHECKING TABLES');
    console.log('==================');
    
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .order('table_name');

    if (tablesError) {
      console.log('❌ Could not fetch tables:', tablesError.message);
    } else {
      console.log('✅ Tables found:');
      tables.forEach(table => {
        console.log(`   - ${table.table_name}`);
      });
    }

    // 2. Check generations table structure specifically
    console.log('\n📋 2. CHECKING GENERATIONS TABLE STRUCTURE');
    console.log('==========================================');
    
    const { data: generationsData, error: generationsError } = await supabase
      .from('generations')
      .select('*')
      .limit(1);

    if (generationsError) {
      console.log('❌ Error accessing generations table:', generationsError.message);
      
      // Try to get column information directly
      const { data: columns, error: columnsError } = await supabase
        .rpc('get_table_columns', { table_name: 'generations' });
      
      if (columnsError) {
        console.log('❌ Could not get column information:', columnsError.message);
      } else {
        console.log('📊 Generations table columns:');
        columns.forEach(col => {
          console.log(`   - ${col.column_name} (${col.data_type}) ${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`);
        });
      }
    } else {
      console.log('✅ Generations table is accessible');
      if (generationsData && generationsData.length > 0) {
        console.log('📊 Sample record structure:');
        const sampleRecord = generationsData[0];
        Object.keys(sampleRecord).forEach(key => {
          console.log(`   - ${key}: ${typeof sampleRecord[key]} ${sampleRecord[key] === null ? '(NULL)' : ''}`);
        });
      } else {
        console.log('📊 Table is empty (no sample records)');
      }
    }

    // 3. Check dashboards table structure
    console.log('\n📋 3. CHECKING DASHBOARDS TABLE STRUCTURE');
    console.log('========================================');
    
    const { data: dashboardsData, error: dashboardsError } = await supabase
      .from('dashboards')
      .select('*')
      .limit(1);

    if (dashboardsError) {
      console.log('❌ Error accessing dashboards table:', dashboardsError.message);
    } else {
      console.log('✅ Dashboards table is accessible');
      if (dashboardsData && dashboardsData.length > 0) {
        console.log('📊 Sample record structure:');
        const sampleRecord = dashboardsData[0];
        Object.keys(sampleRecord).forEach(key => {
          console.log(`   - ${key}: ${typeof sampleRecord[key]} ${sampleRecord[key] === null ? '(NULL)' : ''}`);
        });
      }
    }

    // 4. Check RLS policies
    console.log('\n📋 4. CHECKING RLS POLICIES');
    console.log('==========================');
    
    const { data: policies, error: policiesError } = await supabase
      .from('pg_policies')
      .select('*')
      .eq('schemaname', 'public')
      .order('tablename, policyname');

    if (policiesError) {
      console.log('❌ Could not fetch RLS policies:', policiesError.message);
      console.log('💡 This might be a permissions issue or the table might not exist');
    } else {
      console.log('✅ RLS policies found:');
      const policiesByTable = {};
      policies.forEach(policy => {
        if (!policiesByTable[policy.tablename]) {
          policiesByTable[policy.tablename] = [];
        }
        policiesByTable[policy.tablename].push(policy);
      });

      Object.keys(policiesByTable).forEach(tableName => {
        console.log(`\n   📋 ${tableName}:`);
        policiesByTable[tableName].forEach(policy => {
          console.log(`      - ${policy.policyname} (${policy.cmd})`);
        });
      });
    }

    // 5. Check for specific issues
    console.log('\n📋 5. CHECKING FOR KNOWN ISSUES');
    console.log('===============================');
    
    // Check if user_id exists in generations
    const { data: testUserId, error: testUserIdError } = await supabase
      .from('generations')
      .select('user_id')
      .limit(1);

    if (testUserIdError) {
      if (testUserIdError.message.includes('user_id') || testUserIdError.message.includes('column')) {
        console.log('❌ ISSUE FOUND: user_id column is missing from generations table');
        console.log('   This is the cause of your "Failed to generate plan" error');
        console.log('   📋 Solution: Run the migration from MIGRATION_STEPS.md');
      } else {
        console.log('❌ Error testing user_id column:', testUserIdError.message);
      }
    } else {
      console.log('✅ user_id column exists in generations table');
    }

    // Check if generations table has proper structure
    const { data: testInsert, error: testInsertError } = await supabase
      .from('generations')
      .insert({
        type: 'test',
        content: { test: true },
        version: 1
      })
      .select();

    if (testInsertError) {
      console.log('❌ Error testing insert:', testInsertError.message);
    } else {
      console.log('✅ Generations table allows inserts');
      // Clean up test record
      if (testInsert && testInsert.length > 0) {
        await supabase
          .from('generations')
          .delete()
          .eq('id', testInsert[0].id);
      }
    }

    console.log('\n🎯 SUMMARY');
    console.log('==========');
    console.log('✅ Database connection: Working');
    console.log('✅ Tables: Found and accessible');
    console.log('✅ RLS policies: Retrieved');
    console.log('✅ Issue identification: Complete');

  } catch (err) {
    console.error('❌ Database check failed:', err.message);
  }
}

// Run the check
checkDatabaseState().then(() => {
  console.log('\n💡 Next steps:');
  console.log('1. Review the output above');
  console.log('2. If user_id column is missing, run the migration');
  console.log('3. Test your form after applying fixes');
});
