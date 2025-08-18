import React from 'react';
import { View, ViewStyle, StyleSheet, Platform, AccessibilityInfo } from 'react-native';
import { BlurView } from 'expo-blur';
import { theme } from '../theme';

interface GlassViewProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  intensity?: 'light' | 'medium' | 'heavy' | 'max';
  tint?: 'light' | 'dark' | 'default';
  borderless?: boolean;
  shadowLevel?: 'light' | 'medium' | 'heavy' | 'none';
  animated?: boolean;
}

export const GlassView: React.FC<GlassViewProps> = ({
  children,
  style,
  intensity = 'medium',
  tint = 'light',
  borderless = false,
  shadowLevel = 'medium',
  animated = false
}) => {
  const [reduceTransparency, setReduceTransparency] = React.useState(false);

  React.useEffect(() => {
    // Check accessibility settings
    AccessibilityInfo.isReduceTransparencyEnabled().then(setReduceTransparency);
    
    const subscription = AccessibilityInfo.addEventListener(
      'reduceTransparencyChanged',
      setReduceTransparency
    );
    
    return () => subscription?.remove();
  }, []);

  const blurIntensity = theme.glass.blur[intensity];
  const glassBackground = tint === 'dark' 
    ? theme.glass.background.dark 
    : theme.glass.background[intensity];
  const borderColor = borderless ? 'transparent' : theme.glass.border[tint === 'dark' ? 'dark' : 'medium'];
  const shadow = shadowLevel !== 'none' ? theme.glass.shadow[shadowLevel] : {};

  // Fallback for reduced transparency
  if (reduceTransparency) {
    return (
      <View 
        style={[
          styles.fallbackContainer,
          shadow,
          style,
          {
            backgroundColor: tint === 'dark' ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.95)',
            borderColor: borderColor,
            borderWidth: borderless ? 0 : 1,
          }
        ]}
      >
        {children}
      </View>
    );
  }

  return (
    <View style={[styles.container, shadow, style]}>
      <BlurView 
        intensity={blurIntensity} 
        tint={tint}
        style={StyleSheet.absoluteFillObject}
      />
      <View 
        style={[
          StyleSheet.absoluteFillObject,
          {
            backgroundColor: glassBackground,
            borderRadius: theme.radius.md,
            borderWidth: borderless ? 0 : 1,
            borderColor: borderColor,
          }
        ]}
        pointerEvents="none"
      />
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

// Preset glass components for common use cases
export const GlassCard: React.FC<GlassViewProps> = (props) => (
  <GlassView 
    {...props} 
    style={[styles.card, props.style]}
    shadowLevel={props.shadowLevel || 'medium'}
  />
);

export const GlassHeader: React.FC<GlassViewProps> = (props) => (
  <GlassView 
    {...props} 
    style={[styles.header, props.style]}
    intensity="heavy"
    borderless
    shadowLevel="none"
  />
);

export const GlassButton: React.FC<GlassViewProps> = (props) => (
  <GlassView 
    {...props} 
    style={[styles.button, props.style]}
    intensity="light"
    shadowLevel="light"
  />
);

export const GlassChip: React.FC<GlassViewProps> = (props) => (
  <GlassView 
    {...props} 
    style={[styles.chip, props.style]}
    intensity="light"
    shadowLevel="none"
  />
);

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.radius.md,
    overflow: 'hidden',
  },
  fallbackContainer: {
    borderRadius: theme.radius.md,
    padding: theme.space.md,
  },
  content: {
    padding: theme.space.md,
  },
  card: {
    borderRadius: theme.radius.lg,
    marginVertical: theme.space.xs,
  },
  header: {
    borderRadius: 0,
    paddingHorizontal: theme.space.lg,
    paddingVertical: theme.space.md,
  },
  button: {
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.space.md,
    paddingVertical: theme.space.sm,
  },
  chip: {
    borderRadius: theme.radius.xxl,
    paddingHorizontal: theme.space.sm,
    paddingVertical: theme.space.xs / 2,
  },
});

export default GlassView;
