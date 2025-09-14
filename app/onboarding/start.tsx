import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppleProgressIndicator from '../../components/AppleProgressIndicator';
import ModernButton from '../../components/ModernButton';
import { theme, useTheme } from '../../theme';
import { track } from '../../utils/analytics';





const { width, height } = Dimensions.get('window');

export default function OnboardingStart(){
  const { palette } = useTheme();
  const router = useRouter();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, scaleAnim]);

  const handleStart = () => {
    track('onboarding_started', {});
    router.push('/onboarding/diet');
  };

  const handleSkip = () => {
    track('onboarding_skipped', {});
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: palette.bg }]} edges={['top', 'bottom']}>
      <View style={styles.content}>
        {/* Main Content */}
        <Animated.View 
          style={[
            styles.hero,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim },
              ],
            }
          ]}
        >
          {/* App Icon */}
          <View style={[styles.iconContainer, { backgroundColor: palette.primary }]}>
            <MaterialCommunityIcons 
              name="chef-hat" 
              size={48} 
              color="#FFFFFF" 
            />
          </View>
          
          {/* Title */}
          <Text style={[styles.title, { color: palette.text }]}>
            Welcome to Royco Recipe
          </Text>
          
          {/* Subtitle */}
          <Text style={[styles.subtitle, { color: palette.subtext }]}>
            Your personalized culinary companion for healthy, delicious meals tailored to your lifestyle.
          </Text>
        </Animated.View>

        {/* Features */}
        <Animated.View 
          style={[
            styles.features,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <View style={styles.feature}>
            <View style={[styles.featureIcon, { backgroundColor: `${palette.primary}15` }]}>
              <MaterialCommunityIcons name="food-apple" size={20} color={palette.primary} />
            </View>
            <Text style={[styles.featureText, { color: palette.text }]}>Smart personalized recipes</Text>
          </View>
          
          <View style={styles.feature}>
            <View style={[styles.featureIcon, { backgroundColor: `${palette.primary}15` }]}>
              <MaterialCommunityIcons name="heart-pulse" size={20} color={palette.primary} />
            </View>
            <Text style={[styles.featureText, { color: palette.text }]}>Health-focused nutrition</Text>
          </View>
          
          <View style={styles.feature}>
            <View style={[styles.featureIcon, { backgroundColor: `${palette.primary}15` }]}>
              <MaterialCommunityIcons name="clock-time-four" size={20} color={palette.primary} />
            </View>
            <Text style={[styles.featureText, { color: palette.text }]}>Quick meal planning</Text>
          </View>
        </Animated.View>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottom}>
        {/* Progress Indicator */}
        <AppleProgressIndicator total={7} current={0} />
        
        {/* Action Buttons */}
        <Animated.View 
          style={[
            styles.actions,
            { opacity: fadeAnim }
          ]}
        >
          <ModernButton 
            title="Get Started" 
            onPress={handleStart}
            variant="primary"
            size="large"
          />
          <ModernButton 
            title="Skip for now" 
            onPress={handleSkip}
            variant="ghost"
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.space.xl,
    justifyContent: 'center',
  },
  hero: {
    alignItems: 'center',
    marginBottom: theme.space.xxl,
  },
  iconContainer: {
    width: 88,
    height: 88,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.space.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: theme.space.md,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
    opacity: 0.8,
    paddingHorizontal: theme.space.sm,
  },
  features: {
    gap: theme.space.lg,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.space.sm,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.space.md,
  },
  featureText: {
    fontSize: 16,
    fontWeight: '500',
  },
  bottom: {
    paddingHorizontal: theme.space.xl,
    paddingBottom: theme.space.lg,
  },
  actions: {
    gap: theme.space.sm,
    marginTop: theme.space.lg,
  },
});