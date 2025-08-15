import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { theme, useTheme } from '../../theme';
import Chip from '../../components/Chip';
import Button from '../../components/Button';
import { popularIngredients, recipes as seedRecipes } from '../../data/seed';
import { useRouter } from 'expo-router';
import { track } from '../../utils/analytics';

export default function ManualInput(){
  const { palette } = useTheme();
  const [q, setQ] = useState('');
  const [sel, setSel] = useState<string[]>([]);
  const r = useRouter();

  const add = (s: string) => setSel(arr => Array.from(new Set([...arr, s])));
  const remove = (s: string) => setSel(arr => arr.filter(v => v !== s));

  const seeRecipes = () => {
    const ids = seedRecipes.filter(rp => sel.some(i => rp.title.toLowerCase().includes(i) || rp.ingredients.some((x: { name: string }) => x.name.toLowerCase().includes(i)))).map(rp => rp.id);
    track('ingredient_added_manual', { count: sel.length });
    r.push({ pathname: '/community/recipe-list', params: { ids: ids.join(',') } }); 
  };

  return (
    <View style={{ flex: 1, backgroundColor: palette.bg, padding: theme.space.lg }}>
      <Text accessibilityRole="header" style={{ fontSize: theme.font.h1, fontWeight: '800', color: palette.text }}>Add ingredients</Text>
      <TextInput
        value={q}
        onChangeText={setQ}
        placeholder="Type an ingredient"
        placeholderTextColor={palette.subtext}
        onSubmitEditing={() => { if (q.trim()) { add(q.trim().toLowerCase()); setQ(''); } }}
        style={{ borderWidth: 1, borderColor: palette.border, borderRadius: 12, padding: 12, color: palette.text, marginTop: theme.space.lg }}
        accessibilityLabel="Ingredient input"
      />

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: theme.space.md }}>
        {popularIngredients.map(p => (
          <Chip key={p} label={p} selected={sel.includes(p)} onToggle={() => (sel.includes(p) ? remove(p) : add(p))} />
        ))}
      </View>

        <View style={{ marginTop: 'auto' }}>
        <Button title="See Recipes" onPress={seeRecipes} accessibilityLabel="See Recipes" disabled={sel.length === 0} />
      </View>
    </View>
  );
}

