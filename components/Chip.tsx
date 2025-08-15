import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme, theme } from '../theme';

interface Props {
  label: string;
  selected?: boolean;
  onToggle?: () => void;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

export default function Chip({ label, selected, onToggle, style, accessibilityLabel }: Props) {
  const { palette } = useTheme();
  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: selected ? palette.primaryMuted : 'transparent',
          borderColor: selected ? palette.primary : palette.border
        },
        pressed && { opacity: 0.9 },
        style
      ]}
    >
      <Text style={[styles.text, { color: selected ? palette.primary : palette.text }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 44,
    borderRadius: 999,
    paddingHorizontal: theme.space.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginRight: theme.space.sm,
    marginBottom: theme.space.sm
  },
  text: { fontSize: 16 }
});

