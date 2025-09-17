import { GoogleGenerativeAI } from '@google/generative-ai';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

// Food-related COCO labels
const FOOD_LABELS = [
  'banana', 'apple', 'sandwich', 'orange', 'broccoli', 'carrot', 
  'hot dog', 'pizza', 'donut', 'cake', 'bowl', 'cup', 'fork', 
  'knife', 'spoon', 'bottle'
];

// Common food items for enhanced detection
const COMMON_FOODS = [
  'tomato', 'onion', 'potato', 'chicken', 'beef', 'fish', 'rice',
  'pasta', 'bread', 'cheese', 'egg', 'milk', 'butter', 'oil',
  'salt', 'pepper', 'garlic', 'ginger', 'lemon', 'lime', 'lettuce',
  'cucumber', 'bell pepper', 'mushroom', 'corn', 'beans', 'peas'
];

interface DetectedFood {
  name: string;
  confidence: number;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

class FoodDetectionService {
  private cocoModel: cocoSsd.ObjectDetection | null = null;
  private mobilenetModel: mobilenet.MobileNet | null = null;
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Wait for TensorFlow to be ready
      await tf.ready();
      
      // Load models
      this.cocoModel = await cocoSsd.load({
        base: 'lite_mobilenet_v2',
      });
      
      this.mobilenetModel = await mobilenet.load({
        version: 2,
        alpha: 0.5,
      });

      this.isInitialized = true;
      console.log('TensorFlow models loaded successfully');
    } catch (error) {
      console.error('Failed to initialize TensorFlow models:', error);
      throw error;
    }
  }

  async detectFromImage(imageData: any): Promise<DetectedFood[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const detectedFoods: DetectedFood[] = [];

    try {
      // First try COCO-SSD for object detection
      if (this.cocoModel && imageData) {
        const predictions = await this.cocoModel.detect(imageData);
        
        for (const prediction of predictions) {
          // Check if it's a food-related item
          if (FOOD_LABELS.includes(prediction.class.toLowerCase())) {
            detectedFoods.push({
              name: prediction.class,
              confidence: prediction.score,
              boundingBox: {
                x: prediction.bbox[0],
                y: prediction.bbox[1],
                width: prediction.bbox[2],
                height: prediction.bbox[3],
              },
            });
          }
        }
      }

      // If no food detected, try MobileNet classification
      if (detectedFoods.length === 0 && this.mobilenetModel && imageData) {
        const predictions = await this.mobilenetModel.classify(imageData);
        
        for (const prediction of predictions) {
          // Check if the classification contains food-related keywords
          const className = prediction.className.toLowerCase();
          const foodKeywords = ['food', 'fruit', 'vegetable', 'meat', 'dish'];
          
          if (foodKeywords.some(keyword => className.includes(keyword))) {
            detectedFoods.push({
              name: this.extractFoodName(className),
              confidence: prediction.probability,
            });
          }
        }
      }
    } catch (error) {
      console.error('TensorFlow detection error:', error);
    }

    return detectedFoods;
  }

  async detectWithGemini(base64Image: string): Promise<DetectedFood[]> {
    try {
      const prompt = `
        You are a food ingredient detection system. Analyze this image and identify all visible food ingredients.
        
        Return ONLY a JSON array of detected ingredients in this exact format:
        [
          {"name": "ingredient name", "confidence": 0.95},
          {"name": "another ingredient", "confidence": 0.85}
        ]
        
        Rules:
        - Include only clearly visible food items and ingredients
        - Confidence should be between 0 and 1 based on how certain you are
        - Use common ingredient names (e.g., "tomato" not "red tomato")
        - Do not include utensils, plates, or non-food items
        - If no food is detected, return an empty array []
      `;

      const imagePart = {
        inlineData: {
          data: base64Image,
          mimeType: 'image/jpeg',
        },
      };

      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const ingredients = JSON.parse(jsonMatch[0]);
        return ingredients.map((ing: any) => ({
          name: ing.name,
          confidence: ing.confidence || 0.8,
        }));
      }
    } catch (error) {
      console.error('Gemini detection error:', error);
    }

    return [];
  }

  async detectCombined(imageData: any, base64Image: string): Promise<DetectedFood[]> {
    const detectedFoods = new Map<string, DetectedFood>();

    // Try TensorFlow detection first (faster, on-device)
    const tfResults = await this.detectFromImage(imageData);
    tfResults.forEach(food => {
      const key = food.name.toLowerCase();
      if (!detectedFoods.has(key) || food.confidence > detectedFoods.get(key)!.confidence) {
        detectedFoods.set(key, food);
      }
    });

    // If TensorFlow didn't find much, use Gemini for better detection
    if (detectedFoods.size < 3) {
      const geminiResults = await this.detectWithGemini(base64Image);
      geminiResults.forEach(food => {
        const key = food.name.toLowerCase();
        if (!detectedFoods.has(key)) {
          detectedFoods.set(key, {
            ...food,
            confidence: food.confidence * 0.9, // Slightly lower confidence for Gemini results
          });
        }
      });
    }

    // Sort by confidence and return
    return Array.from(detectedFoods.values())
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 10); // Limit to top 10 ingredients
  }

  private extractFoodName(className: string): string {
    // Clean up MobileNet class names to extract food names
    const parts = className.split(',');
    const foodPart = parts[0].trim();
    
    // Remove common prefixes
    const prefixes = ['fresh', 'raw', 'cooked', 'whole', 'sliced'];
    let cleanName = foodPart;
    
    for (const prefix of prefixes) {
      if (cleanName.toLowerCase().startsWith(prefix)) {
        cleanName = cleanName.substring(prefix.length).trim();
      }
    }
    
    return cleanName;
  }

  dispose() {
    if (this.cocoModel) {
      this.cocoModel.dispose();
    }
    if (this.mobilenetModel) {
      // MobileNet doesn't have a dispose method
      this.mobilenetModel = null;
    }
    this.isInitialized = false;
  }
}

export default new FoodDetectionService();