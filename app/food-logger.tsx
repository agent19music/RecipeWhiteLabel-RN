import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
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
import WaterIntakeTracker from '@/components/FoodLogger/WaterIntakeTracker';
import MealTypeSelector from '@/components/FoodLogger/MealTypeSelector';
import * as HapticUtils from '@/utils/haptics';

const { width } = Dimensions.get('window');

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
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

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

  const toggleInputMode = async () => {
    await HapticUtils.hapticImpact(HapticUtils.ImpactFeedbackStyle.Light);
    setInputMode(inputMode === 'photo' ? 'manual' : 'photo');
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
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Text style={styles.title}>Log Your Meal</Text>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={handleCancel}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={28} color={Colors.text.primary} />
          </TouchableOpacity>
        </Animated.View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Meal Type Selector */}
          <Animated.View 
            style={[
              styles.section,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <Text style={styles.sectionTitle}>Meal Type</Text>
            <MealTypeSelector
              selected={selectedMealType}
              onSelect={setSelectedMealType}
            />
          </Animated.View>

          {/* Food Input Section */}
          <Animated.View 
            style={[
              styles.section,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <Text style={styles.sectionTitle}>Food</Text>
            
            {inputMode === 'photo' ? (
              <>
                <PhotoCapture
                  photo={capturedPhoto}
                  onPhotoCapture={setCapturedPhoto}
                />
                <TouchableOpacity 
                  style={styles.toggleButton}
                  onPress={toggleInputMode}
                >
                  <Text style={styles.toggleText}>Or enter manually</Text>
                  <Ionicons name="pencil" size={18} color={Colors.primary} />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <ManualFoodInput
                  foodItems={foodItems}
                  onAddItem={handleAddFoodItem}
                  onRemoveItem={handleRemoveFoodItem}
                />
                <TouchableOpacity 
                  style={styles.toggleButton}
                  onPress={toggleInputMode}
                >
                  <Text style={styles.toggleText}>Use camera instead</Text>
                  <Ionicons name="camera" size={18} color={Colors.primary} />
                </TouchableOpacity>
              </>
            )}
          </Animated.View>

          {/* Water Intake Section */}
          <Animated.View 
            style={[
              styles.section,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <Text style={styles.sectionTitle}>Water Intake</Text>
            <WaterIntakeTracker
              glasses={waterGlasses}
              onGlassesChange={setWaterGlasses}
            />
          </Animated.View>
        </ScrollView>

        {/* Action Buttons */}
        <Animated.View 
          style={[
            styles.actionContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: Animated.multiply(slideAnim, -1) }],
            }
          ]}
        >
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
            <Text style={styles.saveButtonText}>Save Meal</Text>
          </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    marginTop: 16,
  },
  toggleText: {
    fontSize: 15,
    color: Colors.primary,
    fontWeight: '500',
  },
  actionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: Colors.gray[100],
    alignItems: 'center',
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
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
});