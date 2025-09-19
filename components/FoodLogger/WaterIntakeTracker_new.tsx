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

interface WaterIntakeTrackerProps {
  glasses: number;
  onGlassesChange: (glasses: number) => void;
}

const MAX_GLASSES = 12;

export default function WaterIntakeTracker({
  glasses,
  onGlassesChange
}: WaterIntakeTrackerProps) {
  const animatedValues = useRef(
    Array.from({ length: MAX_GLASSES }, () => new Animated.Value(0))
  ).current;

  React.useEffect(() => {
    animatedValues.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: index < glasses ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  }, [glasses, animatedValues]);

  const handleAddGlass = async () => {
    if (glasses < MAX_GLASSES) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onGlassesChange(glasses + 1);
    }
  };

  const handleRemoveGlass = async () => {
    if (glasses > 0) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onGlassesChange(glasses - 1);
    }
  };

  const getWaterAmount = () => {
    const mlPerGlass = 250;
    const totalMl = glasses * mlPerGlass;
    const totalLiters = (totalMl / 1000).toFixed(1);
    return `${totalMl} ml (${totalLiters} L)`;
  };

  const getHydrationMessage = () => {
    if (glasses === 0) return "Let's stay hydrated! 💧";
    if (glasses < 4) return "Good start! Keep going 💪";
    if (glasses < 8) return "Halfway there! Great job 🌊";
    if (glasses >= 8) return "Excellent hydration! 🎉";
    return "";
  };

  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressText}>{glasses} of 8 glasses</Text>
          <Text style={styles.amountText}>{getWaterAmount()}</Text>
        </View>
        <View style={styles.progressBarBackground}>
          <View 
            style={[
              styles.progressBarFill, 
              { width: `${(glasses / 8) * 100}%` }
            ]} 
          />
        </View>
      </View>

      {/* Glass Controls */}
      <View style={styles.controlsSection}>
        <TouchableOpacity
          style={[styles.controlButton, glasses === 0 && styles.controlButtonDisabled]}
          onPress={handleRemoveGlass}
          disabled={glasses === 0}
        >
          <Ionicons name="remove" size={20} color={glasses === 0 ? Colors.text.tertiary : Colors.white} />
        </TouchableOpacity>
        
        <View style={styles.glassDisplay}>
          <MaterialCommunityIcons
            name="cup-water"
            size={32}
            color={Colors.info}
          />
          <Text style={styles.glassCount}>{glasses}</Text>
        </View>
        
        <TouchableOpacity
          style={[styles.controlButton, glasses >= MAX_GLASSES && styles.controlButtonDisabled]}
          onPress={handleAddGlass}
          disabled={glasses >= MAX_GLASSES}
        >
          <Ionicons name="add" size={20} color={glasses >= MAX_GLASSES ? Colors.text.tertiary : Colors.white} />
        </TouchableOpacity>
      </View>

      {/* Motivational Message */}
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>{getHydrationMessage()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
  },
  progressSection: {
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    letterSpacing: -0.2,
  },
  amountText: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: Colors.surface,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.info,
    borderRadius: 4,
  },
  controlsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 16,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  controlButtonDisabled: {
    backgroundColor: Colors.surface,
  },
  glassDisplay: {
    alignItems: 'center',
    gap: 8,
  },
  glassCount: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
    letterSpacing: -0.3,
  },
  messageContainer: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 12,
    borderRadius: 8,
  },
  messageText: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: '500',
    textAlign: 'center',
  },
});
