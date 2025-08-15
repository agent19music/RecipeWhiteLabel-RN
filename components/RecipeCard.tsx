import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { theme, useTheme } from '../theme';

export default function RecipeCard({ title, minutes, likes, by }: { title: string; minutes: number; likes?: number; by?: string }) {
  const { palette } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}
      accessibilityRole="summary" accessibilityLabel={`${title}, ${minutes} minutes`}>
      <View style={[styles.hero, { backgroundColor: palette.primaryMuted }]} />
      <Text style={[styles.title, { color: palette.text }]} numberOfLines={2}>{title}</Text>
      <Text style={{ color: palette.subtext, marginTop: 4 }}>{minutes} min • {likes ?? 0} likes {by ? `• by ${by}` : ''}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: theme.radius.md, padding: theme.space.md, width: 180, marginRight: theme.space.md },
  hero: { width: '100%', height: 90, borderRadius: theme.radius.sm, marginBottom: theme.space.sm },
  title: { fontSize: theme.font.body, fontWeight: '700' }
});

