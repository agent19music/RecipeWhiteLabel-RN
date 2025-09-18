import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import PhotoCapture from '@/components/FoodLogger/PhotoCapture';
import ManualFoodInput from '@/components/FoodLogger/ManualFoodInput';
import WaterIntakeTracker from '@/components/FoodLogger/WaterIntakeTracker'; // Use the updated WaterIntakeTracker
// import WaterIntakeTracker from '@/components/FoodLogger/WaterIntakeTracker';
import MealTypeSelector from '@/components/FoodLogger/MealTypeSelector';
import * as HapticUtils from '@/utils/haptics';

interface FoodItem {
  id: string;
  name: string;
  portion: string;
  unit: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

export default function FoodLoggerScreen() {
  const router = useRouter();
  const [inputMode, setInputMode] = useState<'photo' | 'manual'>('photo');
  const [selectedMealType, setSelectedMealType] = useState<string>('lunch');
  const [waterGlasses, setWaterGlasses] = useState(0);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleSave = async () => {
    await HapticUtils.hapticImpact(HapticUtils.ImpactFeedbackStyle.Medium);
    
    // Validate input
    if (!capturedPhoto && foodItems.length === 0) {
      
      Alert.alert('No Data', 'Please add food items or take a photo of your meal');
      return;
    }

    // Here you would save the data to your backend
    const mealData = {
      mealType: selectedMealType,
      photo: capturedPhoto,
      foodItems,
      waterIntake: waterGlasses,
      timestamp: new Date().toISOString(),
    };

    console.log('Saving meal data:', mealData);
    
    // Show success feedback
    await HapticUtils.hapticNotification(HapticUtils.NotificationFeedbackType.Success);
    Alert.alert('Success', 'Your meal has been logged!', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  const handleCancel = async () => {
    await HapticUtils.hapticImpact(HapticUtils.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleAddFoodItem = (item: FoodItem) => {
    setFoodItems([...foodItems, item]);
  };

  const handleRemoveFoodItem = async (id: string) => {
    await HapticUtils.hapticImpact(HapticUtils.ImpactFeedbackStyle.Light);
    setFoodItems(foodItems.filter(item => item.id !== id));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Modern Header */}
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={handleCancel}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <View style={styles.closeButtonBackground}>
                <Ionicons name="close" size={20} color={Colors.text.secondary} />
              </View>
            </TouchableOpacity>
            
            <View style={styles.headerTitleContainer}>
              <Text style={styles.title}>Log Your Meal</Text>
              <Text style={styles.subtitle}>Track what you eat today</Text>
            </View>
            
            {/* Invisible spacer for layout balance */}
            <View style={styles.closeButton} />
          </View>
        </Animated.View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Meal Type Card */}
          <Animated.View 
            style={[
              styles.card,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <View style={styles.cardHeader}>
              <View style={styles.cardIconContainer}>
                <Ionicons name="time-outline" size={18} color={Colors.primary} />
              </View>
              <Text style={styles.cardTitle}>Meal Type</Text>
            </View>
            <MealTypeSelector
              selected={selectedMealType}
              onSelect={setSelectedMealType}
            />
          </Animated.View>

          {/* Food Input Card */}
          <Animated.View 
            style={[
              styles.card,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <View style={styles.cardHeader}>
              <View style={styles.cardIconContainer}>
                <Ionicons name="restaurant-outline" size={18} color={Colors.primary} />
              </View>
              <Text style={styles.cardTitle}>What did you eat?</Text>
            </View>
            
            {/* Input Mode Toggle */}
            <View style={styles.toggleContainer}>
              <TouchableOpacity 
                style={[
                  styles.toggleOption,
                  inputMode === 'photo' && styles.toggleOptionActive
                ]}
                onPress={() => setInputMode('photo')}
              >
                <Ionicons 
                  name="camera-outline" 
                  size={16} 
                  color={inputMode === 'photo' ? Colors.white : Colors.text.secondary} 
                />
                <Text style={[
                  styles.toggleText,
                  inputMode === 'photo' && styles.toggleTextActive
                ]}>
                  Photo
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.toggleOption,
                  inputMode === 'manual' && styles.toggleOptionActive
                ]}
                onPress={() => setInputMode('manual')}
              >
                <Ionicons 
                  name="create-outline" 
                  size={16} 
                  color={inputMode === 'manual' ? Colors.white : Colors.text.secondary} 
                />
                <Text style={[
                  styles.toggleText,
                  inputMode === 'manual' && styles.toggleTextActive
                ]}>
                  Manual
                </Text>
              </TouchableOpacity>
            </View>
            
            {/* Input Content */}
            <View style={styles.inputContent}>
              {inputMode === 'photo' ? (
                <PhotoCapture
                  photo={capturedPhoto}
                  onPhotoCapture={setCapturedPhoto}
                />
              ) : (
                <ManualFoodInput
                  foodItems={foodItems}
                  onAddItem={handleAddFoodItem}
                  onRemoveItem={handleRemoveFoodItem}
                />
              )}
            </View>
          </Animated.View>

          {/* Water Intake Card */}
          <Animated.View 
            style={[
              styles.card,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <View style={styles.cardHeader}>
              <View style={styles.cardIconContainer}>
                <Ionicons name="water-outline" size={18} color={Colors.primary} />
              </View>
              <Text style={styles.cardTitle}>Water Intake</Text>
              <Text style={styles.cardSubtitle}>Stay hydrated</Text>
            </View>
            <WaterIntakeTracker
              glasses={waterGlasses}
              onGlassesChange={setWaterGlasses}
            />
          </Animated.View>
        </ScrollView>

        {/* Modern Action Buttons */}
        <Animated.View 
          style={[
            styles.actionContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: Animated.multiply(slideAnim, -1) }],
            }
          ]}
        >
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSave}
            >
              <View style={styles.saveButtonContent}>
                <Ionicons name="checkmark" size={20} color={Colors.white} />
                <Text style={styles.saveButtonText}>Save Meal</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitleContainer: {
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.text.secondary,
    marginTop: 2,
    fontWeight: '400',
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonBackground: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  scrollContent: {
    paddingVertical: 16,
    paddingBottom: 120,
  },
  card: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    flex: 1,
    letterSpacing: -0.2,
  },
  cardSubtitle: {
    fontSize: 13,
    color: Colors.text.secondary,
    marginLeft: 'auto',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  toggleOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  toggleOptionActive: {
    backgroundColor: Colors.primary,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  toggleTextActive: {
    color: Colors.white,
  },
  inputContent: {
    marginTop: 4,
  },
  actionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    borderTopWidth: 0.5,
    borderTopColor: Colors.border,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  saveButton: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
    letterSpacing: -0.2,
  },
});