import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme, useTheme } from '../theme';
import Button from './Button';

export default function EmptyState({ icon = '🍳', title, sub, cta, onPress }:{ icon?: string; title: string; sub?: string; cta?: string; onPress?: () => void }){
  const { palette } = useTheme();
  return (
    <View style={[styles.wrap, { backgroundColor: palette.card, borderColor: palette.border }]}
      accessibilityRole="summary" accessibilityLabel={`${title}${sub ? ', ' + sub : ''}`}>
      <Text style={{ fontSize: 48, marginBottom: theme.space.sm }}>{icon}</Text>
      <Text style={[styles.title, { color: palette.text }]}>{title}</Text>
      {sub ? <Text style={{ color: palette.subtext, textAlign: 'center', marginVertical: theme.space.sm }}>{sub}</Text> : null}
      {cta ? <Button title={cta} onPress={() => onPress?.()} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    padding: theme.space.lg,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: { fontSize: theme.font.h2, fontWeight: '700' }
});

