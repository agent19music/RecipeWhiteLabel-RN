import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { theme, useTheme } from '../../theme';
import { recipes } from '../../data/seed';
import IngredientRow from '../../components/IngredientRow';
import Card from '../../components/Card';
import { useLocalSearchParams } from 'expo-router';

export default function RecipeDetails(){
  const { palette } = useTheme();
  const params = useLocalSearchParams();
  const rid = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  const recipe = recipes.find(r => r.id === rid);

  if (!recipe) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Recipe not found</Text>
    </View>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: palette.bg }} contentContainerStyle={{ padding: theme.space.lg }}>
      <Text accessibilityRole="header" style={{ fontSize: theme.font.h1, fontWeight: '800', color: palette.text }}>{recipe.title}</Text>
      <Text style={{ color: palette.subtext, marginTop: 4 }}>{recipe.minutes} min • {recipe.calories} cal • {recipe.likes} likes</Text>

      <Card style={{ marginTop: theme.space.lg }}>
        <Text style={{ color: palette.text, fontWeight: '700', marginBottom: theme.space.sm }}>Ingredients</Text>
        {recipe.ingredients.map((ing: { name: string; qty: string | number | undefined; unit: string }, i: number) => (
          <IngredientRow key={i} name={ing.name} qty={ing.qty as number | undefined} unit={ing.unit} />
        ))}
      </Card>

      <Card style={{ marginTop: theme.space.lg }}>
        <Text style={{ color: palette.text, fontWeight: '700', marginBottom: theme.space.sm }}>Steps</Text>
             {recipe.steps.map((step: string, i: number) => (
          <Text key={i} style={{ color: palette.text, marginBottom: theme.space.sm }}>{i + 1}. {step}</Text>
        ))}
      </Card>
    </ScrollView>
  );
}
