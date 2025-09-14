import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppleProgressIndicator from '../../components/AppleProgressIndicator';
import ModernButton from '../../components/ModernButton';
import { useAppState } from '../../context/AppState';
import { useAuth } from '../../context/AuthContext';
import { theme, useTheme } from '../../theme';
import { track } from '../../utils/analytics';
import { UserPreferences } from '../../types/database';
import { Alert } from 'react-native';

export default function SummaryScreen(){
  const { palette } = useTheme();
  const router = useRouter();
  const { prefs, setOnboarded } = useAppState();
  const { user, updatePreferences } = useAuth();
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
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
    ]).start();
  }, [fadeAnim, slideAnim]);

  const finish = async () => {
    track('onboarding_finished', { prefs });
    
    try {
      if (user) {
        // Save preferences to database for authenticated users
        const userPreferences: UserPreferences = {
          diets: prefs.diets || ['omnivore'],
          allergies: prefs.allergies || [],
          goals: prefs.goals || ['general_health'],
          unit_system: (prefs.unitSystem?.toLowerCase() === 'imperial' ? 'imperial' : 'metric') as 'metric' | 'imperial',
          language: 'en',
          theme: 'auto',
          household_size: prefs.householdSize || 2,
          weekly_budget_kes: prefs.weeklyBudgetKES || 3000,
          cooking_skill_level: 'beginner',
          kitchen_equipment: [],
          meal_planning_enabled: true,
          smart_suggestions_enabled: true,
          nutrition_tracking_enabled: false,
          notifications_enabled: true,
          cuisine_preferences: ['Kenyan', 'International'],
          spice_tolerance: 'medium'
        };
        
        await updatePreferences(userPreferences);
      } else {
        // For guests, just mark as onboarded locally
        setOnboarded(true);
      }
      
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Failed to save preferences:', error);
      Alert.alert(
        'Error',
        'Failed to save your preferences. Please try again.',
        [
          { text: 'Try Again', onPress: finish },
          { text: 'Skip', onPress: () => {
            setOnboarded(true);
            router.replace('/(tabs)');
          }}
        ]
      );
    }
  };

  const summaryItems = [
    {
      icon: 'food-apple',
      label: 'Diet Preferences',
      value: (prefs.diets && prefs.diets.length > 0) ? prefs.diets.join(', ') : 'No restrictions',
    },
    {
      icon: 'alert-circle',
      label: 'Allergies',
      value: (prefs.allergies && prefs.allergies.length > 0) ? prefs.allergies.join(', ') : 'None',
    },
    {
      icon: 'target',
      label: 'Goals',
      value: (prefs.goals && prefs.goals.length > 0) ? prefs.goals.join(', ') : 'General wellness',
    },
    {
      icon: 'scale-balance',
      label: 'Measurement Units',
      value: prefs.unitSystem || 'Metric',
    },
    {
      icon: 'home-group',
      label: 'Household Size',
      value: `${prefs.householdSize || 2} ${(prefs.householdSize || 2) === 1 ? 'person' : 'people'}`,
    },
    {
      icon: 'wallet',
      label: 'Weekly Budget',
      value: `KES ${(prefs.weeklyBudgetKES || 3000).toLocaleString()}`,
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: palette.bg }]} edges={['top', 'bottom']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
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
          <View style={[styles.completionIcon, { backgroundColor: palette.primary }]}>
            <MaterialCommunityIcons name="check" size={32} color="#FFFFFF" />
          </View>
          
          <Text style={[styles.title, { color: palette.text }]}>
            You&apos;re All Set!
          </Text>
          <Text style={[styles.subtitle, { color: palette.subtext }]}>
            Here&apos;s a summary of your preferences. You can always change these later in settings.
          </Text>
        </Animated.View>

        <Animated.View 
          style={[
            styles.summaryContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          {summaryItems.map((item, index) => (
            <View key={index} style={[styles.summaryItem, { backgroundColor: palette.surface }]}>
              <View style={[styles.iconContainer, { backgroundColor: `${palette.primary}15` }]}>
                <MaterialCommunityIcons 
                  name={item.icon as any} 
                  size={20} 
                  color={palette.primary} 
                />
              </View>
              
              <View style={styles.itemContent}>
                <Text style={[styles.itemLabel, { color: palette.subtext }]}>
                  {item.label}
                </Text>
                <Text style={[styles.itemValue, { color: palette.text }]}>
                  {item.value}
                </Text>
              </View>
            </View>
          ))}
        </Animated.View>
      </ScrollView>

      {/* Bottom Section */}
      <View style={styles.bottom}>
        <AppleProgressIndicator total={7} current={6} />
        
        <Animated.View 
          style={[
            styles.actions,
            { opacity: fadeAnim }
          ]}
        >
          <ModernButton 
            title="Start Cooking!" 
            onPress={finish}
            variant="primary"
            size="large"
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.space.xl,
    paddingTop: theme.space.xl,
    paddingBottom: theme.space.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.space.xxl,
  },
  completionIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
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
    marginBottom: theme.space.sm,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
    opacity: 0.8,
    paddingHorizontal: theme.space.sm,
  },
  summaryContainer: {
    gap: theme.space.md,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: theme.space.lg,
    borderRadius: theme.radius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.space.md,
  },
  itemContent: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  itemValue: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
  },
  bottom: {
    paddingHorizontal: theme.space.xl,
    paddingBottom: theme.space.lg,
  },
  actions: {
    marginTop: theme.space.lg,
  },
});

