import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/Colors';

interface MealType {
  id: string;
  name: string;
  icon: string;
  iconType: 'ionicon' | 'material';
  color: string;
  time: string;
}

interface MealTypeSelectorProps {
  selected: string;
  onSelect: (id: string) => void;
}

const MEAL_TYPES: MealType[] = [
  {
    id: 'breakfast',
    name: 'Breakfast',
    icon: 'sunny',
    iconType: 'ionicon',
    color: '#FFA500',
    time: '6AM - 11AM',
  },
  {
    id: 'lunch',
    name: 'Lunch',
    icon: 'restaurant',
    iconType: 'ionicon',
    color: '#4CAF50',
    time: '11AM - 3PM',
  },
  {
    id: 'dinner',
    name: 'Dinner',
    icon: 'moon',
    iconType: 'ionicon',
    color: '#9C27B0',
    time: '5PM - 9PM',
  },
  {
    id: 'snack',
    name: 'Snack',
    icon: 'food-apple',
    iconType: 'material',
    color: '#FF5722',
    time: 'Anytime',
  },
];

export default function MealTypeSelector({ selected, onSelect }: MealTypeSelectorProps) {
  const scaleAnims = useRef(
    MEAL_TYPES.reduce((acc, meal) => {
      acc[meal.id] = new Animated.Value(1);
      return acc;
    }, {} as { [key: string]: Animated.Value })
  ).current;

  const handleSelect = async (mealId: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Animate the selected chip
    Animated.sequence([
      Animated.timing(scaleAnims[mealId], {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnims[mealId], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onSelect(mealId);
  };

  const getCurrentMealType = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 11) return 'breakfast';
    if (hour >= 11 && hour < 15) return 'lunch';
    if (hour >= 17 && hour < 21) return 'dinner';
    return 'snack';
  };

  React.useEffect(() => {
    // Set default meal type based on current time
    if (!selected) {
      onSelect(getCurrentMealType());
    }
  }, []);

  const renderIcon = (meal: MealType, isSelected: boolean) => {
    const iconColor = isSelected ? Colors.white : meal.color;
    const iconSize = 24;

    if (meal.iconType === 'material') {
      return (
        <MaterialCommunityIcons
          name={meal.icon as any}
          size={iconSize}
          color={iconColor}
        />
      );
    }
    
    return (
      <Ionicons
        name={meal.icon as any}
        size={iconSize}
        color={iconColor}
      />
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {MEAL_TYPES.map((meal) => {
          const isSelected = selected === meal.id;
          const isRecommended = meal.id === getCurrentMealType();
          
          return (
            <Animated.View
              key={meal.id}
              style={{
                transform: [{ scale: scaleAnims[meal.id] }],
              }}
            >
              <TouchableOpacity
                style={[
                  styles.chip,
                  isSelected && styles.chipSelected,
                  isSelected && { backgroundColor: meal.color },
                ]}
                onPress={() => handleSelect(meal.id)}
                activeOpacity={0.8}
              >
                <View style={styles.chipContent}>
                  {renderIcon(meal, isSelected)}
                  <View style={styles.chipTextContainer}>
                    <Text
                      style={[
                        styles.chipName,
                        isSelected && styles.chipNameSelected,
                      ]}
                    >
                      {meal.name}
                    </Text>
                    <Text
                      style={[
                        styles.chipTime,
                        isSelected && styles.chipTimeSelected,
                      ]}
                    >
                      {meal.time}
                    </Text>
                  </View>
                  {isRecommended && !isSelected && (
                    <View style={styles.recommendedBadge}>
                      <Text style={styles.recommendedText}>Now</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </ScrollView>

      {/* Current Selection Display */}
      <View style={styles.selectionDisplay}>
        <Text style={styles.selectionLabel}>Selected:</Text>
        <Text style={styles.selectionValue}>
          {MEAL_TYPES.find(m => m.id === selected)?.name || 'None'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  scrollContent: {
    paddingHorizontal: 4,
    gap: 12,
  },
  chip: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    minWidth: 120,
  },
  chipSelected: {
    borderColor: 'transparent',
  },
  chipContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  chipTextContainer: {
    flex: 1,
  },
  chipName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  chipNameSelected: {
    color: Colors.white,
  },
  chipTime: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  chipTimeSelected: {
    color: Colors.white,
    opacity: 0.9,
  },
  recommendedBadge: {
    backgroundColor: Colors.success,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  recommendedText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.white,
  },
  selectionDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 4,
  },
  selectionLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  selectionValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
});