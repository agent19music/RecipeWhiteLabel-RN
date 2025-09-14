import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppleProgressIndicator from '../../components/AppleProgressIndicator';
import ModernButton from '../../components/ModernButton';
import { useAppState } from '../../context/AppState';
import { theme, useTheme } from '../../theme';
import { track } from '../../utils/analytics';

export default function BudgetHouseholdScreen(){
  const { palette } = useTheme();
  const router = useRouter();
  const { prefs, setPrefs } = useAppState();
  const [house, setHouse] = React.useState(prefs.householdSize ?? 2);
  const [budget, setBudget] = React.useState(prefs.weeklyBudgetKES ?? 3000);
  
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

  const incrementHouse = () => setHouse(h => Math.min(8, h + 1));
  const decrementHouse = () => setHouse(h => Math.max(1, h - 1));

  const next = () => {
    setPrefs(p => ({ ...p, householdSize: house, weeklyBudgetKES: budget }));
    track('onboarding_step_complete', { step: 6, householdSize: house, weeklyBudgetKES: budget });
    router.push('/onboarding/summary');
  };

  const budgetOptions = [500, 1500, 3000, 5000, 8000, 12000, 15000];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: palette.bg }]} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Text style={[styles.title, { color: palette.text }]}>
            Household & Budget
          </Text>
          <Text style={[styles.subtitle, { color: palette.subtext }]}>
            Help us recommend the right portion sizes and budget-friendly recipes.
          </Text>
        </Animated.View>

        <Animated.View 
          style={[
            styles.sections,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          {/* Household Size */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: palette.text }]}>
              Household Size
            </Text>
            <View style={[styles.counterContainer, { backgroundColor: palette.surface }]}>
              <Pressable 
                onPress={decrementHouse}
                style={[styles.counterButton, { opacity: house <= 1 ? 0.3 : 1 }]}
                disabled={house <= 1}
              >
                <MaterialCommunityIcons name="minus" size={20} color={palette.primary} />
              </Pressable>
              
              <View style={styles.counterValue}>
                <Text style={[styles.counterText, { color: palette.text }]}>
                  {house}
                </Text>
                <Text style={[styles.counterLabel, { color: palette.subtext }]}>
                  {house === 1 ? 'person' : 'people'}
                </Text>
              </View>
              
              <Pressable 
                onPress={incrementHouse}
                style={[styles.counterButton, { opacity: house >= 8 ? 0.3 : 1 }]}
                disabled={house >= 8}
              >
                <MaterialCommunityIcons name="plus" size={20} color={palette.primary} />
              </Pressable>
            </View>
          </View>

          {/* Weekly Budget */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: palette.text }]}>
              Weekly Budget
            </Text>
            <Text style={[styles.sectionSubtitle, { color: palette.subtext }]}>
              Choose your preferred weekly grocery budget
            </Text>
            
            <View style={styles.budgetGrid}>
              {budgetOptions.map(value => (
                <Pressable 
                  key={value}
                  onPress={() => setBudget(value)}
                  style={[
                    styles.budgetOption,
                    { 
                      backgroundColor: budget === value ? palette.primary : palette.surface,
                      borderColor: budget === value ? palette.primary : 'transparent',
                    }
                  ]}
                >
                  <Text style={[
                    styles.budgetText,
                    { 
                      color: budget === value ? '#FFFFFF' : palette.text,
                      fontWeight: budget === value ? '600' : '500',
                    }
                  ]}>
                    KES {value.toLocaleString()}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </Animated.View>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottom}>
        <AppleProgressIndicator total={7} current={5} />
        
        <Animated.View 
          style={[
            styles.actions,
            { opacity: fadeAnim }
          ]}
        >
          <ModernButton 
            title="Continue" 
            onPress={next}
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
  content: {
    flex: 1,
    paddingHorizontal: theme.space.xl,
    paddingTop: theme.space.xl,
  },
  header: {
    marginBottom: theme.space.xxl,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: theme.space.sm,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 17,
    lineHeight: 24,
    opacity: 0.8,
  },
  sections: {
    flex: 1,
  },
  section: {
    marginBottom: theme.space.xxl,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: theme.space.xs,
  },
  sectionSubtitle: {
    fontSize: 15,
    opacity: 0.7,
    marginBottom: theme.space.lg,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.space.md,
    borderRadius: theme.radius.lg,
    marginTop: theme.space.sm,
  },
  counterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterValue: {
    flex: 1,
    alignItems: 'center',
  },
  counterText: {
    fontSize: 32,
    fontWeight: '700',
  },
  counterLabel: {
    fontSize: 14,
    marginTop: 2,
  },
  budgetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.space.sm,
  },
  budgetOption: {
    paddingVertical: theme.space.md,
    paddingHorizontal: theme.space.lg,
    borderRadius: theme.radius.md,
    borderWidth: 2,
    minWidth: '30%',
    alignItems: 'center',
  },
  budgetText: {
    fontSize: 16,
  },
  bottom: {
    paddingHorizontal: theme.space.xl,
    paddingBottom: theme.space.lg,
  },
  actions: {
    marginTop: theme.space.lg,
  },
});

