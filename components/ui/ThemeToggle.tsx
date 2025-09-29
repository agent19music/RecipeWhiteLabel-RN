import React, { useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, ThemeMode } from '../../theme';
import * as Haptics from 'expo-haptics';

interface ThemeToggleProps {
  style?: ViewStyle;
  showLabel?: boolean;
  variant?: 'icon' | 'toggle' | 'menu';
  size?: 'sm' | 'md' | 'lg';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  style,
  showLabel = false,
  variant = 'icon',
  size = 'md'
}) => {
  const { palette, isDark, mode, toggle, setMode } = useTheme();
  
  // Animation values
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const colorAnim = useRef(new Animated.Value(isDark ? 1 : 0)).current;

  // Animate when theme changes
  useEffect(() => {
    Animated.parallel([
      Animated.timing(colorAnim, {
        toValue: isDark ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(rotateAnim, {
        toValue: isDark ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isDark, colorAnim, rotateAnim]);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Animate press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    toggle();
  };

  const handleModeSelect = (selectedMode: ThemeMode) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setMode(selectedMode);
  };

  // Interpolated values for smooth animations
  const backgroundColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [palette.card, palette.surface],
  });

  const borderColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [palette.border, palette.border],
  });

  const iconRotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  // Size configurations
  const sizeConfig = {
    sm: { container: 36, icon: 18, text: 12 },
    md: { container: 44, icon: 22, text: 14 },
    lg: { container: 52, icon: 26, text: 16 },
  };

  const currentSize = sizeConfig[size];

  if (variant === 'toggle') {
    return (
      <Animated.View
        style={[
          styles.toggleContainer,
          {
            backgroundColor,
            borderColor,
            height: currentSize.container,
            paddingHorizontal: currentSize.container * 0.3,
          },
          style,
        ]}
      >
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={handlePress}
          activeOpacity={0.8}
        >
          <Animated.View
            style={[
              styles.toggleThumb,
              {
                transform: [
                  { scale: scaleAnim },
                  { rotate: iconRotation }
                ],
                backgroundColor: palette.primary,
              },
            ]}
          >
            <Ionicons
              name={isDark ? 'moon' : 'sunny'}
              size={currentSize.icon * 0.8}
              color="#FFFFFF"
            />
          </Animated.View>
        </TouchableOpacity>
        
        {showLabel && (
          <Text style={[styles.toggleLabel, { color: palette.text, fontSize: currentSize.text }]}>
            {isDark ? 'Dark' : 'Light'} Mode
          </Text>
        )}
      </Animated.View>
    );
  }

  if (variant === 'menu') {
    return (
      <View style={[styles.menuContainer, style]}>
        <Text style={[styles.menuTitle, { color: palette.text }]}>Theme</Text>
        <View style={styles.menuOptions}>
          {(['light', 'dark', 'system'] as ThemeMode[]).map((themeMode) => (
            <TouchableOpacity
              key={themeMode}
              style={[
                styles.menuOption,
                {
                  backgroundColor: mode === themeMode ? palette.primary : palette.card,
                  borderColor: palette.border,
                }
              ]}
              onPress={() => handleModeSelect(themeMode)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={
                  themeMode === 'light' ? 'sunny' :
                  themeMode === 'dark' ? 'moon' : 'phone-portrait'
                }
                size={16}
                color={mode === themeMode ? '#FFFFFF' : palette.text}
              />
              <Text
                style={[
                  styles.menuOptionText,
                  {
                    color: mode === themeMode ? '#FFFFFF' : palette.text,
                    fontSize: currentSize.text,
                  }
                ]}
              >
                {themeMode === 'system' ? 'Auto' : themeMode.charAt(0).toUpperCase() + themeMode.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  // Default icon variant
  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.iconContainer,
        {
          width: currentSize.container,
          height: currentSize.container,
          backgroundColor: palette.card,
          borderColor: palette.border,
        },
        style,
      ]}
      activeOpacity={0.8}
    >
      <Animated.View
        style={{
          transform: [
            { scale: scaleAnim },
            { rotate: iconRotation }
          ],
        }}
      >
        <Ionicons
          name={isDark ? 'moon' : 'sunny'}
          size={currentSize.icon}
          color={palette.text}
        />
      </Animated.View>
      
      {showLabel && (
        <Text style={[styles.iconLabel, { color: palette.subtext, fontSize: currentSize.text }]}>
          {isDark ? 'Dark' : 'Light'}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Icon variant styles
  iconContainer: {
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
  },
  
  // Toggle variant styles
  toggleContainer: {
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  toggleButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleThumb: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleLabel: {
    fontWeight: '600',
    marginLeft: 12,
  },
  
  // Menu variant styles
  menuContainer: {
    padding: 16,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  menuOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  menuOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  menuOptionText: {
    fontWeight: '500',
  },
});

export default ThemeToggle;