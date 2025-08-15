import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { theme, useTheme } from '../theme';

export default function SectionHeader({ title, sub }:{ title: string; sub?: string }){
  const { palette } = useTheme();
  return (
    <View style={styles.wrap}>
      <Text accessibilityRole="header" style={[styles.title, { color: palette.text }]}>{title}</Text>
      {sub ? <Text style={[styles.sub, { color: palette.subtext }]}>{sub}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: theme.space.md },
  title: { fontSize: theme.font.h2, fontWeight: '700' },
  sub: { marginTop: 4, fontSize: theme.font.body }
});

