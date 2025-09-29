#!/usr/bin/env node

// Test Gemini API key and models
require('dotenv').config();

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('❌ EXPO_PUBLIC_GEMINI_API_KEY not found in .env file');
  process.exit(1);
}

console.log('🔑 Gemini API Key found:', GEMINI_API_KEY.substring(0, 10) + '...');

async function testGemini() {
  try {
    // List available models
    console.log('\n📡 Testing Gemini API connectivity...');
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`API Error ${response.status}: ${errorData}`);
    }

    const data = await response.json();
    console.log('✅ API connection successful!');
    
    console.log('\n📋 Available Gemini models:');
    if (data.models && Array.isArray(data.models)) {
      const visionModels = data.models.filter(model => 
        model.supportedGenerationMethods?.includes('generateContent')
      );
      
      visionModels.forEach(model => {
        console.log(`  - ${model.name} (${model.displayName})`);
        if (model.description) {
          console.log(`    ${model.description.substring(0, 100)}...`);
        }
      });
    }

    // Test a simple generation
    console.log('\n🎯 Testing text generation...');
    const testResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'Say "Gemini API is working!" if you are functioning properly.'
          }]
        }]
      }),
    });

    if (!testResponse.ok) {
      const errorData = await testResponse.text();
      console.error('⚠️ Generation test failed:', errorData);
    } else {
      const genData = await testResponse.json();
      console.log('✅ Generation response:', genData.candidates?.[0]?.content?.parts?.[0]?.text || 'No response');
    }

    console.log('\n✅ All tests passed! Your Gemini API is properly configured.');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    
    if (error.message.includes('401') || error.message.includes('403')) {
      console.error('🔐 Invalid API key. Please check your EXPO_PUBLIC_GEMINI_API_KEY in .env');
    } else if (error.message.includes('429')) {
      console.error('⏱️ Rate limit exceeded. Wait a moment and try again.');
    }
    
    process.exit(1);
  }
}

testGemini();