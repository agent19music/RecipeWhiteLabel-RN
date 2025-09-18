import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/Colors';

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

interface ManualFoodInputProps {
  foodItems: FoodItem[];
  onAddItem: (item: FoodItem) => void;
  onRemoveItem: (id: string) => void;
}

const PORTION_UNITS = ['cups', 'pieces', 'grams', 'oz', 'tbsp', 'tsp', 'serving'];

export default function ManualFoodInput({ 
  foodItems, 
  onAddItem, 
  onRemoveItem 
}: ManualFoodInputProps) {
  const [foodName, setFoodName] = useState('');
  const [portion, setPortion] = useState('');
  const [unit, setUnit] = useState('serving');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [showNutrition, setShowNutrition] = useState(false);

  const handleAddFood = async () => {
    if (!foodName.trim() || !portion.trim()) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const newItem: FoodItem = {
      id: Date.now().toString(),
      name: foodName.trim(),
      portion: portion.trim(),
      unit,
      calories: calories ? parseFloat(calories) : undefined,
      protein: protein ? parseFloat(protein) : undefined,
      carbs: carbs ? parseFloat(carbs) : undefined,
      fat: fat ? parseFloat(fat) : undefined,
    };

    onAddItem(newItem);
    
    // Reset form
    setFoodName('');
    setPortion('');
    setUnit('serving');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
    setShowNutrition(false);

    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const toggleNutrition = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowNutrition(!showNutrition);
  };

  return (
    <View style={styles.container}>
      {/* Food Items List */}
      {foodItems.length > 0 && (
        <View style={styles.itemsList}>
          <Text style={styles.itemsTitle}>Added Foods</Text>
          {foodItems.map((item, index) => (
            <Animated.View 
              key={item.id} 
              style={[
                styles.foodItem,
                { 
                  opacity: new Animated.Value(1),
                  transform: [{ scale: new Animated.Value(1) }]
                }
              ]}
            >
              <View style={styles.foodItemContent}>
                <Text style={styles.foodItemName}>{item.name}</Text>
                <Text style={styles.foodItemPortion}>
                  {item.portion} {item.unit}
                </Text>
                {item.calories && (
                  <Text style={styles.foodItemCalories}>{item.calories} cal</Text>
                )}
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => onRemoveItem(item.id)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close-circle" size={24} color={Colors.error} />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      )}

      {/* Input Form */}
      <View style={styles.inputForm}>
        <Text style={styles.formTitle}>Add Food Item</Text>
        
        {/* Food Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Food Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Grilled Chicken"
            placeholderTextColor={Colors.gray[400]}
            value={foodName}
            onChangeText={setFoodName}
            returnKeyType="next"
          />
        </View>

        {/* Portion Size */}
        <View style={styles.rowInputs}>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.inputLabel}>Portion *</Text>
            <TextInput
              style={styles.input}
              placeholder="1"
              placeholderTextColor={Colors.gray[400]}
              value={portion}
              onChangeText={setPortion}
              keyboardType="numeric"
              returnKeyType="next"
            />
          </View>
          
          <View style={[styles.inputGroup, { flex: 1.5 }]}>
            <Text style={styles.inputLabel}>Unit</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.unitsScroll}
            >
              {PORTION_UNITS.map((u) => (
                <TouchableOpacity
                  key={u}
                  style={[
                    styles.unitChip,
                    unit === u && styles.unitChipActive
                  ]}
                  onPress={() => setUnit(u)}
                >
                  <Text style={[
                    styles.unitChipText,
                    unit === u && styles.unitChipTextActive
                  ]}>
                    {u}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Nutrition Toggle */}
        <TouchableOpacity 
          style={styles.nutritionToggle}
          onPress={toggleNutrition}
        >
          <Text style={styles.nutritionToggleText}>
            Add Nutrition Info (Optional)
          </Text>
          <Ionicons 
            name={showNutrition ? "chevron-up" : "chevron-down"} 
            size={20} 
            color={Colors.primary} 
          />
        </TouchableOpacity>

        {/* Nutrition Fields */}
        {showNutrition && (
          <View style={styles.nutritionFields}>
            <View style={styles.nutritionRow}>
              <View style={styles.nutritionInput}>
                <Text style={styles.nutritionLabel}>Calories</Text>
                <TextInput
                  style={styles.nutritionField}
                  placeholder="0"
                  placeholderTextColor={Colors.gray[400]}
                  value={calories}
                  onChangeText={setCalories}
                  keyboardType="numeric"
                />
              </View>
              
              <View style={styles.nutritionInput}>
                <Text style={styles.nutritionLabel}>Protein (g)</Text>
                <TextInput
                  style={styles.nutritionField}
                  placeholder="0"
                  placeholderTextColor={Colors.gray[400]}
                  value={protein}
                  onChangeText={setProtein}
                  keyboardType="numeric"
                />
              </View>
            </View>
            
            <View style={styles.nutritionRow}>
              <View style={styles.nutritionInput}>
                <Text style={styles.nutritionLabel}>Carbs (g)</Text>
                <TextInput
                  style={styles.nutritionField}
                  placeholder="0"
                  placeholderTextColor={Colors.gray[400]}
                  value={carbs}
                  onChangeText={setCarbs}
                  keyboardType="numeric"
                />
              </View>
              
              <View style={styles.nutritionInput}>
                <Text style={styles.nutritionLabel}>Fat (g)</Text>
                <TextInput
                  style={styles.nutritionField}
                  placeholder="0"
                  placeholderTextColor={Colors.gray[400]}
                  value={fat}
                  onChangeText={setFat}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>
        )}

        {/* Add Button */}
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddFood}
        >
          <Ionicons name="add-circle" size={20} color={Colors.white} />
          <Text style={styles.addButtonText}>Add Food Item</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  itemsList: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
  },
  itemsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.secondary,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  foodItemContent: {
    flex: 1,
  },
  foodItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  foodItemPortion: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  foodItemCalories: {
    fontSize: 12,
    color: Colors.primary,
    marginTop: 2,
  },
  removeButton: {
    padding: 4,
  },
  inputForm: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
  },
  formTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.secondary,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text.primary,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  unitsScroll: {
    flexGrow: 0,
  },
  unitChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
  },
  unitChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  unitChipText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  unitChipTextActive: {
    color: Colors.white,
    fontWeight: '500',
  },
  nutritionToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginBottom: 8,
  },
  nutritionToggleText: {
    fontSize: 15,
    color: Colors.primary,
    fontWeight: '500',
  },
  nutritionFields: {
    marginBottom: 16,
  },
  nutritionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  nutritionInput: {
    flex: 1,
  },
  nutritionLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text.secondary,
    marginBottom: 6,
  },
  nutritionField: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.text.primary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
});