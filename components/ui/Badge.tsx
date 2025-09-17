import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface BadgeProps {
  label: string;
  onRemove?: () => void;
  confidence?: number;
  style?: ViewStyle;
  textStyle?: TextStyle;
  removable?: boolean;
}

export default function Badge({ 
  label, 
  onRemove, 
  confidence = 1,
  style,
  textStyle,
  removable = true
}: BadgeProps) {
  const scaleAnim = React.useRef(new Animated.Value(0)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleRemove = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onRemove?.();
    });
  };

  const getConfidenceColor = () => {
    if (confidence >= 0.8) return '#34C759'; // System Green
    if (confidence >= 0.6) return '#FF9500'; // System Orange
    return '#8E8E93'; // System Gray
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        style,
        {
          transform: [{ scale: scaleAnim }],
          opacity: fadeAnim,
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.badge,
          { borderColor: getConfidenceColor() }
        ]}
        activeOpacity={0.8}
        onPress={removable ? handleRemove : undefined}
      >
        <Text style={[styles.label, textStyle]}>{label}</Text>
        {removable && (
          <Ionicons 
            name="close-circle-outline" 
            size={18} 
            color="#8E8E93"
            style={styles.removeIcon}
          />
        )}
      </TouchableOpacity>
      {confidence < 1 && (
        <Text style={styles.confidence}>
          {Math.round(confidence * 100)}%
        </Text>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: '#E5E5EA',
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000000',
    letterSpacing: -0.2,
  },
  removeIcon: {
    marginLeft: 6,
  },
  confidence: {
    fontSize: 11,
    color: '#8E8E93',
    marginLeft: 4,
    fontWeight: '600',
  },
});