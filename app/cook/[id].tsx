import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
  StatusBar,
  Platform,
  Vibration,
  Modal,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { getRecipeById } from '@/data/enhanced-recipes';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

interface CookingStep {
  id: string;
  title: string;
  description: string;
  time: string;
  tip?: string;
  completed: boolean;
  timerSeconds?: number;
}

const mockSteps: CookingStep[] = [
  {
    id: '1',
    title: 'Prepare Ingredients',
    description: 'Cube the beef into bite-sized pieces. Dice tomatoes and slice onions. Mince garlic cloves.',
    time: '10 min',
    timerSeconds: 600,
    tip: 'Cut beef against the grain for more tender pieces',
    completed: false,
  },
  {
    id: '2',
    title: 'Marinate Beef',
    description: 'Season beef with Royco cubes, salt, pepper, and half the turmeric. Let it rest for 15 minutes.',
    time: '15 min',
    timerSeconds: 900,
    tip: 'Marinating helps the flavors penetrate deeper',
    completed: false,
  },
  {
    id: '3',
    title: 'Sauté Aromatics',
    description: 'Heat oil in a large pot. Add onions and garlic, cook until fragrant and golden.',
    time: '5 min',
    timerSeconds: 300,
    tip: 'Don\'t let the garlic burn - it will taste bitter',
    completed: false,
  },
  {
    id: '4',
    title: 'Brown the Beef',
    description: 'Add marinated beef to the pot. Brown on all sides over high heat.',
    time: '8 min',
    timerSeconds: 480,
    tip: 'Don\'t overcrowd the pot - brown in batches if needed',
    completed: false,
  },
  {
    id: '5',
    title: 'Add Tomatoes & Spices',
    description: 'Add diced tomatoes and remaining turmeric. Cook until tomatoes break down.',
    time: '5 min',
    timerSeconds: 300,
    tip: 'Mash tomatoes slightly to create a thick sauce',
    completed: false,
  },
  {
    id: '6',
    title: 'Simmer',
    description: 'Add beef stock, reduce heat to low. Cover and simmer until beef is tender.',
    time: '45 min',
    timerSeconds: 2700,
    tip: 'Check occasionally and add water if needed',
    completed: false,
  },
  {
    id: '7',
    title: 'Prepare Rice',
    description: 'While beef simmers, rinse rice and cook according to package instructions.',
    time: '20 min',
    timerSeconds: 1200,
    tip: 'Add a cinnamon stick to rice for extra flavor',
    completed: false,
  },
  {
    id: '8',
    title: 'Final Touches',
    description: 'Taste and adjust seasoning. Let rest for 5 minutes before serving.',
    time: '5 min',
    timerSeconds: 300,
    tip: 'Garnish with fresh coriander for color',
    completed: false,
  },
];

export default function CookAlongScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [recipe, setRecipe] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<CookingStep[]>(mockSteps);
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [finalImage, setFinalImage] = useState<string | null>(null);
  const [modifications, setModifications] = useState('');
  const [progress, setProgress] = useState(0);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Get recipe details
    const foundRecipe = getRecipeById(id as string);
    if (foundRecipe) {
      setRecipe(foundRecipe);
      // Use recipe's actual steps if available
      if (foundRecipe.steps && foundRecipe.steps.length > 0) {
        setSteps(foundRecipe.steps.map(step => ({ ...step, completed: false })));
      }
    }

    // Animate in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for timer
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [id]);

  useEffect(() => {
    // Update progress
    const completedSteps = steps.filter(s => s.completed).length;
    setProgress((completedSteps / steps.length) * 100);
  }, [steps]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    const step = steps[currentStep];
    if (step.timerSeconds) {
      setTimerSeconds(step.timerSeconds);
      setTimerActive(true);
      
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            // Timer complete
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Vibration.vibrate([0, 200, 100, 200]);
            setTimerActive(false);
            if (timerIntervalRef.current) {
              clearInterval(timerIntervalRef.current);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const pauseTimer = () => {
    setTimerActive(false);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
  };

  const resetTimer = () => {
    pauseTimer();
    const step = steps[currentStep];
    if (step.timerSeconds) {
      setTimerSeconds(step.timerSeconds);
    }
  };

  const completeStep = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    const newSteps = [...steps];
    newSteps[currentStep].completed = true;
    setSteps(newSteps);
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      pauseTimer();
    } else {
      // All steps completed
      setShowCompletion(true);
    }
  };

  const goToStep = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentStep(index);
    pauseTimer();
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFinalImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFinalImage(result.assets[0].uri);
    }
  };

  const shareToCommunity = () => {
    // Here you would upload to your backend
    console.log('Sharing to community:', { finalImage, modifications });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };

  if (!recipe) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const currentStepData = steps[currentStep];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <SafeAreaView style={styles.header} edges={['top']}>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <Ionicons name="close" size={28} color={Colors.text.primary} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.recipeName}>{recipe.title}</Text>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>
        </View>
        
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="ellipsis-horizontal" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
      </SafeAreaView>

      {/* Main Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Step Counter */}
        <View style={styles.stepCounter}>
          <Text style={styles.stepCounterText}>
            STEP {currentStep + 1} OF {steps.length}
          </Text>
        </View>

        {/* Current Step Card */}
        <Animated.View 
          style={[
            styles.stepCard,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            }
          ]}
        >
          <Text style={styles.stepTitle}>{currentStepData.title}</Text>
          <Text style={styles.stepDescription}>{currentStepData.description}</Text>
          
          {currentStepData.tip && (
            <View style={styles.tipContainer}>
              <MaterialIcons name="lightbulb" size={20} color={Colors.warning} />
              <Text style={styles.tipText}>{currentStepData.tip}</Text>
            </View>
          )}

          {/* Timer Section */}
          {currentStepData.timerSeconds && (
            <View style={styles.timerSection}>
              <Animated.View 
                style={[
                  styles.timerDisplay,
                  timerActive && {
                    transform: [{ scale: pulseAnim }],
                  }
                ]}
              >
                <Text style={styles.timerText}>
                  {formatTime(timerSeconds || currentStepData.timerSeconds)}
                </Text>
              </Animated.View>
              
              <View style={styles.timerControls}>
                {!timerActive ? (
                  <TouchableOpacity 
                    style={styles.timerButton}
                    onPress={startTimer}
                  >
                    <Ionicons name="play" size={32} color={Colors.white} />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity 
                    style={styles.timerButton}
                    onPress={pauseTimer}
                  >
                    <Ionicons name="pause" size={32} color={Colors.white} />
                  </TouchableOpacity>
                )}
                <TouchableOpacity 
                  style={[styles.timerButton, styles.resetButton]}
                  onPress={resetTimer}
                >
                  <Ionicons name="refresh" size={28} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Animated.View>

        {/* Step Navigation */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.stepNavigation}
          contentContainerStyle={styles.stepNavigationContent}
        >
          {steps.map((step, index) => (
            <TouchableOpacity
              key={step.id}
              style={[
                styles.stepDot,
                index === currentStep && styles.stepDotActive,
                step.completed && styles.stepDotCompleted,
              ]}
              onPress={() => goToStep(index)}
            >
              {step.completed ? (
                <Ionicons name="checkmark" size={16} color={Colors.white} />
              ) : (
                <Text style={[
                  styles.stepDotText,
                  index === currentStep && styles.stepDotTextActive,
                ]}>
                  {index + 1}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>

      {/* Bottom Action Button */}
      <View style={styles.bottomAction}>
        <TouchableOpacity 
          style={styles.completeButton}
          onPress={completeStep}
        >
          <Text style={styles.completeButtonText}>
            {currentStep < steps.length - 1 ? 'COMPLETE STEP' : 'FINISH COOKING'}
          </Text>
          <Ionicons name="arrow-forward" size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* Completion Modal */}
      <Modal
        visible={showCompletion}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContent}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>🎉 Congratulations!</Text>
                <Text style={styles.modalSubtitle}>You've completed the recipe</Text>
              </View>

              {/* Image Upload */}
              <View style={styles.imageUploadSection}>
                <Text style={styles.sectionTitle}>Share Your Creation</Text>
                {finalImage ? (
                  <View style={styles.imagePreview}>
                    <Image source={{ uri: finalImage }} style={styles.uploadedImage} />
                    <TouchableOpacity 
                      style={styles.changeImageButton}
                      onPress={pickImage}
                    >
                      <Ionicons name="camera" size={20} color={Colors.white} />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.imageButtons}>
                    <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
                      <Ionicons name="camera" size={32} color={Colors.primary} />
                      <Text style={styles.imageButtonText}>Take Photo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                      <Ionicons name="images" size={32} color={Colors.primary} />
                      <Text style={styles.imageButtonText}>Choose Photo</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {/* Modifications */}
              <View style={styles.modificationsSection}>
                <Text style={styles.sectionTitle}>Any Modifications?</Text>
                <TextInput
                  style={styles.modificationsInput}
                  placeholder="I added extra spices, used chicken instead of beef..."
                  placeholderTextColor={Colors.text.tertiary}
                  multiline
                  value={modifications}
                  onChangeText={setModifications}
                />
              </View>

              {/* Action Buttons */}
              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={styles.shareButton}
                  onPress={shareToCommunity}>
                  <MaterialCommunityIcons name="share-variant" size={24} color={Colors.white} />
                  <Text style={styles.shareButtonText}>Share to Community</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.skipButton}
                  onPress={() => router.back()}
                >
                  <Text style={styles.skipButtonText}>Skip</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  closeButton: {
    padding: 4,
  },
  headerCenter: {
    flex: 1,
    marginHorizontal: 16,
  },
  recipeName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  menuButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  stepCounter: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  stepCounterText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    color: Colors.text.tertiary,
  },
  stepCard: {
    marginHorizontal: 20,
    padding: 24,
    backgroundColor: Colors.white,
    borderRadius: 24,
    shadowColor: Colors.shadow.medium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  stepDescription: {
    fontSize: 18,
    lineHeight: 28,
    color: Colors.text.secondary,
    marginBottom: 20,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: Colors.warning + '10',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  tipText: {
    fontSize: 15,
    color: Colors.text.secondary,
    flex: 1,
    lineHeight: 22,
  },
  timerSection: {
    alignItems: 'center',
    paddingTop: 20,
  },
  timerDisplay: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: Colors.primaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  timerText: {
    fontSize: 48,
    fontWeight: '700',
    color: Colors.primary,
  },
  timerControls: {
    flexDirection: 'row',
    gap: 16,
  },
  timerButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: Colors.surface,
  },
  stepNavigation: {
    marginTop: 32,
    marginBottom: 20,
  },
  stepNavigationContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  stepDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  stepDotActive: {
    backgroundColor: Colors.primaryMuted,
    borderColor: Colors.primary,
  },
  stepDotCompleted: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  stepDotText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.tertiary,
  },
  stepDotTextActive: {
    color: Colors.primary,
  },
  bottomAction: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  completeButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  completeButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    maxHeight: height * 0.9,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  modalTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  imageUploadSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  imagePreview: {
    position: 'relative',
    borderRadius: 20,
    overflow: 'hidden',
  },
  uploadedImage: {
    width: '100%',
    height: 250,
    borderRadius: 20,
  },
  changeImageButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  imageButton: {
    flex: 1,
    height: 120,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  imageButtonText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 8,
  },
  modificationsSection: {
    marginBottom: 30,
  },
  modificationsInput: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: Colors.text.primary,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  modalActions: {
    gap: 12,
  },
  shareButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    paddingVertical: 18,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  shareButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.white,
  },
  skipButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 16,
    color: Colors.text.tertiary,
  },
});
