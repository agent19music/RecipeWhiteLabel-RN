import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Dimensions } from 'react-native';
import { theme, useTheme } from '../../theme';
import ModernButton from '../../components/ModernButton';
import ModernProgress from '../../components/ModernProgress';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { track } from '../../utils/analytics';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function OnboardingStart(){
  const { palette } = useTheme();
  const router = useRouter();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Staggered entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous rotation for decorative element
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const handleStart = () => {
    track('onboarding_started', {});
    router.push('/onboarding/diet');
  };

  const handleSkip = () => {
    track('onboarding_skipped', {});
    router.replace('/(tabs)');
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: palette.bg }]} edges={['top', 'bottom']}>
      {/* Decorative background element */}
      <Animated.View 
        style={[
          styles.backgroundDecoration,
          {
            transform: [{ rotate: spin }],
            opacity: 0.03,
          }
        ]}
      >
        <MaterialCommunityIcons 
          name="chef-hat" 
          size={width * 0.8} 
          color={palette.primary} 
        />
      </Animated.View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <ModernProgress total={7} current={1} showLabel={true} />
        </Animated.View>

        <View style={styles.content}>
          {/* Hero Section */}
          <Animated.View 
            style={[
              styles.heroSection,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim },
                ],
              }
            ]}
          >
            <View style={[styles.iconContainer, { backgroundColor: palette.primary }]}>
              <MaterialCommunityIcons 
                name="chef-hat" 
                size={60} 
                color={palette.primary === '#000000' ? '#FFFFFF' : '#000000'} 
              />
            </View>
            
            <Text style={[styles.title, { color: palette.text }]} accessibilityRole="header">
              Welcome to{' '}
              <Text style={{ fontWeight: '900' }}>Royco Recipe</Text>
            </Text>
            
            <Text style={[styles.subtitle, { color: palette.subtext }]}>
              Your personalized culinary companion
            </Text>
          </Animated.View>

          {/* Feature Cards */}
          <View style={styles.features}>
            {[
              { 
                icon: 'food-apple-outline', 
                title: 'Smart Recipes', 
                desc: 'AI-powered recommendations tailored to your taste',
                delay: 200 
              },
              { 
                icon: 'heart-pulse', 
                title: 'Health Focused', 
                desc: 'Nutritious meals that support your wellness goals',
                delay: 400 
              },
              { 
                icon: 'clock-time-four-outline', 
                title: 'Time Saver', 
                desc: 'Quick and efficient meal planning for busy lifestyles',
                delay: 600 
              },
            ].map((feature, index) => {
              const cardFade = useRef(new Animated.Value(0)).current;
              const cardSlide = useRef(new Animated.Value(30)).current;
              
              useEffect(() => {
                Animated.parallel([
                  Animated.timing(cardFade, {
                    toValue: 1,
                    duration: 600,
                    delay: feature.delay,
                    useNativeDriver: true,
                  }),
                  Animated.spring(cardSlide, {
                    toValue: 0,
                    friction: 8,
                    tension: 40,
                    delay: feature.delay,
                    useNativeDriver: true,
                  }),
                ]).start();
              }, []);

              return (
                <Animated.View
                  key={index}
                  style={[
                    styles.featureCard,
                    {
                      backgroundColor: palette.surface,
                      opacity: cardFade,
                      transform: [{ translateY: cardSlide }],
                    },
                  ]}
                >
                  <View style={[styles.featureIcon, { backgroundColor: palette.primaryMuted }]}>
                    <MaterialCommunityIcons 
                      name={feature.icon as any} 
                      size={24} 
                      color={palette.primary} 
                    />
                  </View>
                  <View style={styles.featureContent}>
                    <Text style={[styles.featureTitle, { color: palette.text }]}>
                      {feature.title}
                    </Text>
                    <Text style={[styles.featureDesc, { color: palette.subtext }]}>
                      {feature.desc}
                    </Text>
                  </View>
                </Animated.View>
              );
            })}
          </View>

          <Animated.View 
            style={[
              styles.timeContainer,
              {
                opacity: fadeAnim,
              }
            ]}
          >
            <View style={[styles.timeBadge, { backgroundColor: palette.primaryMuted }]}>
              <Ionicons name="time-outline" size={16} color={palette.primary} />
              <Text style={[styles.timeEstimate, { color: palette.primary }]}>
                2 minute setup
              </Text>
            </View>
          </Animated.View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <Animated.View 
        style={[
          styles.bottom,
          { 
            backgroundColor: palette.bg,
            opacity: fadeAnim,
          }
        ]}
      >
        <ModernButton 
          title="Get Started" 
          onPress={handleStart}
          variant="primary"
          size="large"
          accessibilityLabel="Start onboarding process"
        />
        <ModernButton 
          title="Skip for now" 
          onPress={handleSkip}
          variant="ghost"
          accessibilityLabel="Skip onboarding and go to app"
        />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    position: 'relative',
  },
  backgroundDecoration: {
    position: 'absolute',
    top: height * 0.1,
    left: -width * 0.2,
    zIndex: -1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.space.lg,
    paddingBottom: 160,
  },
  header: {
    paddingTop: theme.space.lg,
    paddingBottom: theme.space.xxl,
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: theme.space.xxl,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.space.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 15,
  },
  title: {
    fontSize: theme.font.h1 + 4,
    fontWeight: '300',
    textAlign: 'center',
    marginBottom: theme.space.sm,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: theme.font.body + 2,
    textAlign: 'center',
    marginBottom: theme.space.xl,
    opacity: 0.7,
    letterSpacing: 0.3,
  },
  features: {
    width: '100%',
    gap: theme.space.md,
    marginBottom: theme.space.xl,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.space.lg,
    borderRadius: theme.radius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.space.md,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: theme.font.body,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  featureDesc: {
    fontSize: theme.font.small,
    lineHeight: theme.font.small * 1.4,
    opacity: 0.8,
  },
  timeContainer: {
    alignItems: 'center',
    marginTop: theme.space.md,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.space.md,
    paddingVertical: theme.space.xs,
    borderRadius: theme.radius.xl,
    gap: 6,
  },
  timeEstimate: {
    fontSize: theme.font.small,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  bottom: { 
    position: 'absolute', 
    left: theme.space.lg, 
    right: theme.space.lg, 
    bottom: theme.space.xl,
    gap: theme.space.sm,
  },
});

