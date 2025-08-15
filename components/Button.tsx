import React from 'react';
import { Pressable, Text, StyleSheet, View, GestureResponderEvent } from 'react-native';
import { useTheme } from '../theme';

interface Props {
  title: string;
  onPress: (e: GestureResponderEvent) => void;
  variant?: 'primary' | 'ghost';
  accessibilityLabel?: string;
  testID?: string;
  disabled?: boolean;
}

export default function Button({ title, onPress, variant = 'primary', accessibilityLabel, testID, disabled }: Props) {
  const { palette } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      testID={testID}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: variant === 'primary' ? palette.primary : 'transparent', borderColor: palette.border },
        pressed && { opacity: 0.9 },
        disabled && { opacity: 0.5 }
      ]}
    >
      <Text style={[styles.text, { color: variant === 'primary' ? '#fff' : palette.text }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderWidth: 1
  },
  text: {
    fontSize: 16,
    fontWeight: '600'
  }
});

