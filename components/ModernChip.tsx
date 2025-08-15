import React, { useRef, useEffect } from 'react';
import { 
  Pressable, 
  Text, 
  StyleSheet, 
  ViewStyle, 
  Animated 
} from 'react-native';
import { useTheme, theme } from '../theme';

interface Props {
  label: string;
  selected?: boolean;
  onToggle?: () => void;
  style?: ViewStyle;
  accessibilityLabel?: string;
  icon?: string;
}

export default function ModernChip({ 
  label, 
  selected, 
  onToggle, 
  style, 
  accessibilityLabel,
  icon 
}: Props) {
  const { palette } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const backgroundAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(backgroundAnim, {
      toValue: selected ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [selected]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      friction: 8,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 6,
    }).start();
  };

  const animatedBackgroundColor = backgroundAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [palette.surface, palette.primary],
  });

  return (
    <Animated.View 
      style={[
        { transform: [{ scale: scaleAnim }] },
        style
      ]}
    >
      <Pressable
        onPress={onToggle}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || label}
      >
        <Animated.View 
          style={[
            styles.base,
            {
              backgroundColor: animatedBackgroundColor,
              borderColor: selected ? palette.primary : palette.border,
              borderWidth: selected ? 0 : 1,
            }
          ]}
        >
          {icon && (
            <Text style={[
              styles.icon, 
              { color: selected ? (palette.primary === '#000000' ? '#FFFFFF' : '#000000') : palette.text }
            ]}>
              {icon}
            </Text>
          )}
          <Text 
            style={[
              styles.text, 
              { 
                color: selected ? (palette.primary === '#000000' ? '#FFFFFF' : '#000000') : palette.text,
                fontWeight: selected ? '600' : '500'
              }
            ]}
          >
            {label}
          </Text>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.space.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  text: { 
    fontSize: 15,
    letterSpacing: 0.3,
  },
  icon: {
    fontSize: 18,
  }
});
