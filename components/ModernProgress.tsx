import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Text } from 'react-native';
import { useTheme, theme } from '../theme';

interface Props {
  total: number;
  current: number;
  showLabel?: boolean;
}

export default function ModernProgress({ total, current, showLabel = false }: Props) {
  const { palette } = useTheme();
  const progressAnim = useRef(new Animated.Value(0)).current;
  const percentage = (current / total) * 100;

  useEffect(() => {
    Animated.spring(progressAnim, {
      toValue: percentage,
      useNativeDriver: false,
      friction: 7,
      tension: 20,
    }).start();
  }, [current, total]);

  return (
    <View style={styles.container}>
      {showLabel && (
        <View style={styles.labelContainer}>
          <Text style={[styles.label, { color: palette.subtext }]}>
            Step {current} of {total}
          </Text>
          <Text style={[styles.percentage, { color: palette.text }]}>
            {Math.round(percentage)}%
          </Text>
        </View>
      )}
      <View style={[styles.track, { backgroundColor: palette.primaryMuted }]}>
        <Animated.View
          style={[
            styles.progress,
            {
              backgroundColor: palette.primary,
              width: progressAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.space.xs,
  },
  label: {
    fontSize: theme.font.small,
    fontWeight: '500',
  },
  percentage: {
    fontSize: theme.font.small,
    fontWeight: '600',
  },
  track: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    borderRadius: 2,
  },
});
