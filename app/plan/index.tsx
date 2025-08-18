import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { theme, useTheme } from '@/theme';
import { demoPlan, recipes } from '@/data/seed';
import Button from '@/components/Button';
import { track } from '@/utils/analytics';

export default function Planner(){
  const { palette } = useTheme();
  const plan = demoPlan;

  const estimate = plan.totalEstimatedCostKES;  // TODO: fix this

  return (
    <ScrollView style={{ flex: 1, backgroundColor: palette.bg }} contentContainerStyle={{ padding: theme.space.lg }}>
      <Text accessibilityRole="header" style={{ fontSize: theme.font.h1, fontWeight: '800', color: palette.text }}>Planner</Text>
      <Text style={{ color: palette.subtext, marginTop: theme.space.sm }}>Estimated weekly cost: KES {estimate}</Text>

      <View style={{ marginTop: theme.space.lg, gap: theme.space.md }}>
        {plan.days.map((d) => (
          <View key={d.date} style={{ borderWidth: 1, borderColor: palette.border, borderRadius: 12, padding: theme.space.md }}>
            <Text style={{ color: palette.text, fontWeight: '700' }}>{d.date}</Text>
            {d.meals.map((m, i) => {
              const rec = recipes.find(r => r.id === m.recipeId);
              return (
                <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: theme.space.xs }}>
                    <Text style={{ color: palette.subtext }}>{m.mealType}</Text>
                  <Text style={{ color: palette.text, fontWeight: '600' }}>{rec?.title}</Text>
                </View>
              );
            })}
          </View>
        ))}
      </View>

      <View style={{ height: theme.space.lg }} />
      <Button title="Save Plan" onPress={() => track('plan_updated', { id: plan.id })} accessibilityLabel="Save plan" />
    </ScrollView>
  );
}

