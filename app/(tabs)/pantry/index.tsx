import React, { useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { theme, useTheme } from '../../../theme';
import { pantry as seedPantry } from '../../../data/seed';
import Button from '../../../components/Button';
import { differenceInDays, parseISO } from 'date-fns';
import { track } from '../../../utils/analytics';

function chipColor(days: number){
  if (days <= 2) return 'red';
  if (days <= 5) return 'orange';
  return 'green';
}

export default function PantryList(){
  const { palette } = useTheme();
  const [items, setItems] = useState(seedPantry);

  const sorted = useMemo(() => {
    return [...items].sort((a, b) => {
      const ad = a.expiresOn ? parseISO(a.expiresOn) : undefined;
      const bd = b.expiresOn ? parseISO(b.expiresOn) : undefined;
      if (ad && bd) return ad.getTime() - bd.getTime();
      if (ad) return -1;
      if (bd) return 1;
      return a.title.localeCompare(b.title);
    });
  }, [items]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: palette.bg }} contentContainerStyle={{ padding: theme.space.lg }}>
      <Text accessibilityRole="header" style={{ fontSize: theme.font.h1, fontWeight: '800', color: palette.text }}>Pantry</Text>
      <View style={{ marginTop: theme.space.lg, gap: theme.space.sm }}>
        {sorted.map(it => {
          const days = it.expiresOn ? differenceInDays(parseISO(it.expiresOn), new Date()) : 99;
          return (
            <View key={it.id} style={{ borderWidth: 1, borderColor: palette.border, borderRadius: 12, padding: theme.space.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <Text style={{ color: palette.text, fontWeight: '700' }}>{it.title}</Text>
                <Text style={{ color: palette.subtext }}>{it.qty} {it.unit}</Text>
              </View>
              <View style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, backgroundColor: palette.primaryMuted }}>
                <Text style={{ color: palette.text }}>{it.expiresOn ? (days <= 0 ? 'Expired' : `${days}d`) : '—'}</Text>
              </View>
            </View>
          );
        })}
      </View>
      <View style={{ height: theme.space.lg }} />
      <Button title="Add Item" onPress={() => track('pantry_item_added')} accessibilityLabel="Add pantry item" />
    </ScrollView>
  );
}

