import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { Stack, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import Badge from '@/components/ui/Badge';
import { useDialog } from '@/hooks/useDialog';
import Dialog from '@/components/Dialog';
import foodDetection from '@/services/foodDetection';
import { generateAIRecipe } from '@/utils/ai-enhanced';

const { width, height } = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';

interface DetectedIngredient {
  name: string;
  confidence: number;
  id: string;
}

export default function AICameraScreen() {
  const { dialog, showWarningDialog, showErrorDialog, showSuccessDialog, hideDialog } = useDialog();
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedIngredients, setDetectedIngredients] = useState<DetectedIngredient[]>([]);
  const [customIngredient, setCustomIngredient] = useState('');
  const [isGeneratingRecipe, setIsGeneratingRecipe] = useState(false);
  const [showIngredientInput, setShowIngredientInput] = useState(false);
  const [tfReady, setTfReady] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  
  const cameraRef = useRef<CameraView>(null);
  const panelAnimation = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(1)).current;
  const rotateAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initialize TensorFlow models
    initializeTensorFlow();
    
    // Start capture button animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnimation, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnimation, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    return () => {
      foodDetection.dispose();
    };
  }, []);

  const initializeTensorFlow = async () => {
    try {
      await foodDetection.initialize();
      setTfReady(true);
    } catch (error) {
      console.error('Failed to initialize TensorFlow:', error);
      // Fallback to Gemini-only mode
      setTfReady(false);
    }
  };

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Stack.Screen options={{ title: 'AI Camera', headerShown: true }} />
        <MaterialCommunityIcons name="camera-off" size={64} color="#8E8E93" />
        <Text style={styles.permissionText}>
          We need camera permission to detect ingredients
        </Text>
        <TouchableOpacity 
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const captureAndAnalyze = async () => {
    if (!cameraRef.current || isAnalyzing) return;

    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Start loading animation
    setIsAnalyzing(true);
    Animated.timing(rotateAnimation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    try {
      // Capture photo
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.8,
        skipProcessing: false,
        exif: false,
      });

      if (photo && photo.base64) {
        setCapturedPhoto(photo.uri);
        
        // Detect ingredients using TensorFlow + Gemini
        const detectedFoods = await foodDetection.detectCombined(
          null, // We'll pass image tensor in a future update
          photo.base64
        );
        
        if (detectedFoods.length > 0) {
          // Animate panel appearance
          Animated.spring(panelAnimation, {
            toValue: 1,
            tension: 50,
            friction: 8,
            useNativeDriver: true,
          }).start();
          
          // Add detected ingredients with unique IDs
          const newIngredients = detectedFoods.map(food => ({
            id: `${Date.now()}-${Math.random()}`,
            name: food.name,
            confidence: food.confidence,
          }));
          
          setDetectedIngredients(prev => {
            const existingNames = new Set(prev.map(i => i.name.toLowerCase()));
            const filtered = newIngredients.filter(
              ing => !existingNames.has(ing.name?.toLowerCase())
            );
            return [...prev, ...filtered];
          });

          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
          showWarningDialog(
            'No Ingredients Detected',
            'Try adjusting the camera angle or lighting for better detection.'
          );
        }
      }
    } catch (error) {
      console.error('Detection error:', error);
      showErrorDialog(
        'Detection Failed',
        'Unable to analyze the image. Please try again.'
      );
    } finally {
      setIsAnalyzing(false);
      // Reset rotation
      Animated.timing(rotateAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const removeIngredient = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDetectedIngredients(prev => prev.filter(ing => ing.id !== id));
  };

  const addCustomIngredient = () => {
    if (customIngredient.trim()) {
      const newIngredient: DetectedIngredient = {
        id: `custom-${Date.now()}`,
        name: customIngredient.trim(),
        confidence: 1.0,
      };
      setDetectedIngredients(prev => [...prev, newIngredient]);
      setCustomIngredient('');
      setShowIngredientInput(false);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const generateRecipe = async () => {
    const ingredientNames = detectedIngredients.map(ing => ing.name);

    if (ingredientNames.length === 0) {
      showWarningDialog('No Ingredients', 'Please detect or add at least one ingredient.');
      return;
    }

    setIsGeneratingRecipe(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const result = await generateAIRecipe(ingredientNames, {
        cuisine: 'Kenyan',
        servings: 4,
      });
      
      if (result.success && result.recipe) {
        showSuccessDialog(
          'Recipe Created!',
          'Your personalized Royco recipe is ready.'
        );
        setTimeout(() => {
          router.replace(`/cook/${result.recipe.id}`);
        }, 1500);
      }
    } catch (error) {
      console.error('Recipe generation error:', error);
      showErrorDialog('Generation Failed', 'Unable to generate recipe. Please try again.');
    } finally {
      setIsGeneratingRecipe(false);
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          headerShown: false,
        }} 
      />
      <View style={styles.container}>
        {/* Camera View */}
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
          mode="picture"
        >
          {/* Camera Overlay */}
          <View style={styles.cameraOverlay}>
            {/* Top Controls */}
            <SafeAreaView style={styles.topControls} edges={['top']}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => router.back()}
              >
                <BlurView intensity={80} tint="dark" style={styles.blurButton}>
                  <Ionicons name="close" size={24} color="#FFFFFF" />
                </BlurView>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => setFacing(current => current === 'back' ? 'front' : 'back')}
              >
                <BlurView intensity={80} tint="dark" style={styles.blurButton}>
                  <Ionicons name="camera-reverse" size={24} color="#FFFFFF" />
                </BlurView>
              </TouchableOpacity>
            </SafeAreaView>

            {/* Center Focus Area */}
            <View style={styles.focusArea}>
              <View style={styles.focusFrame}>
                <Text style={styles.focusText}>Point camera at ingredients</Text>
              </View>
            </View>

            {/* Bottom Controls */}
            <SafeAreaView style={styles.bottomControls} edges={['bottom']}>
              <Animated.View style={{ transform: [{ scale: scaleAnimation }] }}>
                <TouchableOpacity
                  style={[styles.captureButton, isAnalyzing && styles.captureButtonAnalyzing]}
                  onPress={captureAndAnalyze}
                  disabled={isAnalyzing}
                  accessibilityLabel="Capture and analyze"
                >
                  {isAnalyzing ? (
                    <ActivityIndicator size="large" color="#FFFFFF" />
                  ) : (
                    <MaterialCommunityIcons name="camera" size={32} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
              </Animated.View>
            </SafeAreaView>
          </View>
        </CameraView>

        {/* Ingredients Panel */}
        {detectedIngredients.length > 0 && (
          <Animated.View 
            style={[
              styles.ingredientsPanel,
              {
                transform: [{
                  translateY: panelAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [300, 0],
                  }),
                }],
              },
            ]}
          >
            <View style={styles.panelHandle} />
            <ScrollView style={styles.ingredientsScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.ingredientsHeader}>
                <Text style={styles.ingredientsTitle}>
                  Detected Ingredients
                </Text>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => setShowIngredientInput(true)}
                >
                  <Ionicons name="add-circle" size={28} color="#007AFF" />
                </TouchableOpacity>
              </View>

              {/* Custom Ingredient Input */}
              {showIngredientInput && (
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Add ingredient..."
                    placeholderTextColor="#8E8E93"
                    value={customIngredient}
                    onChangeText={setCustomIngredient}
                    onSubmitEditing={addCustomIngredient}
                    autoFocus
                  />
                  <TouchableOpacity style={styles.inputButton} onPress={addCustomIngredient}>
                    <Ionicons name="checkmark-circle" size={24} color="#34C759" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.inputButton} 
                    onPress={() => setShowIngredientInput(false)}
                  >
                    <Ionicons name="close-circle" size={24} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              )}

              {/* Ingredient Badges */}
              <View style={styles.ingredientsGrid}>
                {detectedIngredients.map((ingredient) => (
                  <Badge
                    key={ingredient.id}
                    label={ingredient.name}
                    confidence={ingredient.confidence}
                    onRemove={() => removeIngredient(ingredient.id)}
                  />
                ))}
              </View>
            </ScrollView>

            {/* Generate Button */}
            {detectedIngredients.length > 0 && (
              <View style={styles.generateContainer}>
                <TouchableOpacity
                  style={[
                    styles.generateButton,
                    isGeneratingRecipe && styles.generateButtonDisabled
                  ]}
                  onPress={generateRecipe}
                  disabled={isGeneratingRecipe}
                >
                  {isGeneratingRecipe ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <MaterialCommunityIcons name="chef-hat" size={20} color="#FFFFFF" />
                      <Text style={styles.generateButtonText}>
                        Generate Recipe ({detectedIngredients.length})
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        )}

      </View>

      {/* Custom Dialog */}
      <Dialog
        visible={dialog.visible}
        onClose={hideDialog}
        title={dialog.title}
        message={dialog.message}
        icon={dialog.icon}
        actions={dialog.actions}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#FFFFFF',
  },
  permissionText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginVertical: 20,
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 25,
    marginTop: 16,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  controlButton: {
    marginTop: 10,
  },
  blurButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  focusArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  focusFrame: {
    borderColor: '#FFFFFF',
    borderWidth: 2,
    borderRadius: 16,
    width: width * 0.7,
    height: width * 0.7 * 1.2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000040',
  },
  focusText: {
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.8,
  },
  bottomControls: {
    alignItems: 'center',
    paddingBottom: 30,
  },
  captureButton: {
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff20',
  },
  captureButtonAnalyzing: {
    opacity: 0.6,
  },
  ingredientsPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  panelHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#D1D1D6',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  ingredientsScroll: {
    maxHeight: height * 0.35,
  },
  ingredientsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
  },
  ingredientsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.5,
  },
  addButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 8,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 20,
    paddingHorizontal: 16,
    fontSize: 15,
    backgroundColor: '#F2F2F7',
  },
  inputButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  ingredientsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 8,
  },
  ingredientChipContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  removeButton: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  generateContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  generateButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
  },
  generateButtonDisabled: {
    opacity: 0.6,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  animationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    zIndex: 1000,
  },
});
