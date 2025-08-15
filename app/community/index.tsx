import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { theme, useTheme } from '../../theme';
import { challenges, recipes } from '../../data/seed';
import ChallengeCard from '../../components/ChallengeCard';
import RecipeCard from '../../components/RecipeCard';
import { differenceInDays } from 'date-fns';
import { useRouter } from 'expo-router';
import { track } from '../../utils/analytics';

export default function CommunityFeed(){
  const { palette } = useTheme();
  const r = useRouter();
  const daysLeft = (d: string) => Math.max(0, differenceInDays(new Date(d), new Date()));

  return (
    <ScrollView style={{ flex: 1, backgroundColor: palette.bg }} contentContainerStyle={{ padding: theme.space.lg }}>
      <Text accessibilityRole="header" style={{ fontSize: theme.font.h1, fontWeight: '800', color: palette.text }}>Community</Text>

      <Text style={{ color: palette.subtext, marginTop: theme.space.md }}>Active Challenges</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: theme.space.sm }}>
        {challenges.map(c => (
          <ChallengeCard key={c.id} title={c.title} endsInDays={daysLeft(c.endsOn)} entries={c.entries} onJoin={() => {}} />
        ))}
      </ScrollView>

      <Text style={{ color: palette.subtext, marginTop: theme.space.lg }}>Shared Recipes</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.space.md, marginTop: theme.space.sm }}>
        {recipes.map(rc => (
          <Pressable key={rc.id} onPress={() => { track('recipe_view', { id: rc.id }); r.push({ pathname: '/community/recipe', params: { id: rc.id } }); }} accessibilityRole="button" accessibilityLabel={`Open ${rc.title}`}>
            <RecipeCard title={rc.title} minutes={rc.minutes} likes={rc.likes} by={rc.by} />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

