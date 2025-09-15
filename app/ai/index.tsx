import React, { useState } from 'react';
import { View, Text, Platform, ScrollView, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { theme, useTheme } from '../../theme';
import Button from '../../components/Button';
import Chip from '../../components/Chip';
import { getMockDetections } from '../../utils/fakeCamera';
import { recipes as seedRecipes } from '../../data/seed';
import { useRouter } from 'expo-router';
import { track } from '../../utils/analytics';

import GlassmorphicBackButton from '@/components/GlassmorphicBackButton';

export default function CameraScreen(){
  const { palette } = useTheme();
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [ing, setIng] = useState<string[]>([]);
  const [detectedRecipes, setDetectedRecipes] = useState<any[]>([]);

  const canUseCamera = permission?.granted && Platform.OS !== 'web';

  const detect = () => {
    const list = getMockDetections();
    setIng(list);
    track('ingredient_detected', { count: list.length });
  };

  const seeRecipes = () => {
    try {
      const matchingRecipes = seedRecipes.filter(rp => 
        ing.some(i => 
          rp.title.toLowerCase().includes(i.toLowerCase()) || 
          rp.ingredients.some((x: any) => x.name.toLowerCase().includes(i.toLowerCase()))
        )
      );
      
      if (matchingRecipes.length > 0) {
        setDetectedRecipes(matchingRecipes);
        Alert.alert(
          'Recipes Found!', 
          `Found ${matchingRecipes.length} recipes matching your ingredients. Navigate to the Discover tab to see them.`,
          [
            { text: 'View Recipes', onPress: () => router.push('/(tabs)/') },
            { text: 'Stay Here', style: 'cancel' }
          ]
        );
      } else {
        Alert.alert('No Recipes Found', 'Try detecting more ingredients or use manual input.');
      }
    } catch (error) {
      console.error('Error finding recipes:', error);
      Alert.alert('Error', 'Could not find recipes. Please try again.');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: palette.bg, padding: theme.space.lg }}>
      {/* Glass Back Button */}
      <GlassmorphicBackButton />

      <Text accessibilityRole="header" style={{ fontSize: theme.font.h1, fontWeight: '800', color: palette.text, marginTop: 10 }}>What's in your fridge?</Text>
      <View style={{ height: 260, marginTop: theme.space.lg, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: palette.border, backgroundColor: palette.primaryMuted }}>
        {canUseCamera ? (
          <CameraView style={{ flex: 1 }} accessibilityLabel="Camera viewport" />
        ) : (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: palette.subtext }}>Camera unavailable. Using mock.</Text>
            {!permission?.granted && Platform.OS !== 'web' ? (
              <Button title="Grant Permission" onPress={() => requestPermission()} />
            ) : null}
          </View>
        )}
      </View>

      <View style={{ marginTop: theme.space.md, flexDirection: 'row', flexWrap: 'wrap' }}>
        {ing.map(x => (
          <Chip key={x} label={x} selected onToggle={() => setIng(arr => arr.filter(v => v !== x))} />
        ))}
      </View>

        <View style={{ marginTop: 'auto', gap: theme.space.sm }}>
        <Button title="Detect Ingredients" onPress={detect} accessibilityLabel="Detect Ingredients" />
        <Button title="Switch to Manual" variant="ghost" onPress={() => router.push('/ai/manual')} accessibilityLabel="Switch to Manual" />  
        <Button title="See Recipes" onPress={seeRecipes} accessibilityLabel="See Recipes" disabled={ing.length === 0} />
      </View>
    </View>
  );
}

