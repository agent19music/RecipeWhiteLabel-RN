import React, { useRef } from 'react';
import {
    Animated,
    GestureResponderEvent,
    Pressable,
    StyleSheet,
    Text,
    TextStyle,
    ViewStyle
} from 'react-native';
import { theme, useTheme } from '../theme';

interface Props {
  title: string;
  onPress: (e: GestureResponderEvent) => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'small' | 'medium' | 'large';
  accessibilityLabel?: string;
  testID?: string;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export default function ModernButton({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'medium',
  accessibilityLabel, 
  testID, 
  disabled,
  style,
  textStyle,
  icon
}: Props) {
  const { palette } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      friction: 8,
      tension: 100,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 6,
      tension: 40,
    }).start();
  };

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.base,
      minHeight: size === 'small' ? 40 : size === 'large' ? 56 : 48,
      paddingHorizontal: size === 'small' ? 16 : size === 'large' ? 28 : 20,
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: palette.primary,
          borderWidth: 0,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: palette.primaryMuted,
          borderWidth: 0,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: palette.primary,
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 0,
        };
      default:
        return baseStyle;
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      ...styles.text,
      fontSize: size === 'small' ? 14 : size === 'large' ? 18 : 16,
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseTextStyle,
          color: palette.primary === '#000000' ? '#FFFFFF' : '#000000',
        };
      case 'secondary':
        return {
          ...baseTextStyle,
          color: palette.text,
        };
      case 'outline':
      case 'ghost':
        return {
          ...baseTextStyle,
          color: palette.text,
        };
      default:
        return baseTextStyle;
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || title}
        testID={testID}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={[
          getButtonStyle(),
          disabled && styles.disabled,
          style
        ]}
      >
        {icon && <>{icon}</>}
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  text: {
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  disabled: {
    opacity: 0.5,
  }
});
