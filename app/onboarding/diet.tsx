import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppleProgressIndicator from '../../components/AppleProgressIndicator';
import ModernButton from '../../components/ModernButton';
import ModernChip from '../../components/ModernChip';
import { useAppState } from '../../context/AppState';
import { Diet } from '../../data/types'; // TODO: fix this
import { theme, useTheme } from '../../theme';
import { track } from '../../utils/analytics';

const { width } = Dimensions.get('window');

const dietOptions: { key: Diet; label: string; icon: string; description: string }[] = [
  { key: 'omnivore', label: 'Omnivore', icon: '🍽️', description: 'No dietary restrictions' },
  { key: 'vegetarian', label: 'Vegetarian', icon: '🥗', description: 'No meat or fish' },
  { key: 'vegan', label: 'Vegan', icon: '🌱', description: 'No animal products' },
  { key: 'pescatarian', label: 'Pescatarian', icon: '🐟', description: 'Fish but no meat' },
  { key: 'halal', label: 'Halal', icon: '☪️', description: 'Following Islamic law' },
  { key: 'kosher', label: 'Kosher', icon: '✡️', description: 'Following Jewish law' },
  { key: 'gluten_free', label: 'Gluten-Free', icon: '🌾', description: 'No gluten proteins' },
  { key: 'lactose_free', label: 'Dairy-Free', icon: '🥛', description: 'No dairy products' },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.space.lg,
    paddingBottom: 160,
  },
  header: {
    paddingTop: theme.space.lg,
    marginBottom: theme.space.xl,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.space.xl,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    width: 40,
  },
  progressBar: {
    width: '70%',
  },
  title: {
    fontSize: theme.font.h1,
    fontWeight: '700',
    marginBottom: theme.space.xs,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: theme.font.body + 1,
    opacity: 0.7,
  },
  optionsContainer: {
    width: '100%',
  },
  optionCard: {
    marginBottom: theme.space.md,
  },
  chip: {
    width: '100%',
    marginBottom: theme.space.xs,
  },
  optionDesc: {
    fontSize: theme.font.small,
    marginLeft: theme.space.md,
    opacity: 0.6,
  },
  selectionInfo: {
    alignItems: 'center',
    marginTop: theme.space.xl,
  },
  infoBadge: {
    paddingHorizontal: theme.space.md,
    paddingVertical: theme.space.xs,
    borderRadius: theme.radius.xl,
  },
  infoText: {
    fontSize: theme.font.small,
    fontWeight: '600',
  },
  bottom: {
    position: 'absolute',
    left: theme.space.lg,
    right: theme.space.lg,
    bottom: theme.space.xl,
    gap: theme.space.sm,
  },
  actions: {
    gap: theme.space.sm,
    marginTop: theme.space.lg,
  },
});

export default function DietScreen(){
  const { palette } = useTheme();
  const { prefs, setPrefs } = useAppState();
  const [selected, setSelected] = useState<Set<Diet>>(new Set((prefs.diets as Diet[]) ?? []));
  const router = useRouter();
  
  // Animation values
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
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const toggle = (k: Diet) => {
    setSelected((prev) => {
      const n = new Set(prev);
      if (n.has(k)) n.delete(k); else n.add(k);
      return n;
    });
  };

  const handleNext = () => {
    const diets = Array.from(selected);
    setPrefs((p) => ({ ...p, diets }));
    track('onboarding_step_complete', { step: 2, diets });
    router.push('/onboarding/allergies');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: palette.bg }]} edges={['top', 'bottom']}>
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
          <ModernButton
            title=""
            onPress={handleBack}
            variant="ghost"
            size="small"
            icon={<Ionicons name="arrow-back" size={24} color={palette.text} />}
            style={styles.backButton}
          />
          
          <Text accessibilityRole="header" style={[styles.title, { color: palette.text }]}>
            Dietary Preferences
          </Text>
          <Text style={[styles.subtitle, { color: palette.subtext }]}>
            Select any that apply to you
          </Text>
        </Animated.View>

        <View style={styles.optionsContainer}>
          {dietOptions.map((opt, index) => (
            <Animated.View
              key={opt.key}
              style={[
                styles.optionCard,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <ModernChip 
                label={opt.label}
                icon={opt.icon}
                selected={selected.has(opt.key)} 
                onToggle={() => toggle(opt.key)} 
                accessibilityLabel={`Diet ${opt.label}`}
                style={styles.chip}
              />
              <Text style={[styles.optionDesc, { color: palette.subtext }]}>
                {opt.description}
              </Text>
            </Animated.View>
          ))}
        </View>

        {selected.size > 0 && (
          <Animated.View style={[styles.selectionInfo, { opacity: fadeAnim }]}>
            <View style={[styles.infoBadge, { backgroundColor: palette.primaryMuted }]}>
              <Text style={[styles.infoText, { color: palette.primary }]}>
                {selected.size} preference{selected.size > 1 ? 's' : ''} selected
              </Text>
            </View>
          </Animated.View>
        )}
      </ScrollView>

      <Animated.View 
        style={[
          styles.bottom,
          { 
            backgroundColor: palette.bg,
            opacity: fadeAnim,
          }
        ]}
      >
        <AppleProgressIndicator total={7} current={1} />
        
        <View style={styles.actions}>
          <ModernButton 
            title="Continue" 
            onPress={handleNext}
            variant="primary"
            size="large"
            disabled={selected.size === 0}
            accessibilityLabel="Next to allergies"
          />
          {selected.size === 0 && (
            <ModernButton 
              title="Skip this step" 
              onPress={handleNext}
              variant="ghost"
              accessibilityLabel="Skip dietary preferences"
            />
          )}
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

