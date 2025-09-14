import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import { theme, useTheme } from '../theme';

interface Props {
  total: number;
  current: number;
  style?: any;
}

const { width } = Dimensions.get('window');

export default function AppleProgressIndicator({ total, current, style }: Props) {
  const { palette } = useTheme();
  const progressAnim = useRef(new Animated.Value(0)).current;
  const dotScale = useRef(Array.from({ length: total }, () => new Animated.Value(0.8))).current;

  useEffect(() => {
    // Animate progress bar
    Animated.spring(progressAnim, {
      toValue: current,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();

    // Animate dots
    dotScale.forEach((scale, index) => {
      Animated.spring(scale, {
        toValue: index <= current ? 1 : 0.8,
        useNativeDriver: true,
        tension: 200,
        friction: 8,
      }).start();
    });
  }, [current, progressAnim, dotScale]);

  return (
    <View style={[styles.container, style]}>
      {/* Progress bar background */}
      <View style={[styles.track, { backgroundColor: `${palette.primary}20` }]}>
        <Animated.View
          style={[
            styles.progress,
            {
              backgroundColor: palette.primary,
              width: progressAnim.interpolate({
                inputRange: [0, total],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
      
      {/* Progress dots */}
      <View style={styles.dotsContainer}>
        {Array.from({ length: total }).map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: index <= current ? palette.primary : `${palette.primary}30`,
                transform: [{ scale: dotScale[index] }],
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: theme.space.sm,
  },
  track: {
    width: width * 0.6,
    height: 2,
    borderRadius: 1,
    overflow: 'hidden',
    marginBottom: theme.space.sm,
  },
  progress: {
    height: '100%',
    borderRadius: 1,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.space.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
