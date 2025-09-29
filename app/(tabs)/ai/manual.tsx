import LoadingSpinner from '@/components/LoadingSpinner';
import Dialog from '@/components/Dialog';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Button from '../../../components/Button';
import Chip from '../../../components/Chip';
import { popularIngredients, recipes as seedRecipes } from '../../../data/seed';
import { theme, useTheme } from '../../../theme';
import { generateAIRecipe } from '../../../utils/ai-enhanced';
import { track } from '../../../utils/analytics';

import GlassmorphicBackButton from '@/components/GlassmorphicBackButton';

export default function ManualInput(){
  const { palette } = useTheme();
  const [q, setQ] = useState('');
  const [sel, setSel] = useState<string[]>([]);
const [isGenerating, setIsGenerating] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [dialog, setDialog] = useState<{
    visible: boolean;
    title: string;
    message: string;
    icon?: { name: string; color?: string; backgroundColor?: string };
    actions?: Array<{ label: string; variant?: 'primary' | 'secondary' | 'danger'; onPress: () => void }>;
  }>({ visible: false, title: '', message: '' });
  const r = useRouter();

  const add = (s: string) => setSel(arr => Array.from(new Set([...arr, s])));
  const remove = (s: string) => setSel(arr => arr.filter(v => v !== s));

  const generateWithAI = async () => {
    if (sel.length === 0) {
      setDialog({
        visible: true,
        title: 'No Ingredients',
        message: 'Please add at least one ingredient to generate a recipe.',
        icon: { name: 'food-off', backgroundColor: Colors.warning },
        actions: [{ label: 'OK', variant: 'primary', onPress: () => setDialog(d => ({ ...d, visible: false })) }]
      });
      return;
    }

    setIsGenerating(true);
    setShowLoading(true);
    track('ai_recipe_generation_started', { count: sel.length, ingredients: sel });

    try {
      // Generate recipe using enhanced AI with Gemini
      const result = await generateAIRecipe(sel, {
        cuisine: 'Kenyan',
        servings: 4,
        difficulty: 'medium',
      });
      
      if (result.success && result.recipe) {
        track('ai_recipe_generated', { recipeId: result.recipe.id, title: result.recipe.title });
        
        // Show success and offer navigation
        setDialog({
          visible: true,
          title: 'Recipe Generated!',
          message: `Successfully created: ${result.recipe.title}`,
          icon: { name: 'chef-hat', backgroundColor: Colors.success },
          actions: [
            { 
              label: 'View Recipe',
              variant: 'primary',
              onPress: () => {
                setDialog(d => ({ ...d, visible: false }));
                try {
                  r.push(`/recipe/${result.recipe.id}`);
                } catch (navError) {
                  console.error('Navigation error:', navError);
                  r.push('/discover');
                }
              }
            },
            { 
              label: 'Stay Here',
              variant: 'secondary',
              onPress: () => setDialog(d => ({ ...d, visible: false }))
            }
          ]
        });
      } else {
        setDialog({
          visible: true,
          title: 'Generation Failed',
          message: 'Could not generate a recipe. Please try different ingredients.',
          icon: { name: 'alert-circle', backgroundColor: Colors.error },
          actions: [{ label: 'OK', variant: 'primary', onPress: () => setDialog(d => ({ ...d, visible: false })) }]
        });
      }
    } catch (error) {
      console.error('Recipe generation error:', error);
      setDialog({
        visible: true,
        title: 'Generation Error',
        message: 'Unable to generate recipe. Please check your internet connection and try again.',
        icon: { name: 'wifi-off', backgroundColor: Colors.error },
        actions: [{ label: 'OK', variant: 'primary', onPress: () => setDialog(d => ({ ...d, visible: false })) }]
      });
    } finally {
      setIsGenerating(false);
      setShowLoading(false);
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
        setDialog({
          visible: true,
          title: 'Recipes Found!',
          message: `Found ${matchingRecipes.length} recipes matching your ingredients. Navigate to the Discover tab to see them.`,
          icon: { name: 'bookmark-check', backgroundColor: Colors.success },
          actions: [
            { 
              label: 'Go to Discover',
              variant: 'primary',
              onPress: () => {
                setDialog(d => ({ ...d, visible: false }));
                r.push('/discover');
              }
            },
            { 
              label: 'Stay Here',
              variant: 'secondary',
              onPress: () => setDialog(d => ({ ...d, visible: false }))
            }
          ]
        });
      } else {
        setDialog({
          visible: true,
          title: 'No Recipes Found',
          message: 'Try adding more ingredients or generate an AI recipe.',
          icon: { name: 'file-search', backgroundColor: Colors.warning },
          actions: [{ label: 'OK', variant: 'primary', onPress: () => setDialog(d => ({ ...d, visible: false })) }]
        });
      }
    } catch (error) {
      console.error('Error finding recipes:', error);
      setDialog({
        visible: true,
        title: 'Error',
        message: 'Could not find recipes. Please try again.',
        icon: { name: 'alert', backgroundColor: Colors.error },
        actions: [{ label: 'OK', variant: 'primary', onPress: () => setDialog(d => ({ ...d, visible: false })) }]
      });
    }
  };

  return (<>
    <View style={{ flex: 1, backgroundColor: palette.bg, padding: theme.space.lg }}>
      {/* Glass Back Button */}
      <GlassmorphicBackButton />

      <ScrollView style={{ flex: 1, padding: theme.space.lg }}>
        <Text accessibilityRole="header" style={{ fontSize: theme.font.h1, fontWeight: '800', color: palette.text, marginBottom: 8, marginTop: 10 }}>Add ingredients</Text>
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

      {/* Enhanced Loading Spinner with Cooking Animation */}
      <LoadingSpinner
        visible={showLoading}
        type="cooking"
        text="Creating your personalized Royco-enhanced recipe..."
      />
        </View>
      
      <Dialog 
        visible={dialog.visible}
        onClose={() => setDialog(d => ({ ...d, visible: false }))}
        title={dialog.title}
        message={dialog.message}
        icon={dialog.icon}
        actions={dialog.actions}
      />
   
  </>);
}

