#!/usr/bin/env node

/**
 * Environment Variable Validation Script
 * 
 * Run this to verify all required environment variables are set correctly
 * Usage: node scripts/validate-env.js
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Required environment variables with validation rules
const requiredVars = {
  OPENAI_API_KEY: {
    required: true,
    validate: (val) => val && val.startsWith('sk-') && !val.includes('xxx'),
    error: 'Must start with "sk-" and cannot be a placeholder value (xxxxx)',
  },
  SUPABASE_SERVICE_ROLE_KEY: {
    required: true,
    validate: (val) => val && val.startsWith('eyJ') && val.length > 100,
    error: 'Must be a valid JWT token (starts with "eyJ" and is > 100 chars)',
  },
  NEXT_PUBLIC_SUPABASE_URL: {
    required: true,
    validate: (val) => val && val.startsWith('http'),
    error: 'Must be a valid URL starting with "http"',
  },
  NEXT_PUBLIC_SUPABASE_ANON_KEY: {
    required: true,
    validate: (val) => val && val.startsWith('eyJ'),
    error: 'Must be a valid JWT token (starts with "eyJ")',
  },
  SUPABASE_URL: {
    required: true,
    validate: (val) => val && val.startsWith('http'),
    error: 'Must be a valid URL starting with "http"',
  },
  SUPABASE_ANON_KEY: {
    required: true,
    validate: (val) => val && val.startsWith('eyJ'),
    error: 'Must be a valid JWT token (starts with "eyJ")',
  },
};

// Optional environment variables
const optionalVars = {
  RESEND_API_KEY: {
    validate: (val) => !val || val.startsWith('re_'),
    error: 'Should start with "re_" if provided',
  },
  RESEND_FROM_EMAIL: {
    validate: (val) => !val || val.includes('@'),
    error: 'Should be a valid email address if provided',
  },
  NEXT_PUBLIC_GA4_ID: {
    validate: (val) => !val || val.startsWith('G-'),
    error: 'Should start with "G-" if provided',
  },
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const vars = {};

  // Handle different line endings (CRLF for Windows, LF for Unix)
  const lines = content.split(/\r?\n/);
  
  lines.forEach((line) => {
    // Remove BOM if present
    line = line.replace(/^\uFEFF/, '');
    
    // Skip comments and empty lines
    const trimmed = line.trim();
    if (trimmed.startsWith('#') || !trimmed) {
      return;
    }

    // Parse KEY=VALUE (handle quotes and spaces)
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      let key = match[1].trim();
      let value = match[2].trim();
      
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      vars[key] = value;
    }
  });

  return vars;
}

function validateEnv() {
  log('\n' + '='.repeat(60), 'cyan');
  log('  ALIRA Environment Variable Validation', 'cyan');
  log('='.repeat(60) + '\n', 'cyan');

  // Load .env.local
  const envLocalPath = path.join(process.cwd(), '.env.local');
  log(`Checking ${envLocalPath}...`, 'blue');

  const envVars = loadEnvFile(envLocalPath);
  
  if (!envVars) {
    log('❌ ERROR: .env.local file not found!', 'red');
    log('\nCreate a .env.local file by copying env.example:', 'yellow');
    log('  cp env.example .env.local\n', 'yellow');
    process.exit(1);
  }

  log(`✅ Found .env.local file\n`, 'green');

  let hasErrors = false;
  let hasWarnings = false;

  // Validate required variables
  log('Required Environment Variables:', 'cyan');
  log('-'.repeat(60), 'cyan');

  for (const [key, rules] of Object.entries(requiredVars)) {
    const value = envVars[key];
    const isSet = value !== undefined && value !== '';
    const isValid = isSet && rules.validate(value);

    if (!isSet) {
      log(`❌ ${key}: MISSING`, 'red');
      hasErrors = true;
    } else if (!isValid) {
      log(`❌ ${key}: INVALID`, 'red');
      log(`   ${rules.error}`, 'red');
      if (value.includes('xxx') || value.includes('...')) {
        log(`   Current value appears to be a placeholder`, 'red');
      }
      hasErrors = true;
    } else {
      const maskedValue = value.substring(0, 10) + '...' + value.substring(value.length - 4);
      log(`✅ ${key}: ${maskedValue}`, 'green');
    }
  }

  // Validate optional variables
  log('\nOptional Environment Variables:', 'cyan');
  log('-'.repeat(60), 'cyan');

  for (const [key, rules] of Object.entries(optionalVars)) {
    const value = envVars[key];
    const isSet = value !== undefined && value !== '';

    if (!isSet) {
      log(`⚠️  ${key}: Not set (optional)`, 'yellow');
    } else if (rules.validate && !rules.validate(value)) {
      log(`⚠️  ${key}: Set but may be invalid`, 'yellow');
      log(`   ${rules.error}`, 'yellow');
      hasWarnings = true;
    } else {
      const maskedValue = value.length > 20 
        ? value.substring(0, 10) + '...' + value.substring(value.length - 4)
        : value;
      log(`✅ ${key}: ${maskedValue}`, 'green');
    }
  }

  // Summary
  log('\n' + '='.repeat(60), 'cyan');
  log('  Validation Summary', 'cyan');
  log('='.repeat(60), 'cyan');

  if (hasErrors) {
    log('\n❌ VALIDATION FAILED', 'red');
    log('\nYou have missing or invalid required environment variables.', 'red');
    log('Please check the errors above and update your .env.local file.\n', 'red');
    
    log('Quick fixes:', 'yellow');
    log('1. Get OpenAI API key: https://platform.openai.com/api-keys', 'yellow');
    log('2. Get Supabase keys: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api', 'yellow');
    log('3. Update .env.local with the real values', 'yellow');
    log('4. Run this script again to verify\n', 'yellow');
    
    process.exit(1);
  } else if (hasWarnings) {
    log('\n⚠️  VALIDATION PASSED WITH WARNINGS', 'yellow');
    log('\nAll required variables are set, but some optional ones may need attention.\n', 'yellow');
    process.exit(0);
  } else {
    log('\n✅ ALL CHECKS PASSED', 'green');
    log('\nYour environment is properly configured!', 'green');
    log('You can now start the development server:\n', 'green');
    log('  npm run dev\n', 'cyan');
    process.exit(0);
  }
}

// Run validation
try {
  validateEnv();
} catch (error) {
  log('\n❌ ERROR: Validation script failed', 'red');
  log(error.message, 'red');
  log('\n' + error.stack, 'red');
  process.exit(1);
}

