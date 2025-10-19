/**
 * Verify Database Migration Script
 * 
 * This script checks if the user_id column exists in the generations table
 * and verifies the migration was applied successfully.
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function verifyMigration() {
  console.log('🔍 Verifying database migration...\n');

  // Check if environment variables are set
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE) {
    console.error('❌ Missing environment variables:');
    console.error('   SUPABASE_URL:', !!process.env.SUPABASE_URL);
    console.error('   SUPABASE_SERVICE_ROLE:', !!process.env.SUPABASE_SERVICE_ROLE);
    console.error('\n💡 Make sure your .env.local file has these variables set.');
    return false;
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE
  );

  try {
    // Check if user_id column exists in generations table
    console.log('1. Checking if user_id column exists...');
    const { data: columns, error: columnError } = await supabase
      .rpc('get_table_columns', { table_name: 'generations' });

    if (columnError) {
      // Fallback: try to query the table directly
      console.log('   Using fallback method...');
      const { data, error } = await supabase
        .from('generations')
        .select('user_id')
        .limit(1);
      
      if (error) {
        if (error.message.includes('user_id') || error.message.includes('column')) {
          console.log('   ❌ user_id column is missing from generations table');
          console.log('   📋 You need to run the migration from: MIGRATION_STEPS.md');
          return false;
        } else {
          console.log('   ❌ Error checking table:', error.message);
          return false;
        }
      } else {
        console.log('   ✅ user_id column exists in generations table');
      }
    } else {
      const hasUserId = columns?.some(col => col.column_name === 'user_id');
      if (hasUserId) {
        console.log('   ✅ user_id column exists in generations table');
      } else {
        console.log('   ❌ user_id column is missing from generations table');
        console.log('   📋 You need to run the migration from: MIGRATION_STEPS.md');
        return false;
      }
    }

    // Check if index exists
    console.log('\n2. Checking if index exists...');
    const { data: indexes, error: indexError } = await supabase
      .rpc('get_table_indexes', { table_name: 'generations' });

    if (indexError) {
      console.log('   ⚠️  Could not check indexes (this is okay)');
    } else {
      const hasUserIdIndex = indexes?.some(idx => idx.index_name === 'idx_generations_user_id');
      if (hasUserIdIndex) {
        console.log('   ✅ idx_generations_user_id index exists');
      } else {
        console.log('   ⚠️  idx_generations_user_id index not found (this is okay)');
      }
    }

    // Test inserting a record (dry run)
    console.log('\n3. Testing table structure...');
    const { error: testError } = await supabase
      .from('generations')
      .select('id, user_id, type, content')
      .limit(1);

    if (testError) {
      console.log('   ❌ Error testing table structure:', testError.message);
      return false;
    } else {
      console.log('   ✅ Table structure is correct');
    }

    console.log('\n🎉 Migration verification completed successfully!');
    console.log('✅ The user_id column exists and the table is ready');
    console.log('✅ Your form should now work without the "Failed to generate plan" error');
    
    return true;

  } catch (err) {
    console.error('❌ Verification failed:', err.message);
    return false;
  }
}

// Run verification
verifyMigration().then(success => {
  if (!success) {
    console.log('\n🚨 ACTION REQUIRED:');
    console.log('1. Follow the steps in MIGRATION_STEPS.md');
    console.log('2. Run the SQL commands in your Supabase dashboard');
    console.log('3. Run this script again to verify');
    process.exit(1);
  } else {
    console.log('\n✅ Database is ready! You can now test your form.');
    process.exit(0);
  }
});
