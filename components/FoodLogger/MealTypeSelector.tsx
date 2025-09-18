import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
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
        toValue: 0.96,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnims[mealId], {
        toValue: 1,
        duration: 120,
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
  }, [selected, onSelect]);

  const renderIcon = (meal: MealType, isSelected: boolean) => {
    const iconColor = isSelected ? Colors.white : meal.color;
    const iconSize = 20;

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
      <View style={styles.chipContainer}>
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
                  isSelected && [styles.chipSelected, { backgroundColor: meal.color }],
                ]}
                onPress={() => handleSelect(meal.id)}
                activeOpacity={0.8}
              >
                <View style={styles.chipContent}>
                  <View style={[
                    styles.iconContainer,
                    isSelected && styles.iconContainerSelected
                  ]}>
                    {renderIcon(meal, isSelected)}
                  </View>
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
                      <Text style={styles.recommendedText}>•</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: Colors.border,
    flex: 1,
    minWidth: '47%',
  },
  chipSelected: {
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chipContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  chipTextContainer: {
    flex: 1,
  },
  chipName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  chipNameSelected: {
    color: Colors.white,
  },
  chipTime: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  chipTimeSelected: {
    color: Colors.white,
    opacity: 0.8,
  },
  recommendedBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  recommendedText: {
    fontSize: 8,
    fontWeight: '600',
    color: Colors.white,
    textAlign: 'center',
  },
});