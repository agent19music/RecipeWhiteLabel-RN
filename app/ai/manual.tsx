import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { theme, useTheme } from '../../theme';
import Chip from '../../components/Chip';
import Button from '../../components/Button';
import { popularIngredients, recipes as seedRecipes } from '../../data/seed';
import { useRouter } from 'expo-router';
import { track } from '../../utils/analytics';
import { generateRecipeFromIngredientsList, saveGeneratedRecipe } from '../../utils/ai';
import { CookingSequence } from '@/components/CookingAnimations';
import { Colors } from '@/constants/Colors';

export default function ManualInput(){
  const { palette } = useTheme();
  const [q, setQ] = useState('');
  const [sel, setSel] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const r = useRouter();

  const add = (s: string) => setSel(arr => Array.from(new Set([...arr, s])));
  const remove = (s: string) => setSel(arr => arr.filter(v => v !== s));

  const generateWithAI = async () => {
    if (sel.length === 0) {
      Alert.alert('No Ingredients', 'Please add at least one ingredient to generate a recipe.');
      return;
    }

    setIsGenerating(true);
    setShowAnimation(true);
    track('ai_recipe_generation_started', { count: sel.length, ingredients: sel });

    try {
      // Generate recipe using AI
      const result = await generateRecipeFromIngredientsList(sel);
      
      if (result.recipe) {
        // Save the generated recipe
        await saveGeneratedRecipe(result.recipe);
        track('ai_recipe_generated', { recipeId: result.recipe.id, title: result.recipe.title });
        
        // Show success and offer navigation
        Alert.alert(
          'Recipe Generated!',
          `Successfully created: ${result.recipe.title}`,
          [
            { text: 'View Recipe', onPress: () => {
              try {
                r.push(`/recipe/${result.recipe.id}`);
              } catch (navError) {
                console.error('Navigation error:', navError);
                r.push('/(tabs)/');
              }
            }},
            { text: 'Stay Here', style: 'cancel' }
          ]
        );
      } else {
        Alert.alert('Generation Failed', 'Could not generate a recipe. Please try different ingredients.');
      }
    } catch (error) {
      console.error('Recipe generation error:', error);
      Alert.alert(
        'Generation Error', 
        'Unable to generate recipe. Please check your internet connection and try again.'
      );
    } finally {
      setIsGenerating(false);
      setShowAnimation(false);
    }
  };

  const seeRecipes = () => {
    try {
      const matchingRecipes = seedRecipes.filter(rp => 
        sel.some(i => 
          rp.title.toLowerCase().includes(i.toLowerCase()) || 
          rp.ingredients.some((x: any) => x.name.toLowerCase().includes(i.toLowerCase()))
        )
      );
      
      track('ingredient_added_manual', { count: sel.length });
      
      if (matchingRecipes.length > 0) {
        Alert.alert(
          'Recipes Found!', 
          `Found ${matchingRecipes.length} recipes matching your ingredients. Navigate to the Discover tab to see them.`,
          [
            { text: 'Go to Discover', onPress: () => r.push('/(tabs)/') },
            { text: 'Stay Here', style: 'cancel' }
          ]
        );
      } else {
        Alert.alert('No Recipes Found', 'Try adding more ingredients or generate an AI recipe.');
      }
    } catch (error) {
      console.error('Error finding recipes:', error);
      Alert.alert('Error', 'Could not find recipes. Please try again.');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: palette.bg }}>
      <ScrollView style={{ flex: 1, padding: theme.space.lg }}>
        <Text accessibilityRole="header" style={{ fontSize: theme.font.h1, fontWeight: '800', color: palette.text, marginBottom: 8 }}>Add ingredients</Text>
        <Text style={{ fontSize: 14, color: palette.subtext, marginBottom: theme.space.lg }}>Select ingredients you have or type your own</Text>
        
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Type an ingredient (e.g., chicken, tomatoes)"
          placeholderTextColor={palette.subtext}
          onSubmitEditing={() => { if (q.trim()) { add(q.trim().toLowerCase()); setQ(''); } }}
          style={{ 
            borderWidth: 1, 
            borderColor: palette.border, 
            borderRadius: 12, 
            padding: 14, 
            color: palette.text, 
            marginBottom: theme.space.lg,
            fontSize: 16,
            backgroundColor: palette.card
          }}
          accessibilityLabel="Ingredient input"
          returnKeyType="done"
        />

        {/* Selected Ingredients */}
        {sel.length > 0 && (
          <View style={{ marginBottom: theme.space.lg }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: palette.text, marginBottom: 12 }}>Selected ({sel.length}):</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {sel.map(s => (
                <Chip 
                  key={s} 
                  label={s} 
                  selected={true} 
                  onToggle={() => remove(s)} 
                />
              ))}
            </View>
          </View>
        )}

        {/* Popular Ingredients */}
        <Text style={{ fontSize: 16, fontWeight: '600', color: palette.text, marginBottom: 12 }}>Popular ingredients:</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {popularIngredients.filter(p => !sel.includes(p)).map(p => (
            <Chip 
              key={p} 
              label={p} 
              selected={false} 
              onToggle={() => add(p)} 
            />
          ))}
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={{ 
        padding: theme.space.lg, 
        gap: 12,
        backgroundColor: palette.card,
        borderTopWidth: 1,
        borderTopColor: palette.border,
        paddingBottom: 34
      }}>
        <Button 
          title={isGenerating ? "Generating Recipe..." : `Generate AI Recipe (${sel.length} items)`}
          onPress={generateWithAI} 
          accessibilityLabel="Generate AI Recipe" 
          disabled={sel.length === 0 || isGenerating}
          variant="primary"
        />
        <Button 
          title="Browse Existing Recipes" 
          onPress={seeRecipes} 
          accessibilityLabel="See Recipes" 
          disabled={sel.length === 0}
          variant="ghost"
        />
      </View>

      {/* Immersive Cooking Animation Overlay */}
      {showAnimation && (
        <View style={[StyleSheet.absoluteFillObject, { zIndex: 9999 }]}>
          <View style={{ 
            flex: 1, 
            backgroundColor: 'rgba(0, 0, 0, 0.92)',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {/* Royco Branding */}
            <View style={{
              position: 'absolute',
              top: 60,
              alignItems: 'center',
            }}>
              <Text style={{
                fontSize: 24,
                fontWeight: '800',
                color: Colors.primary,
                marginBottom: 8,
              }}>Royco AI Chef</Text>
              <Text style={{
                fontSize: 14,
                color: 'rgba(255, 255, 255, 0.7)',
              }}>Powered by Advanced AI</Text>
            </View>
            
            <CookingSequence
              steps={['chopping', 'mixing', 'steaming', 'frying']}
              messages={[
                'Analyzing your ingredients...',
                'Selecting perfect Royco products...',
                'Creating authentic Kenyan flavors...',
                'Optimizing cooking techniques...',
                'Adding Royco spices for perfection...',
                'Finalizing your personalized recipe!'
              ]}
              stepDuration={2000}
              onComplete={() => {}}
            />
          </View>
        </View>
      )}
    </View>
  );
}

