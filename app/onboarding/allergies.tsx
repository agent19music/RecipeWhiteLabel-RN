import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet } from 'react-native';
import { theme, useTheme } from '../../theme';
import Chip from '../../components/Chip';
import Button from '../../components/Button';
import ProgressDots from '../../components/ProgressDots';
import { useRouter } from 'expo-router';
import { useAppState } from '../../context/AppState';
import { track } from '../../utils/analytics';

const commonAllergies = ['peanuts', 'shellfish', 'eggs', 'milk', 'soy', 'gluten', 'sesame'];

export default function AllergiesScreen(){
  const { palette } = useTheme();
  const { prefs, setPrefs } = useAppState();
  const [selected, setSelected] = useState<Set<string>>(new Set(prefs.allergies ?? []));
  const [custom, setCustom] = useState('');
  const r = useRouter();

  const toggle = (k: string) => setSelected(prev => { const n = new Set(prev); n.has(k) ? n.delete(k) : n.add(k); return n; });

  const next = () => {
    const items = Array.from(selected);
    if (custom.trim()) {
      custom.split(',').map(s => s.trim()).filter(Boolean).forEach(v => items.push(v));
    }
    setPrefs((p: { allergies: string[] }) => ({ ...p, allergies: items }));
    track('onboarding_step_complete', { step: 3, allergies: items });
    r.push('/onboarding/goals');
  };

  return (
    <View style={{ flex: 1, backgroundColor: palette.bg }}>
      <ScrollView contentContainerStyle={{ padding: theme.space.lg }}>
        <ProgressDots total={7} index={2} />
        <Text accessibilityRole="header" style={{ fontSize: theme.font.h1, fontWeight: '800', color: palette.text, marginTop: theme.space.lg }}>Allergies & avoids</Text>
          <Text style={{ color: palette.subtext, marginTop: theme.space.sm }}>Select any allergies or avoids you have.</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: theme.space.lg }}>
          {commonAllergies.map(a => (
            <Chip key={a} label={a} selected={selected.has(a)} onToggle={() => toggle(a)} accessibilityLabel={`Allergy ${a}`} />
          ))}
        </View>
        <Text style={{ color: palette.text, marginTop: theme.space.lg }}>Other (comma-separated)</Text>
        <TextInput
          value={custom}
          onChangeText={setCustom}
          placeholder="e.g., coriander"
          placeholderTextColor={palette.subtext}
          style={{ borderWidth: 1, borderColor: palette.border, borderRadius: 12, padding: 12, color: palette.text, marginTop: theme.space.sm }}
          accessibilityLabel="Other allergies"
        />
        <View style={{ padding: theme.space.lg }}>
          <Button title="Next" onPress={next} accessibilityLabel="Next to goals" />
        </View>
      </ScrollView>
    </View>
  );
}

