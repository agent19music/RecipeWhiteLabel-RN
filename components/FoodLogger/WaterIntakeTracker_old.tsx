import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  TextInput,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/Colors';

interface WaterIntakeTrackerProps {
  glasses: number;
  onGlassesChange: (glasses: number) => void;
}

const MAX_GLASSES = 12;
const DEFAULT_GLASSES = 8;

export default function WaterIntakeTracker({ 
  glasses, 
  onGlassesChange 
}: WaterIntakeTrackerProps) {
  const [customAmount, setCustomAmount] = React.useState('');
  const [showCustom, setShowCustom] = React.useState(false);
  const animatedValues = useRef(
    Array.from({ length: MAX_GLASSES }, () => new Animated.Value(0))
  ).current;

  React.useEffect(() => {
    animatedValues.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: index < glasses ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  }, [glasses]);

  const handleGlassTap = async (index: number) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // If tapping a filled glass, unfill from that point
    // If tapping an empty glass, fill up to that point
    const newGlasses = index < glasses ? index : index + 1;
    onGlassesChange(Math.min(newGlasses, MAX_GLASSES));
  };

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

  const handleCustomAmount = () => {
    const amount = parseInt(customAmount);
    if (!isNaN(amount) && amount >= 0 && amount <= MAX_GLASSES) {
      onGlassesChange(amount);
      setCustomAmount('');
      setShowCustom(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  };

  const toggleCustom = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowCustom(!showCustom);
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

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, glasses === 0 && styles.controlButtonDisabled]}
          onPress={handleRemoveGlass}
          disabled={glasses === 0}
        >
          <Ionicons 
            name="remove-circle-outline" 
            size={24} 
            color={glasses === 0 ? Colors.gray[300] : Colors.primary} 
          />
          <Text style={[
            styles.controlButtonText,
            glasses === 0 && styles.controlButtonTextDisabled
          ]}>
            Remove
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.customButton}
          onPress={toggleCustom}
        >
          <MaterialCommunityIcons name="water-plus" size={24} color={Colors.info} />
          <Text style={styles.customButtonText}>Custom</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.controlButton,
            glasses >= MAX_GLASSES && styles.controlButtonDisabled
          ]}
          onPress={handleAddGlass}
          disabled={glasses >= MAX_GLASSES}
        >
          <Ionicons 
            name="add-circle-outline" 
            size={24} 
            color={glasses >= MAX_GLASSES ? Colors.gray[300] : Colors.primary} 
          />
          <Text style={[
            styles.controlButtonText,
            glasses >= MAX_GLASSES && styles.controlButtonTextDisabled
          ]}>
            Add
          </Text>
        </TouchableOpacity>
      </View>

      {/* Custom Input */}
      {showCustom && (
        <Animated.View style={styles.customInput}>
          <Text style={styles.customLabel}>Enter number of glasses:</Text>
          <View style={styles.customInputRow}>
            <TextInput
              style={styles.customField}
              placeholder="0-12"
              placeholderTextColor={Colors.gray[400]}
              value={customAmount}
              onChangeText={setCustomAmount}
              keyboardType="numeric"
              maxLength={2}
            />
            <TouchableOpacity
              style={styles.customSubmit}
              onPress={handleCustomAmount}
            >
              <Text style={styles.customSubmitText}>Set</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      {/* Quick Tips */}
      <View style={styles.tipContainer}>
        <Ionicons name="information-circle" size={16} color={Colors.info} />
        <Text style={styles.tipText}>
          Tip: Aim for 8 glasses (2 liters) of water per day
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
  },
  glassGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
  },
  glassContainer: {
    position: 'relative',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  waterFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: Colors.info + '20',
    borderBottomLeftRadius: 11,
    borderBottomRightRadius: 11,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  amountText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  messageText: {
    fontSize: 14,
    color: Colors.info,
    fontWeight: '500',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  controlButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  controlButtonDisabled: {
    opacity: 0.5,
  },
  controlButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  controlButtonTextDisabled: {
    color: Colors.gray[300],
  },
  customButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: Colors.info + '10',
    borderWidth: 1,
    borderColor: Colors.info + '30',
  },
  customButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.info,
  },
  customInput: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  customLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  customInputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  customField: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: Colors.text.primary,
  },
  customSubmit: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    backgroundColor: Colors.info,
    borderRadius: 6,
    justifyContent: 'center',
  },
  customSubmitText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.info + '10',
    padding: 12,
    borderRadius: 8,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: Colors.info,
  },
});