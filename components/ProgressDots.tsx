import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { theme, useTheme } from '../theme';

export default function ProgressDots({ total, index }: { total: number; index: number }) {
  const { palette } = useTheme();
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: index, duration: 250, useNativeDriver: false }).start();
  }, [index]);

  return (
    <View style={styles.row} accessibilityRole="progressbar" accessibilityValue={{ now: index + 1, min: 1, max: total }}>
      {Array.from({ length: total }).map((_, i) => {
        const active = i === index;
        return <View key={i} style={[styles.dot, { backgroundColor: active ? palette.primary : palette.border }]} />;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: theme.space.xs, alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4 }
});

