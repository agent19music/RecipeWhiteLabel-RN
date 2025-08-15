import React from 'react';
import { ScrollView, Text, View, Pressable } from 'react-native';
import { theme, useTheme } from '../../../theme';
import { recipes } from '../../../data/seed';
import RecipeCard from '../../../components/RecipeCard';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function RecipeList() {
  const { palette } = useTheme();
  const { ids } = useLocalSearchParams();
  const r = useRouter();
  const idSet: Set<string> =
    typeof ids === 'string' ? new Set(ids.split(',').filter(Boolean)) : new Set<string>();
  const list = idSet.size ? recipes.filter((rp) => idSet.has(rp.id)) : recipes;
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: palette.bg }}
      contentContainerStyle={{ padding: theme.space.lg }}
    >
      <Text
        accessibilityRole="header"
        style={{ fontSize: theme.font.h1, fontWeight: '800', color: palette.text }}
      >
        Recipes
      </Text>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: theme.space.md,
          marginTop: theme.space.md,
        }}
      >
        {list.map((rc) => (
          <Pressable
            key={rc.id}
            onPress={() =>
              r.push({ pathname: '/(tabs)/community/recipe', params: { id: rc.id } })
            }
          >
            <RecipeCard
              title={rc.title}
              minutes={rc.minutes}
              likes={rc.likes}
              by={rc.by}
            />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}
