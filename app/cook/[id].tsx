import ModernButton from '@/components/ModernButton';
import { Colors } from '@/constants/Colors';
import { getRecipeById } from '@/data/enhanced-recipes';
import { RecipeStep } from '@/data/types';
import { useDialog } from '@/hooks/useDialog';
import * as Haptics from 'expo-haptics';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import {
  CaretLeftIcon,
  CaretRightIcon,
  CheckIcon,
  LightbulbIcon,
  PauseIcon,
  PlayIcon,
  ThermometerIcon,
  X
} from 'phosphor-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function CookingScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [recipe, setRecipe] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [timer, setTimer] = useState<number | null>(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
    const timerInterval = useRef<NodeJS.Timeout | null>(null);
  const { dialog, showWarningDialog, showConfirmDialog, showDialog, hideDialog } = useDialog();

  useEffect(() => {
    const loadRecipe = async () => {
      try {
        const foundRecipe = await getRecipeById(id as string);
        if (foundRecipe) {
          setRecipe(foundRecipe);
        }
      } catch (error) {
        console.error('Error loading recipe:', error);
      }
    };

    loadRecipe();

    // Animate in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
    };
  }, [id]);

  useEffect(() => {
    if (isTimerActive && timer !== null && timer > 0) {
      timerInterval.current = setInterval(() => {
        setTimer(prev => {
          if (prev === null || prev <= 1) {
            setIsTimerActive(false);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            showDialog({
              title: 'Timer Complete!',
              message: 'Time for the next step.',
              icon: { name: 'timer-check', backgroundColor: Colors.success },
              actions: [{ label: 'OK', variant: 'primary', onPress: hideDialog }]
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerInterval.current) {
      clearInterval(timerInterval.current);
      timerInterval.current = null;
    }

    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
    };
  }, [isTimerActive, timer]);

  if (!recipe) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading recipe...</Text>
      </View>
    );
  }

  const steps: RecipeStep[] = recipe.steps || [];

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    const currentStepData = steps[currentStep];
    if (currentStepData.time) {
      setTimer(currentStepData.time * 60); // Convert minutes to seconds
      setIsTimerActive(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const stopTimer = () => {
    setIsTimerActive(false);
    setTimer(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      // Mark current step as completed
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      setCurrentStep(currentStep + 1);
      setTimer(null);
      setIsTimerActive(false);
      
      // Animate transition
      Animated.sequence([
        Animated.timing(slideAnim, {
          toValue: -50,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
      
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setTimer(null);
      setIsTimerActive(false);
      
      // Animate transition
      Animated.sequence([
        Animated.timing(slideAnim, {
          toValue: 50,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
      
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const finishCooking = () => {
    showDialog({
      title: 'Cooking Complete! 🎉',
      message: 'Great job! You\'ve successfully prepared ' + recipe.title,
      icon: { name: 'chef-hat', backgroundColor: Colors.success },
      actions: [
        {
          label: 'View Recipe',
          variant: 'primary',
          onPress: () => router.replace(`/recipe/${recipe.id}`)
        },
        {
          label: 'Back to Home',
          variant: 'secondary',
          onPress: () => router.replace('/(tabs)/')
        }
      ]
    });
  };

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen 
        options={{ 
          title: recipe.title,
          headerShown: true,
          headerStyle: { backgroundColor: Colors.white },
          headerTintColor: Colors.text.primary,
          headerTitleStyle: { fontWeight: '600' },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                showConfirmDialog({ 
                    title: 'Exit Cooking?',
                  message: 'Are you sure you want to stop cooking? Your progress will be lost.',
                  actions: [
                    { label: 'Cancel', variant: 'secondary', onPress: () => {} },
                    { label: 'Exit', variant: 'destructive', onPress: () => router.back() }
                  ]
                });
                 
              }}
                          
              style={{ marginLeft: 12 }}
            >
              <X size={24} color={Colors.text.primary} />
            </TouchableOpacity>
          ),
        }} 
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        {/* Progress Header */}
        <View style={styles.progressHeader}>
          <Text style={styles.progressText}>
            Step {currentStep + 1} of {steps.length}
          </Text>
          <View style={styles.progressBar}>
            <Animated.View 
              style={[
                styles.progressFill, 
                { width: `${progress}%` }
              ]} 
            />
          </View>
        </View>

        {/* Timer Section */}
        {currentStepData.time && (
          <View style={styles.timerSection}>
            <View style={styles.timerDisplay}>
              <Text style={styles.timerText}>
                {timer !== null ? formatTime(timer) : `${currentStepData.time}:00`}
              </Text>
              <Text style={styles.timerLabel}>
                {isTimerActive ? 'Timer Active' : 'Suggested Time'}
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.timerButton,
                isTimerActive && styles.timerButtonActive
              ]}
              onPress={isTimerActive ? stopTimer : startTimer}
            >
              {isTimerActive ? (
                <PauseIcon size={20} color={Colors.white} />
              ) : (
                <PlayIcon size={20} color={Colors.white} />
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Step Content */}
        <ScrollView style={styles.stepContainer} showsVerticalScrollIndicator={false}>
          <Animated.View 
            style={[
              styles.stepContent,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.stepHeader}>
              <View style={[
                styles.stepNumber,
                completedSteps.has(currentStep) && styles.stepNumberCompleted
              ]}>
                {completedSteps.has(currentStep) ? (
                  <CheckIcon size={24} color={Colors.white} />
                ) : (
                  <Text style={styles.stepNumberText}>{currentStep + 1}</Text>
                )}
              </View>
              <View style={styles.stepHeaderText}>
                {currentStepData.title && (
                  <Text style={styles.stepTitle}>{currentStepData.title}</Text>
                )}
                {currentStepData.temperature && (
                  <View style={styles.temperatureContainer}>
                    <ThermometerIcon size={16} color={Colors.error} />
                    <Text style={styles.temperatureText}>
                      {currentStepData.temperature.value}°{currentStepData.temperature.unit}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <Text style={styles.stepDescription}>{currentStepData.body}</Text>

            {/* Tips */}
            {currentStepData.tips && currentStepData.tips.length > 0 && (
              <View style={styles.tipContainer}>
                <View style={styles.tipHeader}>
                  <LightbulbIcon size={18} color={Colors.warning} />
                  <Text style={styles.tipHeaderText}>Pro Tip</Text>
                </View>
                {currentStepData.tips.map((tip, index) => (
                  <Text key={index} style={styles.tipText}>• {tip}</Text>
                ))}
              </View>
            )}
          </Animated.View>
        </ScrollView>

        {/* Navigation Footer */}
        <View style={styles.navigationFooter}>
          <TouchableOpacity
            style={[styles.navButton, currentStep === 0 && styles.navButtonDisabled]}
            onPress={prevStep}
            disabled={currentStep === 0}
          >
            <CaretLeftIcon 
              size={24} 
              color={currentStep === 0 ? Colors.gray[400] : Colors.primary} 
            />
          </TouchableOpacity>

          <View style={styles.centerNavArea}>
            {currentStep === steps.length - 1 ? (
              <ModernButton
                title="Finish Cooking"
                onPress={finishCooking}
                variant="primary"
                size="large"
                icon={<CheckIcon size={20} color={Colors.white} />}
              />
            ) : (
              <ModernButton
                title="Next Step"
                onPress={nextStep}
                variant="primary"
                size="large"
                icon={<CaretRightIcon size={20} color={Colors.white} />}
              />
            )}
          </View>

          <TouchableOpacity
            style={[styles.navButton, currentStep === steps.length - 1 && styles.navButtonDisabled]}
            onPress={nextStep}
            disabled={currentStep === steps.length - 1}
          >
            <CaretRightIcon 
              size={24} 
              color={currentStep === steps.length - 1 ? Colors.gray[400] : Colors.primary} 
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaView>
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
  progressHeader: {
    padding: 20,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.gray[200],
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  timerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
  },
  timerDisplay: {
    flex: 1,
  },
  timerText: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.primary,
    fontVariant: ['tabular-nums'],
  },
  timerLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  timerButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerButtonActive: {
    backgroundColor: Colors.error,
  },
  stepContainer: {
    flex: 1,
    padding: 20,
  },
  stepContent: {
    flex: 1,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  stepNumber: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepNumberCompleted: {
    backgroundColor: Colors.success,
  },
  stepNumberText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.white,
  },
  stepHeaderText: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  temperatureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.error + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  temperatureText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.error,
  },
  stepDescription: {
    fontSize: 18,
    color: Colors.text.secondary,
    lineHeight: 28,
    marginBottom: 20,
  },
  tipContainer: {
    backgroundColor: Colors.warning + '10',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  tipHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.warning,
  },
  tipText: {
    fontSize: 15,
    color: Colors.text.secondary,
    lineHeight: 22,
    marginBottom: 4,
  },
  navigationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  navButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonDisabled: {
    backgroundColor: Colors.gray[100],
  },
  centerNavArea: {
    flex: 1,
    marginHorizontal: 20,
  },
});