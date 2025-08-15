import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { theme, useTheme } from '../../theme';
import Button from '../../components/Button';
import ProgressDots from '../../components/ProgressDots';
import { useRouter } from 'expo-router';
import { useAppState } from '../../context/AppState';
import { track } from '../../utils/analytics';

export default function UnitsScreen(){
  const { palette } = useTheme();
  const r = useRouter();
  const { prefs, setPrefs } = useAppState();
  const [sel, setSel] = React.useState(prefs.unitSystem || 'metric');

  const next = () => {
    setPrefs((p: { unitSystem: string }) => ({ ...p, unitSystem: sel as any }));
    track('onboarding_step_complete', { step: 5, unitSystem: sel });
    r.push('/onboarding/budget');
  };

  return (
    <View style={{ flex: 1, backgroundColor: palette.bg, padding: theme.space.lg }}>
      <ProgressDots total={7} index={4} />
      <Text accessibilityRole="header" style={{ fontSize: theme.font.h1, fontWeight: '800', color: palette.text, marginTop: theme.space.lg }}>How do you like to measure?</Text>
      <Text style={{ color: palette.subtext, marginTop: theme.space.sm }}>We’ll show grams or cups accordingly.</Text>
      <View style={{ flexDirection: 'row', marginTop: theme.space.lg, gap: theme.space.md }}>
        {(['metric','imperial'] as const).map(key => (
          <Pressable key={key} onPress={() => setSel(key)} accessibilityRole="button" accessibilityLabel={key}>
            <View style={{ padding: theme.space.lg, borderRadius: 16, borderWidth: 1, borderColor: sel === key ? palette.primary : palette.border }}>
              <Text style={{ color: palette.text, fontWeight: '700' }}>{key === 'metric' ? 'Metric (g, ml)' : 'Imperial (oz, cups)'}</Text>
            </View>
          </Pressable>
        ))}
      </View>
      <View style={{ marginTop: 'auto' }}>
        <Button title="Next" onPress={next} accessibilityLabel="Next to budget" />
      </View>
    </View>
  );
}

