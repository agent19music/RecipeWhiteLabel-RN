import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppleProgressIndicator from '../../components/AppleProgressIndicator';
import Chip from '../../components/Chip';
import ModernButton from '../../components/ModernButton';
import { useAppState } from '../../context/AppState';
import { theme, useTheme } from '../../theme';
import { track } from '../../utils/analytics';

const commonAllergies = ['peanuts', 'shellfish', 'eggs', 'milk', 'soy', 'gluten', 'sesame'];

export default function AllergiesScreen(){
  const { palette } = useTheme();
  const { prefs, setPrefs } = useAppState();
  const [selected, setSelected] = useState<Set<string>>(new Set(prefs.allergies ?? []));
  const [custom, setCustom] = useState('');
  const router = useRouter();
  
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

  const toggle = (k: string) => {
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
    const items = Array.from(selected);
    if (custom.trim()) {
      custom.split(',').map(s => s.trim()).filter(Boolean).forEach(v => items.push(v));
    }
    setPrefs((p) => ({ ...p, allergies: items }));
    track('onboarding_step_complete', { step: 3, allergies: items });
    router.push('/onboarding/goals');
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
            Allergies & Dietary Restrictions
          </Text>
          <Text style={[styles.subtitle, { color: palette.subtext }]}>
            Help us keep you safe by selecting any allergies or foods to avoid.
          </Text>
        </Animated.View>

        <Animated.View 
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Text style={[styles.sectionTitle, { color: palette.text }]}>
            Common Allergies
          </Text>
          
          <View style={styles.chipGrid}>
            {commonAllergies.map(allergy => (
              <Chip 
                key={allergy} 
                label={allergy} 
                selected={selected.has(allergy)} 
                onToggle={() => toggle(allergy)} 
                accessibilityLabel={`Allergy ${allergy}`} 
              />
            ))}
          </View>
        </Animated.View>

        <Animated.View 
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Text style={[styles.sectionTitle, { color: palette.text }]}>
            Other Allergies
          </Text>
          <Text style={[styles.sectionSubtitle, { color: palette.subtext }]}>
            Add any other allergies (comma-separated)
          </Text>
          
          <TextInput
            value={custom}
            onChangeText={setCustom}
            placeholder="e.g., coriander, nuts"
            placeholderTextColor={palette.subtext}
            style={[
              styles.textInput,
              {
                borderColor: palette.border,
                color: palette.text,
                backgroundColor: palette.surface,
              }
            ]}
            accessibilityLabel="Other allergies input"
          />
        </Animated.View>
      </ScrollView>

      {/* Bottom Section */}
      <View style={styles.bottom}>
        <AppleProgressIndicator total={7} current={2} />
        
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
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.space.sm,
    marginTop: theme.space.sm,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: theme.radius.md,
    padding: theme.space.md,
    fontSize: 16,
    marginTop: theme.space.sm,
  },
  bottom: {
    paddingHorizontal: theme.space.xl,
    paddingBottom: theme.space.lg,
  },
  actions: {
    marginTop: theme.space.lg,
  },
});

