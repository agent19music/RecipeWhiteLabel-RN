import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme, theme } from '../theme';

export default function Card({ children, style }: { children: React.ReactNode; style?: any }) {
  const { palette } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: palette.card, shadowColor: palette.text + '20', borderColor: palette.border }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.radius.lg,
    padding: theme.space.lg,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1
  }
});

