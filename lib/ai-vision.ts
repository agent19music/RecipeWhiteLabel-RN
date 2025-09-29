import Constants from 'expo-constants';
import { GoogleGenerativeAI } from '@google/generative-ai';

// API Keys
const OPENAI_API_KEY = Constants.expoConfig?.extra?.openaiApiKey || process.env.EXPO_PUBLIC_OPENAI_API_KEY;
const GEMINI_API_KEY = Constants.expoConfig?.extra?.geminiApiKey || process.env.EXPO_PUBLIC_GEMINI_API_KEY;

// Initialize Gemini if available
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;
const visionModel = genAI ? genAI.getGenerativeModel({ model: 'gemini-2.5-flash' }) : null;

export interface DetectedItem {
  id: string;
  name: string;
  title: string;
  category: 'produce' | 'dairy' | 'meat' | 'grain' | 'canned' | 'snack' | 'beverage' | 'condiment' | 'frozen' | 'other';
  quantity: number;
  qty?: number;
  unit: string;
  confidence: number;
  expiryEstimate?: number;
  expiryDate?: string;
  expiresOn?: string;
}

export interface DetectionResult {
  success: boolean;
  items: DetectedItem[];
  message?: string;
  method?: 'openai' | 'gemini' | 'mock';
}

// Category expiry estimates in days
const CATEGORY_EXPIRY_DAYS = {
  produce: 7,
  dairy: 14,
  meat: 3,
  grain: 180,
  canned: 365,
  snack: 90,
  beverage: 180,
  condiment: 365,
  frozen: 90,
  other: 30,
};

/**
 * Main function to analyze grocery image using AI
 * Tries OpenAI first, then Gemini as fallback
 */
export async function analyzeGroceryImage(base64Image: string): Promise<DetectionResult> {
  console.log('Starting AI image analysis...');
  
  // Try OpenAI first if configured
  if (OPENAI_API_KEY) {
    try {
      console.log('Attempting OpenAI Vision analysis...');
      const result = await analyzeWithOpenAI(base64Image);
      if (result.success) {
        return { ...result, method: 'openai' };
      }
    } catch (error) {
      console.error('OpenAI analysis failed:', error);
    }
  }
  
  // Try Gemini as fallback
  if (GEMINI_API_KEY && visionModel) {
    try {
      console.log('Attempting Gemini Vision analysis...');
      const result = await analyzeWithGemini(base64Image);
      if (result.success) {
        return { ...result, method: 'gemini' };
      }
    } catch (error) {
      console.error('Gemini analysis failed:', error);
    }
  }
  
  // If both fail, return mock data for development
  console.log('Using mock data (no AI service available)');
  return getMockDetectionResult();
}

/**
 * Analyze image using OpenAI Vision API
 */
async function analyzeWithOpenAI(base64Image: string): Promise<DetectionResult> {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

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
          content: `You are a grocery item detection AI. Analyze the image and identify food/grocery items.
          
          Return ONLY a JSON array with detected items. Each item must have:
          - name: string (specific product name)
          - category: string (produce|dairy|meat|grain|canned|snack|beverage|condiment|frozen|other)
          - quantity: number (estimated count)
          - unit: string (pieces|kg|liters|etc)
          - confidence: number (0-1 detection confidence)
          
          Example response:
          [{"name":"Green Apples","category":"produce","quantity":6,"unit":"pieces","confidence":0.9}]
          
          If no items detected, return empty array: []`,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Detect all grocery items in this image. Return only the JSON array.',
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
                detail: 'high',
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('OpenAI API error response:', error);
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;

  if (!content) {
    throw new Error('No response content from OpenAI');
  }

  // Parse and validate response
  try {
    const cleanContent = content.replace(/```json\n?|```\n?/g, '').trim();
    const items = JSON.parse(cleanContent);
    
    if (!Array.isArray(items)) {
      throw new Error('Response is not an array');
    }

    const processedItems = processItemsArray(items);
    
    return {
      success: true,
      items: processedItems,
    };
  } catch (parseError) {
    console.error('Failed to parse OpenAI response:', content);
    throw parseError;
  }
}

/**
 * Analyze image using Google Gemini API
 */
async function analyzeWithGemini(base64Image: string): Promise<DetectionResult> {
  if (!visionModel) {
    throw new Error('Gemini API not configured');
  }

  const prompt = `Analyze this image and identify all grocery/food items.

Return ONLY a JSON array with detected items. Each item should have:
- name: specific product name
- category: one of (produce, dairy, meat, grain, canned, snack, beverage, condiment, frozen, other)
- quantity: estimated count (number)
- unit: appropriate unit (pieces, kg, liters, etc)
- confidence: detection confidence (0-1)

Example: [{"name":"Tomatoes","category":"produce","quantity":4,"unit":"pieces","confidence":0.8}]

If no items found, return: []`;

  try {
    const result = await visionModel.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64Image,
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();

    // Parse Gemini response
    const cleanText = text.replace(/```json\n?|```\n?/g, '').trim();
    const items = JSON.parse(cleanText);

    if (!Array.isArray(items)) {
      throw new Error('Gemini response is not an array');
    }

    const processedItems = processItemsArray(items);

    return {
      success: true,
      items: processedItems,
    };
  } catch (error) {
    console.error('Gemini analysis error:', error);
    throw error;
  }
}

/**
 * Process and validate items array from AI response
 */
function processItemsArray(items: any[]): DetectedItem[] {
  const validItems: DetectedItem[] = [];
  
  for (const item of items) {
    if (!item || typeof item !== 'object') continue;
    if (!item.name || !item.category) continue;
    
    // Validate category
    const validCategories = ['produce', 'dairy', 'meat', 'grain', 'canned', 'snack', 'beverage', 'condiment', 'frozen', 'other'];
    const category = validCategories.includes(item.category) ? item.category : 'other';
    
    // Calculate expiry
    const expiryDays = CATEGORY_EXPIRY_DAYS[category as keyof typeof CATEGORY_EXPIRY_DAYS] || 30;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + expiryDays);
    const expiryString = expiryDate.toISOString().split('T')[0];
    
    validItems.push({
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: item.name,
      title: item.name,
      category: category as DetectedItem['category'],
      quantity: item.quantity || 1,
      qty: item.quantity || 1,
      unit: item.unit || 'piece',
      confidence: item.confidence || 0.7,
      expiryEstimate: expiryDays,
      expiryDate: expiryString,
      expiresOn: expiryString,
    });
  }
  
  return validItems;
}

/**
 * Get mock detection result for development/testing
 */
function getMockDetectionResult(): DetectionResult {
  const mockItems: DetectedItem[] = [
    {
      id: `item_${Date.now()}_1`,
      name: 'Fresh Tomatoes',
      title: 'Fresh Tomatoes',
      category: 'produce',
      quantity: 6,
      qty: 6,
      unit: 'pieces',
      confidence: 0.9,
      expiryEstimate: 7,
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      expiresOn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
    {
      id: `item_${Date.now()}_2`,
      name: 'Whole Milk',
      title: 'Whole Milk',
      category: 'dairy',
      quantity: 1,
      qty: 1,
      unit: 'liter',
      confidence: 0.85,
      expiryEstimate: 14,
      expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      expiresOn: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
    {
      id: `item_${Date.now()}_3`,
      name: 'Whole Wheat Bread',
      title: 'Whole Wheat Bread',
      category: 'grain',
      quantity: 1,
      qty: 1,
      unit: 'loaf',
      confidence: 0.88,
      expiryEstimate: 5,
      expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      expiresOn: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
    {
      id: `item_${Date.now()}_4`,
      name: 'Green Apples',
      title: 'Green Apples',
      category: 'produce',
      quantity: 8,
      qty: 8,
      unit: 'pieces',
      confidence: 0.92,
      expiryEstimate: 14,
      expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      expiresOn: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
  ];

  return {
    success: true,
    items: mockItems,
    method: 'mock',
    message: 'Using demo data for testing',
  };
}

/**
 * Smart categorization based on item name
 */
export function categorizeGroceryItem(itemName: string): DetectedItem['category'] {
  const name = itemName.toLowerCase();
  
  if (/apple|banana|orange|grape|berry|mango|pear|peach|plum|melon|tomato|potato|carrot|onion|lettuce|spinach|kale|broccoli|cucumber|pepper/i.test(name)) {
    return 'produce';
  }
  
  if (/milk|cheese|yogurt|butter|cream|eggs?/i.test(name)) {
    return 'dairy';
  }
  
  if (/chicken|beef|pork|fish|salmon|tuna|turkey|lamb|bacon|sausage|ham/i.test(name)) {
    return 'meat';
  }
  
  if (/bread|rice|pasta|cereal|flour|oats|quinoa|wheat|barley/i.test(name)) {
    return 'grain';
  }
  
  if (/canned|tin|beans|soup|sauce/i.test(name)) {
    return 'canned';
  }
  
  if (/chip|cookie|cracker|candy|chocolate|popcorn|nuts|bar/i.test(name)) {
    return 'snack';
  }
  
  if (/juice|soda|water|tea|coffee|drink|beer|wine/i.test(name)) {
    return 'beverage';
  }
  
  if (/sauce|ketchup|mustard|mayo|dressing|oil|vinegar|spice|salt|pepper|sugar/i.test(name)) {
    return 'condiment';
  }
  
  if (/frozen|ice cream|pizza/i.test(name)) {
    return 'frozen';
  }
  
  return 'other';
}