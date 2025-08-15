import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { theme, useTheme } from '../../../theme';
import { useAppState } from '../../../context/AppState';
import Button from '../../../components/Button';

export default function Profile(){
  const { palette } = useTheme();
  const { prefs } = useAppState();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: palette.bg }} contentContainerStyle={{ padding: theme.space.lg }}>
      <Text accessibilityRole="header" style={{ fontSize: theme.font.h1, fontWeight: '800', color: palette.text }}>Profile</Text>
      <View style={{ marginTop: theme.space.lg, gap: theme.space.sm }}>
        <Text style={{ color: palette.text, fontWeight: '700' }}>Diet</Text>
        <Text style={{ color: palette.subtext }}>{(prefs.diets || []).join(', ') || 'None'}</Text>
        <Text style={{ color: palette.text, fontWeight: '700', marginTop: theme.space.sm }}>Allergies</Text>
        <Text style={{ color: palette.subtext }}>{(prefs.allergies || []).join(', ') || 'None'}</Text>
        <Text style={{ color: palette.text, fontWeight: '700', marginTop: theme.space.sm }}>Goals</Text>
        <Text style={{ color: palette.subtext }}>{(prefs.goals || []).join(', ') || 'None'}</Text>
        <Text style={{ color: palette.text, fontWeight: '700', marginTop: theme.space.sm }}>Units</Text>
        <Text style={{ color: palette.subtext }}>{prefs.unitSystem}</Text>
        <Text style={{ color: palette.text, fontWeight: '700', marginTop: theme.space.sm }}>Household</Text>
        <Text style={{ color: palette.subtext }}>{prefs.householdSize}</Text>
        <Text style={{ color: palette.text, fontWeight: '700', marginTop: theme.space.sm }}>Weekly budget</Text>
        <Text style={{ color: palette.subtext }}>KES {prefs.weeklyBudgetKES}</Text>
      </View>
      <View style={{ height: theme.space.lg }} />
      <Button title="Edit Preferences" onPress={() => window.location.assign('/onboarding/start')} accessibilityLabel="Edit preferences" />
    </ScrollView>
  );
}

