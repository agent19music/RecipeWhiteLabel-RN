import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme, useTheme } from '../theme';
import Button from './Button';

export default function ChallengeCard({ title, endsInDays, entries, onJoin }:{ title: string; endsInDays: number; entries: number; onJoin?: () => void }){
  const { palette } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}
      accessibilityRole="summary" accessibilityLabel={`${title}, ends in ${endsInDays} days, ${entries} entries`}>
      <View style={[styles.banner, { backgroundColor: palette.primaryMuted }]} />
      <Text style={[styles.title, { color: palette.text }]}>{title}</Text>
      <Text style={{ color: palette.subtext, marginVertical: 4 }}>Ends in {endsInDays} days • {entries} entries</Text>
      <Button title="Join" onPress={() => onJoin?.()} accessibilityLabel={`Join ${title}`} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: theme.radius.md, padding: theme.space.md, width: 260, marginRight: theme.space.md },
  banner: { width: '100%', height: 80, borderRadius: theme.radius.sm, marginBottom: theme.space.sm },
  title: { fontSize: theme.font.body, fontWeight: '700' }
});

