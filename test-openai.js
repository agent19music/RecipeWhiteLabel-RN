#!/usr/bin/env node

// Test OpenAI API key and Vision functionality
require('dotenv').config();

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error('❌ EXPO_PUBLIC_OPENAI_API_KEY not found in .env file');
  process.exit(1);
}

console.log('🔑 API Key found:', OPENAI_API_KEY.substring(0, 10) + '...');

async function testOpenAI() {
  try {
    // Test basic API connectivity
    console.log('\n📡 Testing OpenAI API connectivity...');
    const response = await fetch('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error ${response.status}: ${JSON.stringify(errorData)}`);
    }

    console.log('✅ API connection successful!');

    // Test vision model availability
    console.log('\n🎯 Testing Vision model...');
    const visionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Say "Vision API is working!" if you can process images.',
              },
            ],
          },
        ],
        max_tokens: 50,
      }),
    });

    if (!visionResponse.ok) {
      const errorData = await visionResponse.json();
      throw new Error(`Vision API Error ${visionResponse.status}: ${JSON.stringify(errorData)}`);
    }

    const visionData = await visionResponse.json();
    console.log('✅ Vision model response:', visionData.choices[0]?.message?.content);

    // List available models
    console.log('\n📋 Available models with vision capability:');
    const modelsData = await response.json();
    const visionModels = modelsData.data.filter(model => 
      model.id.includes('gpt-4') || model.id.includes('vision')
    );
    
    visionModels.forEach(model => {
      console.log(`  - ${model.id}`);
    });

    console.log('\n✅ All tests passed! Your OpenAI API is properly configured.');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    
    if (error.message.includes('401')) {
      console.error('🔐 Invalid API key. Please check your EXPO_PUBLIC_OPENAI_API_KEY in .env');
    } else if (error.message.includes('429')) {
      console.error('⏱️ Rate limit exceeded. Wait a moment and try again.');
    } else if (error.message.includes('quota')) {
      console.error('💳 Quota exceeded. Check your OpenAI account billing.');
    }
    
    process.exit(1);
  }
}

testOpenAI();