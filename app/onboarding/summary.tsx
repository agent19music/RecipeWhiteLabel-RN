import React from 'react';
import { View, Text } from 'react-native';
import { theme, useTheme } from '../../theme';
import Button from '../../components/Button';
import ProgressDots from '../../components/ProgressDots';
import { useRouter } from 'expo-router';
import { useAppState } from '../../context/AppState';
import Card from '../../components/Card';
import { track } from '../../utils/analytics';

export default function SummaryScreen(){
  const { palette } = useTheme();
  const r = useRouter();
  const { prefs, setOnboarded } = useAppState();

  const finish = () => {
    track('onboarding_finished', { prefs });
    setOnboarded(true);
    r.replace('/(tabs)');
  };

  return (
    <View style={{ flex: 1, backgroundColor: palette.bg, padding: 16 }}>
      <ProgressDots total={7} index={6} />
      <Text accessibilityRole="header" style={{ fontSize: 28, fontWeight: '800', color: palette.text, marginTop: 16 }}>Summary</Text>
      <Card style={{ marginTop: 16 }}>
        <Text style={{ color: palette.text, fontWeight: '700' }}>Diet</Text>
        <Text style={{ color: palette.subtext }}>{(prefs.diets || []).join(', ') || 'None'}</Text>
        <View style={{ height: 8 }} />
        <Text style={{ color: palette.text, fontWeight: '700' }}>Allergies</Text>
        <Text style={{ color: palette.subtext }}>{(prefs.allergies || []).join(', ') || 'None'}</Text>
        <View style={{ height: 8 }} />
        <Text style={{ color: palette.text, fontWeight: '700' }}>Goals</Text>
        <Text style={{ color: palette.subtext }}>{(prefs.goals || []).join(', ') || 'None'}</Text>
        <View style={{ height: 8 }} />
        <Text style={{ color: palette.text, fontWeight: '700' }}>Units</Text>
        <Text style={{ color: palette.subtext }}>{prefs.unitSystem}</Text>
        <View style={{ height: 8 }} />
        <Text style={{ color: palette.text, fontWeight: '700' }}>Household</Text>
        <Text style={{ color: palette.subtext }}>{prefs.householdSize}</Text>
        <View style={{ height: 8 }} />
        <Text style={{ color: palette.text, fontWeight: '700' }}>Weekly budget</Text>
            <Text style={{ color: palette.subtext }}>KES {prefs.weeklyBudgetKES}</Text>
      </Card>
      <View style={{ marginTop: 'auto' }}>
        <Button title="Finish" onPress={finish} accessibilityLabel="Finish onboarding" />
        </View>
    </View>
  );
}

