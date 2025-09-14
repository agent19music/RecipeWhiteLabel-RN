import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppleProgressIndicator from '../../components/AppleProgressIndicator';
import ModernButton from '../../components/ModernButton';
import { useAppState } from '../../context/AppState';
import { Goal } from '../../data/types';
import { theme, useTheme } from '../../theme';
import { track } from '../../utils/analytics';

const goals: { key: Goal; title: string; desc: string; icon: string }[] = [
  { key: 'weight_loss', title: 'Weight Management', desc: 'Healthy weight goals', icon: 'scale-balance' },
  { key: 'muscle_gain', title: 'Build Muscle', desc: 'Protein-rich nutrition', icon: 'dumbbell' },
  { key: 'heart_health', title: 'Heart Health', desc: 'Cardiovascular wellness', icon: 'heart-pulse' },
  { key: 'diabetes_management', title: 'Diabetes Support', desc: 'Blood sugar friendly', icon: 'medical-bag' },
  { key: 'general_health', title: 'General Health', desc: 'Overall wellness', icon: 'leaf' },
];

export default function GoalsScreen(){
  const { palette } = useTheme();
  const router = useRouter();
  const { prefs, setPrefs } = useAppState();
  const [selected, setSelected] = useState(new Set(prefs.goals as Goal[] || []));
  
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

  const toggle = (k: Goal) => {
    setSelected(prev => {
      const n = new Set(prev);
      if (n.has(k)) {
        n.delete(k);
      } else {
        n.add(k);
      }
      return n;
    });
  };
  
  const next = () => {
    const goalsArr = Array.from(selected);
    setPrefs(p => ({ ...p, goals: goalsArr }));
    track('onboarding_step_complete', { step: 4, goals: goalsArr });
    router.push('/onboarding/units');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: palette.bg }]} edges={['top', 'bottom']}>
      <ScrollView 
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
          <Text style={[styles.title, { color: palette.text }]}>
            What brings you here?
          </Text>
          <Text style={[styles.subtitle, { color: palette.subtext }]}>
            Select your cooking goals so we can personalize your experience.
          </Text>
        </Animated.View>

        <Animated.View 
          style={[
            styles.goalsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          {goals.map((goal) => (
            <Pressable 
              key={goal.key} 
              onPress={() => toggle(goal.key)}
              style={[
                styles.goalCard,
                {
                  backgroundColor: selected.has(goal.key) ? palette.primary : palette.surface,
                  borderColor: selected.has(goal.key) ? palette.primary : 'transparent',
                }
              ]}
            >
              <View style={[
                styles.goalIcon,
                { backgroundColor: selected.has(goal.key) ? '#FFFFFF20' : `${palette.primary}15` }
              ]}>
                <MaterialCommunityIcons 
                  name={goal.icon as any}
                  size={24}
                  color={selected.has(goal.key) ? '#FFFFFF' : palette.primary}
                />
              </View>
              
              <View style={styles.goalContent}>
                <Text style={[
                  styles.goalTitle,
                  { 
                    color: selected.has(goal.key) ? '#FFFFFF' : palette.text,
                    fontWeight: selected.has(goal.key) ? '600' : '500',
                  }
                ]}>
                  {goal.title}
                </Text>
                <Text style={[
                  styles.goalDesc,
                  { 
                    color: selected.has(goal.key) ? '#FFFFFF90' : palette.subtext,
                  }
                ]}>
                  {goal.desc}
                </Text>
              </View>

              {selected.has(goal.key) && (
                <MaterialCommunityIcons 
                  name="check-circle"
                  size={20}
                  color="#FFFFFF"
                />
              )}
            </Pressable>
          ))}
        </Animated.View>
      </ScrollView>

      {/* Bottom Section */}
      <View style={styles.bottom}>
        <AppleProgressIndicator total={7} current={3} />
        
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
  scrollContent: {
    paddingHorizontal: theme.space.xl,
    paddingTop: theme.space.xl,
    paddingBottom: theme.space.xxl,
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
  goalsContainer: {
    gap: theme.space.md,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.space.lg,
    borderRadius: theme.radius.lg,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  goalIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.space.md,
  },
  goalContent: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  goalDesc: {
    fontSize: 14,
    lineHeight: 18,
  },
  bottom: {
    paddingHorizontal: theme.space.xl,
    paddingBottom: theme.space.lg,
  },
  actions: {
    marginTop: theme.space.lg,
  },
});