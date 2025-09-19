#!/usr/bin/env node

/**
 * Test script to verify Google OAuth configuration
 * Run this to check if your environment is properly set up
 */

const { createClient } = require('@supabase/supabase-js');

// Check environment variables
function checkEnvironmentVariables() {
  console.log('🔍 Checking Environment Variables...\n');
  
  const requiredVars = [
    'EXPO_PUBLIC_SUPABASE_URL',
    'EXPO_PUBLIC_SUPABASE_ANON_KEY',
    'EXPO_PUBLIC_SUPABASE_REDIRECT_URL'
  ];
  
  let allPresent = true;
  
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      console.log(`✅ ${varName}: ${value.substring(0, 30)}...`);
    } else {
      console.log(`❌ ${varName}: NOT SET`);
      allPresent = false;
    }
  });
  
  return allPresent;
}

// Test Supabase connection
async function testSupabaseConnection() {
  console.log('\n🔍 Testing Supabase Connection...\n');
  
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://ryqjzmfohmjqlmkezjde.supabase.co';
  const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('❌ Cannot test Supabase connection - missing credentials');
    return false;
  }
  
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Try to get auth settings
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.log(`❌ Supabase connection error: ${error.message}`);
      return false;
    }
    
    console.log('✅ Successfully connected to Supabase');
    console.log(`   URL: ${supabaseUrl}`);
    return true;
  } catch (error) {
    console.log(`❌ Supabase connection failed: ${error.message}`);
    return false;
  }
}

// Check app configuration
function checkAppConfiguration() {
  console.log('\n🔍 Checking App Configuration...\n');
  
  const fs = require('fs');
  const path = require('path');
  
  // Check app.json
  try {
    const appJsonPath = path.join(__dirname, 'app.json');
    const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
    
    if (appJson.expo.scheme) {
      console.log(`✅ App scheme configured: ${appJson.expo.scheme}`);
    } else {
      console.log('❌ App scheme not configured in app.json');
      return false;
    }
    
    if (appJson.expo.ios?.bundleIdentifier) {
      console.log(`✅ iOS Bundle ID: ${appJson.expo.ios.bundleIdentifier}`);
    }
    
    if (appJson.expo.android?.package) {
      console.log(`✅ Android Package: ${appJson.expo.android.package}`);
    }
    
    return true;
  } catch (error) {
    console.log(`❌ Failed to read app.json: ${error.message}`);
    return false;
  }
}

// Main test function
async function runTests() {
  console.log('🚀 Google OAuth Configuration Test\n');
  console.log('='.repeat(50));
  
  // Load environment variables
  try {
    require('dotenv').config();
  } catch (e) {
    // dotenv might not be installed, that's okay
  }
  
  const envOk = checkEnvironmentVariables();
  const appOk = checkAppConfiguration();
  const supabaseOk = await testSupabaseConnection();
  
  console.log('\n' + '='.repeat(50));
  console.log('\n📊 Test Summary:\n');
  
  if (envOk && appOk && supabaseOk) {
    console.log('✅ All checks passed! Your app is ready for Google OAuth.');
    console.log('\n📝 Next steps:');
    console.log('1. Configure Google Cloud Console as per GOOGLE_AUTH_SETUP.md');
    console.log('2. Add OAuth credentials to Supabase Dashboard');
    console.log('3. Test the sign-in flow in your app');
  } else {
    console.log('❌ Some checks failed. Please fix the issues above.');
    console.log('\n📝 Troubleshooting:');
    if (!envOk) {
      console.log('- Create a .env file with required variables');
    }
    if (!appOk) {
      console.log('- Check app.json configuration');
    }
    if (!supabaseOk) {
      console.log('- Verify Supabase credentials in .env file');
    }
  }
  
  console.log('\n📖 For detailed setup instructions, see GOOGLE_AUTH_SETUP.md');
}

// Run the tests
runTests().catch(console.error);