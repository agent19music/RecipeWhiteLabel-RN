import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import { theme, useTheme } from '../../theme';
import Button from '../../components/Button';
import ProgressDots from '../../components/ProgressDots';
import { useRouter } from 'expo-router';
import { useAppState } from '../../context/AppState';
import Card from '../../components/Card';
import { track } from '../../utils/analytics';
import { Goal } from '../../data/types';

const goals: { key: Goal; title: string; desc: string }[] = [
  { key: 'save_time', title: 'Save time', desc: 'Quicker prep and cook.' },
  { key: 'eat_healthier', title: 'Eat healthier', desc: 'Balanced choices.' },
  { key: 'spend_less', title: 'Spend less', desc: 'Budget-friendly picks.' },
  { key: 'reduce_waste', title: 'Reduce waste', desc: 'Use what you have.' },
  { key: 'learn_new_recipes', title: 'Learn new recipes', desc: 'Discover ideas.' },
];

export default function GoalsScreen(){
  const { palette } = useTheme();
  const r = useRouter();
  const { prefs, setPrefs } = useAppState();
  const [sel, setSel] = useState(new Set(prefs.goals as Goal[] || []));

  const toggle = (k: Goal) => setSel(prev => { const n = new Set(prev); n.has(k) ? n.delete(k) : n.add(k); return n;});
  const next = () => {
    const goalsArr = Array.from(sel);
    setPrefs(p => ({ ...p, goals: goalsArr }));
    track('onboarding_step_complete', { step: 4, goals: goalsArr });
    r.push('/onboarding/units');
  };

  return (
    <View style={{ flex: 1, backgroundColor: palette.bg }}>
      <ScrollView contentContainerStyle={{ padding: theme.space.lg }}>
        <ProgressDots total={7} index={3} />
        <Text accessibilityRole="header" style={{ fontSize: theme.font.h1, fontWeight: '800', color: palette.text, marginTop: theme.space.lg }}>What brings you here?</Text>
        <Text style={{ color: palette.subtext, marginTop: theme.space.sm }}>Pick a few goals. We’ll personalize suggestions.</Text>
        <View style={{ marginTop: theme.space.lg, gap: theme.space.sm }}>
          {goals.map(g => (
            <Pressable key={g.key} onPress={() => toggle(g.key)} accessibilityRole="button" accessibilityLabel={`Goal ${g.title}`}>
              <Card style={{ borderColor: sel.has(g.key) ? palette.primary : palette.border }}>
                <Text style={{ color: palette.text, fontWeight: '700', fontSize: theme.font.body }}>{g.title}</Text>
                <Text style={{ color: palette.subtext, marginTop: 4 }}>{g.desc}</Text>
              </Card>
            </Pressable>
          ))}
        </View>
      </ScrollView>
      <View style={{ padding: theme.space.lg }}>
        <Button title="Next" onPress={next} accessibilityLabel="Next to units" />
      </View>
    </View>
  );
}

