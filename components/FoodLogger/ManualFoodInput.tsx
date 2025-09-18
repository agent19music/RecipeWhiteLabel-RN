import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
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

const PORTION_UNITS = ['serving', 'cup', 'piece', 'gram', 'oz', 'tbsp', 'tsp'];

export default function ManualFoodInput({
  foodItems,
  onAddItem,
  onRemoveItem
}: ManualFoodInputProps) {
  const [foodName, setFoodName] = useState('');
  const [portion, setPortion] = useState('');
  const [unit, setUnit] = useState('serving');

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
    };

    onAddItem(newItem);
    
    // Reset form
    setFoodName('');
    setPortion('');
    setUnit('serving');

    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleRemoveFood = async (id: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onRemoveItem(id);
  };

  const canAddFood = foodName.trim() && portion.trim();

  return (
    <View style={styles.container}>
      {/* Add Food Form */}
      <View style={styles.formCard}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Food Item</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Grilled chicken"
            placeholderTextColor={Colors.text.tertiary}
            value={foodName}
            onChangeText={setFoodName}
            returnKeyType="next"
          />
        </View>

        <View style={styles.rowInputs}>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.inputLabel}>Amount</Text>
            <TextInput
              style={styles.input}
              placeholder="1"
              placeholderTextColor={Colors.text.tertiary}
              value={portion}
              onChangeText={setPortion}
              keyboardType="numeric"
              returnKeyType="done"
            />
          </View>

          <View style={[styles.inputGroup, { flex: 1.2 }]}>
            <Text style={styles.inputLabel}>Unit</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.unitSelector}
              contentContainerStyle={styles.unitSelectorContent}
            >
              {PORTION_UNITS.map((unitOption) => (
                <TouchableOpacity
                  key={unitOption}
                  style={[
                    styles.unitChip,
                    unit === unitOption && styles.unitChipActive
                  ]}
                  onPress={() => setUnit(unitOption)}
                >
                  <Text style={[
                    styles.unitChipText,
                    unit === unitOption && styles.unitChipTextActive
                  ]}>
                    {unitOption}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.addButton, !canAddFood && styles.addButtonDisabled]}
          onPress={handleAddFood}
          disabled={!canAddFood}
        >
          <Ionicons 
            name="add" 
            size={20} 
            color={canAddFood ? Colors.white : Colors.text.tertiary} 
          />
          <Text style={[
            styles.addButtonText,
            !canAddFood && styles.addButtonTextDisabled
          ]}>
            Add Food
          </Text>
        </TouchableOpacity>
      </View>

      {/* Food Items List */}
      {foodItems.length > 0 && (
        <View style={styles.listCard}>
          <Text style={styles.listTitle}>Added Foods</Text>
          {foodItems.map((item) => (
            <View key={item.id} style={styles.foodItem}>
              <View style={styles.foodInfo}>
                <Text style={styles.foodName}>{item.name}</Text>
                <Text style={styles.foodPortion}>
                  {item.portion} {item.unit}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveFood(item.id)}
              >
                <Ionicons name="close" size={16} color={Colors.text.secondary} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Empty State */}
      {foodItems.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="restaurant-outline" size={32} color={Colors.text.tertiary} />
          <Text style={styles.emptyStateText}>No foods added yet</Text>
          <Text style={styles.emptyStateSubtext}>Add foods manually using the form above</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
  },
  formCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 6,
    letterSpacing: -0.1,
  },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: Colors.text.primary,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  unitSelector: {
    maxHeight: 42,
  },
  unitSelectorContent: {
    paddingRight: 16,
  },
  unitChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 6,
    marginRight: 8,
  },
  unitChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  unitChipText: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  unitChipTextActive: {
    color: Colors.white,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonDisabled: {
    backgroundColor: Colors.surface,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
    letterSpacing: -0.2,
  },
  addButtonTextDisabled: {
    color: Colors.text.tertiary,
  },
  listCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.text.primary,
    marginBottom: 2,
    letterSpacing: -0.1,
  },
  foodPortion: {
    fontSize: 13,
    color: Colors.text.secondary,
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.secondary,
    marginTop: 12,
    letterSpacing: -0.1,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.text.tertiary,
    marginTop: 4,
    textAlign: 'center',
  },
});
