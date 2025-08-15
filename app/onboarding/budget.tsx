import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { theme, useTheme } from '../../theme';
import Button from '../../components/Button';
import ProgressDots from '../../components/ProgressDots';
import { useRouter } from 'expo-router';
import { useAppState } from '../../context/AppState';
import { track } from '../../utils/analytics';

export default function BudgetHouseholdScreen(){
  const { palette } = useTheme();
  const r = useRouter();
  const { prefs, setPrefs } = useAppState();
  const [house, setHouse] = React.useState(prefs.householdSize ?? 2);
  const [budget, setBudget] = React.useState(prefs.weeklyBudgetKES ?? 3000);

  const inc = () => setHouse(h => Math.min(8, h + 1));
  const dec = () => setHouse(h => Math.max(1, h - 1));

  const next = () => {
    setPrefs(p => ({ ...p, householdSize: house, weeklyBudgetKES: budget }));
    track('onboarding_step_complete', { step: 6, householdSize: house, weeklyBudgetKES: budget });
    r.push('/onboarding/summary');
  };

  return (
    <View style={{ flex: 1, backgroundColor: palette.bg, padding: theme.space.lg }}>
      <ProgressDots total={7} index={5} />
      <Text accessibilityRole="header" style={{ fontSize: theme.font.h1, fontWeight: '800', color: palette.text, marginTop: theme.space.lg }}>Household & budget</Text>
      <Text style={{ color: palette.subtext, marginTop: theme.space.sm }}>Your weekly budget keeps us honest.</Text>

      <View style={{ marginTop: theme.space.lg }}>
        <Text style={{ color: palette.text, fontWeight: '700' }}>Household size</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.space.md, marginTop: theme.space.sm }}>
          <Button title="-" onPress={dec} accessibilityLabel="Decrease household" />
          <Text style={{ color: palette.text, fontSize: theme.font.h2 }}>{house}</Text>
          <Button title="+" onPress={inc} accessibilityLabel="Increase household" />
        </View>
      </View>

      <View style={{ marginTop: theme.space.lg }}>
        <Text style={{ color: palette.text, fontWeight: '700' }}>Weekly budget</Text>
        <Text style={{ color: palette.subtext, marginTop: 4 }}>KES {budget}</Text>
        <View style={{ flexDirection: 'row', gap: theme.space.sm, marginTop: theme.space.sm, flexWrap: 'wrap' }}>
          {[500, 1500, 3000, 5000, 8000, 12000, 15000].map(v => (
            <Pressable key={v} onPress={() => setBudget(v)} accessibilityRole="button" accessibilityLabel={`Set budget ${v}`}>
              <View style={{ paddingVertical: 10, paddingHorizontal: 14, borderRadius: 16, borderWidth: 1, borderColor: budget === v ? palette.primary : palette.border }}>
                <Text style={{ color: palette.text }}>KES {v}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={{ marginTop: 'auto' }}>
        <Button title="Next" onPress={next} accessibilityLabel="Next to summary" />
      </View>
    </View>
  );
}

