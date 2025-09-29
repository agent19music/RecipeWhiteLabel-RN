import Constants from 'expo-constants';

const OPENAI_API_KEY = Constants.expoConfig?.extra?.openaiApiKey || process.env.EXPO_PUBLIC_OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.warn('OpenAI API key not configured - AI features will be disabled');
}

export interface GroceryItem {
  name: string;
  category: 'produce' | 'dairy' | 'meat' | 'grain' | 'canned' | 'snack' | 'beverage' | 'condiment' | 'frozen' | 'other';
  quantity?: number;
  unit?: string;
  confidence: number;
  expiryEstimate?: number; // days until typical expiry
}

export interface GroceryDetectionResult {
  success: boolean;
  items: GroceryItem[];
  message?: string;
  totalConfidence: number;
}

// Categories with typical expiry days
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

export async function analyzeGroceryImage(base64Image: string): Promise<GroceryDetectionResult> {
  if (!OPENAI_API_KEY) {
    return {
      success: false,
      items: [],
      message: 'AI features not configured',
      totalConfidence: 0,
    };
  }

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
            content: `You are a grocery detection AI. Analyze images and identify ONLY food items, groceries, and consumable products. 
            
            Rules:
            1. IGNORE non-food items (electronics, furniture, clothes, etc.)
            2. For each food item detected, provide:
               - name: specific product name
               - category: one of [produce, dairy, meat, grain, canned, snack, beverage, condiment, frozen, other]
               - quantity: estimated count if visible
               - unit: appropriate unit (pieces, kg, liters, etc.)
               - confidence: 0-1 score of detection certainty
            3. Return results as a valid JSON array only, no extra text
            4. If no food items detected, return empty array []
            5. Be specific with names (e.g., "Green Apples" not just "Apples")
            
            Response format must be a JSON array like:
            [{"name":"Green Apples","category":"produce","quantity":6,"unit":"pieces","confidence":0.9}]`,
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Identify all grocery and food items in this image. Return ONLY a JSON array with the detected items, no other text.',
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
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No response from AI');
    }

    // Parse the JSON response
    try {
      // Clean the response - sometimes GPT adds markdown formatting
      const cleanContent = content.replace(/```json\n?|```\n?/g, '').trim();
      const items = JSON.parse(cleanContent) as GroceryItem[];
      
      // Validate and filter items
      const validItems = items
        .filter(item => 
          item && 
          typeof item === 'object' && 
          item.name && 
          item.category &&
          item.confidence >= 0.5
        )
        .map(item => ({
          ...item,
          quantity: item.quantity || 1,
          unit: item.unit || 'piece',
          expiryEstimate: CATEGORY_EXPIRY_DAYS[item.category] || 30,
        }));

      const avgConfidence = validItems.reduce((sum, item) => sum + item.confidence, 0) / validItems.length || 0;

      return {
        success: true,
        items: validItems,
        totalConfidence: avgConfidence,
      };
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      return {
        success: false,
        items: [],
        message: 'Failed to parse AI response',
        totalConfidence: 0,
      };
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    return {
      success: false,
      items: [],
      message: error instanceof Error ? error.message : 'Failed to analyze image',
      totalConfidence: 0,
    };
  }
}

// Batch analyze multiple images
export async function analyzeMultipleGroceryImages(images: string[]): Promise<GroceryDetectionResult> {
  const results = await Promise.all(images.map(analyzeGroceryImage));
  
  // Combine all items from successful detections
  const allItems: GroceryItem[] = [];
  let totalConfidence = 0;
  let successCount = 0;

  for (const result of results) {
    if (result.success) {
      allItems.push(...result.items);
      totalConfidence += result.totalConfidence;
      successCount++;
    }
  }

  // Deduplicate items by name
  const uniqueItems = allItems.reduce((acc, item) => {
    const existing = acc.find(i => i.name.toLowerCase() === item.name.toLowerCase());
    if (existing) {
      // Keep the one with higher confidence
      if (item.confidence > existing.confidence) {
        return acc.map(i => i === existing ? item : i);
      }
    } else {
      acc.push(item);
    }
    return acc;
  }, [] as GroceryItem[]);

  return {
    success: successCount > 0,
    items: uniqueItems,
    totalConfidence: successCount > 0 ? totalConfidence / successCount : 0,
  };
}

// Smart categorization of grocery items
export function categorizeGroceryItem(itemName: string): GroceryItem['category'] {
  const name = itemName.toLowerCase();
  
  // Produce patterns
  if (/apple|banana|orange|grape|berry|mango|pear|peach|plum|melon|tomato|potato|carrot|onion|lettuce|spinach|kale|broccoli|cucumber|pepper/i.test(name)) {
    return 'produce';
  }
  
  // Dairy patterns
  if (/milk|cheese|yogurt|butter|cream|eggs?/i.test(name)) {
    return 'dairy';
  }
  
  // Meat patterns
  if (/chicken|beef|pork|fish|salmon|tuna|turkey|lamb|bacon|sausage|ham/i.test(name)) {
    return 'meat';
  }
  
  // Grain patterns
  if (/bread|rice|pasta|cereal|flour|oats|quinoa|wheat|barley/i.test(name)) {
    return 'grain';
  }
  
  // Canned patterns
  if (/canned|tin|beans|soup|sauce/i.test(name)) {
    return 'canned';
  }
  
  // Snack patterns
  if (/chip|cookie|cracker|candy|chocolate|popcorn|nuts|bar/i.test(name)) {
    return 'snack';
  }
  
  // Beverage patterns
  if (/juice|soda|water|tea|coffee|drink|beer|wine/i.test(name)) {
    return 'beverage';
  }
  
  // Condiment patterns
  if (/sauce|ketchup|mustard|mayo|dressing|oil|vinegar|spice|salt|pepper|sugar/i.test(name)) {
    return 'condiment';
  }
  
  // Frozen patterns
  if (/frozen|ice cream|pizza/i.test(name)) {
    return 'frozen';
  }
  
  return 'other';
}