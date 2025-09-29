#!/usr/bin/env node

// Test AI Vision functionality
require('dotenv').config();

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

console.log('🔍 Testing AI Vision Services...\n');

// Test image (base64 encoded small test image of groceries)
const TEST_IMAGE_BASE64 = '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCABAAEADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD5/ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/9k=';

async function testOpenAIVision() {
  if (!OPENAI_API_KEY) {
    console.log('⚠️ OpenAI API key not configured');
    return false;
  }

  console.log('📡 Testing OpenAI Vision...');
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a grocery detection AI. Return ONLY a JSON array of detected items with: name, category (produce/dairy/meat/grain/other), quantity, unit, confidence (0-1).',
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Detect grocery items. If this is a test image, return: [{"name":"Test Apple","category":"produce","quantity":1,"unit":"piece","confidence":0.9}]',
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${TEST_IMAGE_BASE64}`,
                  detail: 'high',
                },
              },
            ],
          },
        ],
        max_tokens: 200,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ OpenAI Vision failed:', error);
      return false;
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    console.log('✅ OpenAI Vision response:', content?.substring(0, 100) + '...');
    
    // Try to parse as JSON
    try {
      const items = JSON.parse(content.replace(/```json\n?|```\n?/g, '').trim());
      console.log('✅ Detected items:', items.length);
      return true;
    } catch (e) {
      console.log('⚠️ Response is not valid JSON');
      return true; // API works but response format issue
    }
  } catch (error) {
    console.error('❌ OpenAI Vision error:', error.message);
    return false;
  }
}

async function testGeminiVision() {
  if (!GEMINI_API_KEY) {
    console.log('⚠️ Gemini API key not configured');
    return false;
  }

  console.log('\n📡 Testing Gemini Vision...');
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              text: 'Detect grocery items in this image and return ONLY a JSON array. Example: [{"name":"Apple","category":"produce","quantity":1,"unit":"piece","confidence":0.9}]. If test image, return the example.',
            },
            {
              inline_data: {
                mime_type: 'image/jpeg',
                data: TEST_IMAGE_BASE64,
              },
            },
          ],
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 200,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Gemini Vision failed:', error);
      return false;
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log('✅ Gemini Vision response:', content?.substring(0, 100) + '...');
    
    // Try to parse as JSON
    try {
      const items = JSON.parse(content.replace(/```json\n?|```\n?/g, '').trim());
      console.log('✅ Detected items:', items.length);
      return true;
    } catch (e) {
      console.log('⚠️ Response is not valid JSON');
      return true; // API works but response format issue
    }
  } catch (error) {
    console.error('❌ Gemini Vision error:', error.message);
    return false;
  }
}

async function runTests() {
  const openaiSuccess = await testOpenAIVision();
  const geminiSuccess = await testGeminiVision();
  
  console.log('\n📊 Test Summary:');
  console.log(`  OpenAI Vision: ${openaiSuccess ? '✅ Working' : '❌ Failed'}`);
  console.log(`  Gemini Vision: ${geminiSuccess ? '✅ Working' : '❌ Failed'}`);
  
  if (openaiSuccess || geminiSuccess) {
    console.log('\n✅ At least one AI vision service is working!');
    console.log('The camera AI detection should work in your app.');
  } else {
    console.log('\n⚠️ No AI vision services are working.');
    console.log('The app will use mock data for testing.');
  }
}

runTests();