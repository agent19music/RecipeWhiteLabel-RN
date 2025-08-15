import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme, useTheme } from '../theme';

export default function IngredientRow({ name, qty, unit }:{ name: string; qty?: number; unit?: string }){
  const { palette } = useTheme();
  return (
    <View style={[styles.row, { borderColor: palette.border }]}
      accessibilityRole="text" accessibilityLabel={`${name}${qty ? ', ' + qty : ''}${unit ? ' ' + unit : ''}`}>
      <Text style={[styles.name, { color: palette.text }]}>{name}</Text>
      <Text style={{ color: palette.subtext }}>{qty ?? ''} {unit ?? ''}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: theme.space.xs, borderBottomWidth: 1 },
  name: { fontSize: theme.font.body }
});

