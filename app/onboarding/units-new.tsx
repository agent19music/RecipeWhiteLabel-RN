import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppleProgressIndicator from '../../components/AppleProgressIndicator';
import ModernButton from '../../components/ModernButton';
import { useAppState } from '../../context/AppState';
import { theme, useTheme } from '../../theme';
import { track } from '../../utils/analytics';

export default function UnitsScreen(){
  const { palette } = useTheme();
  const router = useRouter();
  const { prefs, setPrefs } = useAppState();
  const [selected, setSelected] = useState(prefs.unitSystem || 'metric');
  
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

  const next = () => {
    setPrefs((p) => ({ ...p, unitSystem: selected as any }));
    track('onboarding_step_complete', { step: 5, unitSystem: selected });
    router.push('/onboarding/budget');
  };

  const unitOptions = [
    {
      key: 'metric',
      title: 'Metric',
      desc: 'Grams, milliliters, Celsius',
      icon: 'scale-balance',
    },
    {
      key: 'imperial',
      title: 'Imperial',
      desc: 'Cups, ounces, Fahrenheit',
      icon: 'cup',
    },
  ];

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
            Measurement System
          </Text>
          <Text style={[styles.subtitle, { color: palette.subtext }]}>
            Choose your preferred measurement units for recipes.
          </Text>
        </Animated.View>

        <Animated.View 
          style={[
            styles.options,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          {unitOptions.map((option) => (
            <Pressable 
              key={option.key} 
              onPress={() => setSelected(option.key)}
              style={[
                styles.optionCard,
                {
                  backgroundColor: selected === option.key ? palette.primary : palette.surface,
                  borderColor: selected === option.key ? palette.primary : 'transparent',
                }
              ]}
            >
              <View style={[
                styles.optionIcon,
                { backgroundColor: selected === option.key ? '#FFFFFF20' : `${palette.primary}15` }
              ]}>
                <MaterialCommunityIcons 
                  name={option.icon as any}
                  size={24}
                  color={selected === option.key ? '#FFFFFF' : palette.primary}
                />
              </View>
              
              <View style={styles.optionContent}>
                <Text style={[
                  styles.optionTitle,
                  { 
                    color: selected === option.key ? '#FFFFFF' : palette.text,
                    fontWeight: selected === option.key ? '600' : '500',
                  }
                ]}>
                  {option.title}
                </Text>
                <Text style={[
                  styles.optionDesc,
                  { 
                    color: selected === option.key ? '#FFFFFF90' : palette.subtext,
                  }
                ]}>
                  {option.desc}
                </Text>
              </View>

              {selected === option.key && (
                <MaterialCommunityIcons 
                  name="check-circle"
                  size={20}
                  color="#FFFFFF"
                />
              )}
            </Pressable>
          ))}
        </Animated.View>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottom}>
        <AppleProgressIndicator total={7} current={4} />
        
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
    justifyContent: 'center',
  },
  header: {
    marginBottom: theme.space.xxl,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: theme.space.sm,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 17,
    lineHeight: 24,
    opacity: 0.8,
    textAlign: 'center',
    paddingHorizontal: theme.space.sm,
  },
  options: {
    gap: theme.space.md,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.space.xl,
    borderRadius: theme.radius.lg,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  optionIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.space.lg,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    marginBottom: 6,
  },
  optionDesc: {
    fontSize: 15,
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
