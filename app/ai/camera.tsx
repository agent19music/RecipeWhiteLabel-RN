import { CookingSequence } from '@/components/CookingAnimations';
import ModernButton from '@/components/ModernButton';
import ModernChip from '@/components/ModernChip';
import { Colors } from '@/constants/Colors';
import { detectIngredients, generateRecipeFromIngredientsList, saveGeneratedRecipe } from '@/utils/ai';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface DetectedIngredient {
  name: string;
  confidence: number;
  selected: boolean;
}

export default function AICameraScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedIngredients, setDetectedIngredients] = useState<DetectedIngredient[]>([]);
  const [additionalIngredient, setAdditionalIngredient] = useState('');
  const [isGeneratingRecipe, setIsGeneratingRecipe] = useState(false);
  const [showIngredientInput, setShowIngredientInput] = useState(false);
  const [showCookingAnimation, setShowCookingAnimation] = useState(false);
  
  const cameraRef = useRef<CameraView>(null);
  const analyzeInterval = useRef<NodeJS.Timeout | null>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Start analyze pulse animation
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };
    pulse();

    return () => {
      if (analyzeInterval.current) {
        clearInterval(analyzeInterval.current);
      }
    };
  }, []);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Stack.Screen options={{ title: 'AI Camera', headerShown: true }} />
        <MaterialCommunityIcons name="camera-off" size={64} color={Colors.gray[400]} />
        <Text style={styles.permissionText}>
          We need camera permission to detect ingredients
        </Text>
        <ModernButton
          title="Grant Permission"
          onPress={requestPermission}
          variant="primary"
          size="large"
        />
      </View>
    );
  }

  const captureAndAnalyze = async () => {
    if (!cameraRef.current || isAnalyzing) return;

    setIsAnalyzing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      // Capture image silently
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.7,
        skipProcessing: true,
        exif: false,
      });

      if (photo && photo.base64) {
        // Call AI detection
        const result = await detectIngredients(photo.base64);
        
        if (result.ingredients && result.ingredients.length > 0) {
          const newIngredients = result.ingredients.map(ing => ({
            name: ing.name,
            confidence: ing.confidence,
            selected: ing.confidence > 0.7, // Auto-select high confidence items
          }));
          
          setDetectedIngredients(prev => {
            const existing = new Set(prev.map(i => i.name.toLowerCase()));
            const filtered = newIngredients.filter(
              ing => !existing.has(ing.name.toLowerCase())
            );
            return [...prev, ...filtered];
          });

          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
          Alert.alert('No Ingredients Detected', 'Try pointing the camera at different ingredients or adjust lighting.');
        }
      }
    } catch (error) {
      console.error('Detection error:', error);
      Alert.alert('Detection Failed', 'Unable to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleIngredient = (index: number) => {
    setDetectedIngredients(prev => 
      prev.map((ing, i) => 
        i === index ? { ...ing, selected: !ing.selected } : ing
      )
    );
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const addCustomIngredient = () => {
    if (additionalIngredient.trim()) {
      const newIngredient: DetectedIngredient = {
        name: additionalIngredient.trim(),
        confidence: 1.0,
        selected: true,
      };
      setDetectedIngredients(prev => [...prev, newIngredient]);
      setAdditionalIngredient('');
      setShowIngredientInput(false);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const removeIngredient = (index: number) => {
    setDetectedIngredients(prev => prev.filter((_, i) => i !== index));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const generateRecipe = async () => {
    const selectedIngredients = detectedIngredients
      .filter(ing => ing.selected)
      .map(ing => ing.name);

    if (selectedIngredients.length === 0) {
      Alert.alert('No Ingredients Selected', 'Please select at least one ingredient to generate a recipe.');
      return;
    }

    setIsGeneratingRecipe(true);
    setShowCookingAnimation(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const result = await generateRecipeFromIngredientsList(selectedIngredients);
      
      if (result.recipe) {
        // Save the generated recipe
        await saveGeneratedRecipe(result.recipe);
        
        // Navigate to the generated recipe
        router.replace(`/cook/${result.recipe.id}`);
      }
    } catch (error) {
      console.error('Recipe generation error:', error);
      Alert.alert('Generation Failed', 'Unable to generate recipe. Please try again.');
    } finally {
      setIsGeneratingRecipe(false);
      setShowCookingAnimation(false);
    }
  };

  const selectedCount = detectedIngredients.filter(ing => ing.selected).length;

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
                  <Ionicons name="close" size={24} color={Colors.white} />
                </BlurView>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => setFacing(current => current === 'back' ? 'front' : 'back')}
              >
                <BlurView intensity={80} tint="dark" style={styles.blurButton}>
                  <Ionicons name="camera-reverse" size={24} color={Colors.white} />
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
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <TouchableOpacity
                  style={[styles.captureButton, isAnalyzing && styles.captureButtonAnalyzing]}
                  onPress={captureAndAnalyze}
                  disabled={isAnalyzing}
                  accessibilityLabel="Capture and analyze"
                >
                  {isAnalyzing ? (
                    <ActivityIndicator size="large" color={Colors.white} />
                  ) : (
                    <MaterialCommunityIcons name="camera" size={32} color={Colors.white} />
                  )}
                </TouchableOpacity>
              </Animated.View>
            </SafeAreaView>
          </View>
        </CameraView>

        {/* Ingredients Panel */}
        {detectedIngredients.length > 0 && (
          <Animated.View style={[styles.ingredientsPanel, { opacity: fadeAnim }]}>
            <ScrollView style={styles.ingredientsScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.ingredientsHeader}>
                <Text style={styles.ingredientsTitle}>
                  Detected Ingredients ({selectedCount})
                </Text>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => setShowIngredientInput(true)}
                >
                  <Ionicons name="add" size={20} color={Colors.primary} />
                </TouchableOpacity>
              </View>

              {/* Custom Ingredient Input */}
              {showIngredientInput && (
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Add ingredient..."
                    value={additionalIngredient}
                    onChangeText={setAdditionalIngredient}
                    onSubmitEditing={addCustomIngredient}
                    autoFocus
                  />
                  <TouchableOpacity style={styles.inputButton} onPress={addCustomIngredient}>
                    <Ionicons name="checkmark" size={20} color={Colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.inputButton} 
                    onPress={() => setShowIngredientInput(false)}
                  >
                    <Ionicons name="close" size={20} color={Colors.gray[500]} />
                  </TouchableOpacity>
                </View>
              )}

              {/* Ingredient Chips */}
              <View style={styles.ingredientsGrid}>
                {detectedIngredients.map((ingredient, index) => (
                  <View key={index} style={styles.ingredientChipContainer}>
                    <ModernChip
                      label={ingredient.name}
                      selected={ingredient.selected}
                      onToggle={() => toggleIngredient(index)}
                    />
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeIngredient(index)}
                    >
                      <Ionicons name="close-circle" size={16} color={Colors.gray[400]} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </ScrollView>

            {/* Generate Button */}
            {selectedCount > 0 && (
              <View style={styles.generateContainer}>
                <ModernButton
                  title={isGeneratingRecipe ? 'Generating...' : `Generate Recipe (${selectedCount})`}
                  onPress={generateRecipe}
                  variant="primary"
                  size="large"
                  disabled={isGeneratingRecipe}
                  icon={
                    isGeneratingRecipe ? (
                      <ActivityIndicator size="small" color={Colors.white} />
                    ) : (
                      <MaterialCommunityIcons name="chef-hat" size={20} color={Colors.white} />
                    )
                  }
                />
              </View>
            )}
          </Animated.View>
        )}

        {/* Cooking Animation Overlay */}
        {showCookingAnimation && (
          <View style={styles.animationOverlay}>
            <CookingSequence
              steps={['chopping', 'mixing', 'steaming', 'frying']}
              messages={[
                'Analyzing your ingredients...',
                'Mixing flavors together...',
                'Cooking up the perfect recipe...',
                'Almost ready!'
              ]}
              stepDuration={2000}
              onComplete={() => {
                // Animation completes when recipe is ready
              }}
            />
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: Colors.background,
  },
  permissionText: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginVertical: 20,
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
    borderColor: Colors.white,
    borderWidth: 2,
    borderRadius: 16,
    width: width * 0.7,
    height: width * 0.7 * 1.2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000040',
  },
  focusText: {
    color: Colors.white,
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
    borderColor: Colors.white,
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
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.5,
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
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surface,
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
    borderColor: Colors.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    fontSize: 14,
  },
  inputButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surface,
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
    backgroundColor: Colors.white,
    borderRadius: 8,
  },
  generateContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
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
