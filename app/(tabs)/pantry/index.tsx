import { Colors } from '@/constants/Colors';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { differenceInDays, parseISO } from 'date-fns';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { pantry as seedPantry } from '../../../data/seed';
import { useTheme } from '../../../theme';
import { track } from '../../../utils/analytics';

const { width } = Dimensions.get('window');

function chipColor(days: number){
  if (days <= 2) return 'red';
  if (days <= 5) return 'orange';
  return 'green';
}

export default function PantryList(){
  const router = useRouter();
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

  const getExpiryColor = (days: number) => {
    if (days <= 2) return '#EF4444';
    if (days <= 5) return '#F59E0B';
    return '#10B981';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Pantry</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => track('pantry_item_added')}>
            <Ionicons name="add" size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* AI Recipe Maker Card */}
        <TouchableOpacity 
          style={styles.aiCard}
          onPress={() => router.push('/ai')}
          activeOpacity={0.95}
        >
          <View style={styles.aiCardContent}>
            <View style={styles.aiIconContainer}>
              <MaterialCommunityIcons name="robot-happy" size={48} color={Colors.white} />
            </View>
            <View style={styles.aiCardText}>
              <Text style={styles.aiCardTitle}>AI Recipe Maker</Text>
              <Text style={styles.aiCardSubtitle}>Create recipes from your pantry items</Text>
              <View style={styles.aiCardButton}>
                <Text style={styles.aiCardButtonText}>Generate Recipe</Text>
                <Ionicons name="arrow-forward" size={20} color={Colors.primary} />
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{items.length}</Text>
            <Text style={styles.statLabel}>Total Items</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: '#EF4444' }]}>
              {items.filter(it => {
                const days = it.expiresOn ? differenceInDays(parseISO(it.expiresOn), new Date()) : 99;
                return days <= 2;
              }).length}
            </Text>
            <Text style={styles.statLabel}>Expiring Soon</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: '#10B981' }]}>
              {items.filter(it => {
                const days = it.expiresOn ? differenceInDays(parseISO(it.expiresOn), new Date()) : 99;
                return days > 5;
              }).length}
            </Text>
            <Text style={styles.statLabel}>Fresh</Text>
          </View>
        </View>

        {/* Pantry Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pantry Items</Text>
          <View style={styles.itemsList}>
            {sorted.map(it => {
              const days = it.expiresOn ? differenceInDays(parseISO(it.expiresOn), new Date()) : 99;
              const expiryColor = getExpiryColor(days);
              return (
                <View key={it.id} style={styles.itemCard}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemTitle}>{it.title}</Text>
                    <Text style={styles.itemQuantity}>{it.qty} {it.unit}</Text>
                  </View>
                  <View style={[styles.expiryChip, { backgroundColor: expiryColor + '20' }]}>
                    <Text style={[styles.expiryText, { color: expiryColor }]}>
                      {it.expiresOn ? (days <= 0 ? 'Expired' : `${days} days`) : 'No expiry'}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* AI Camera FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/ai/camera')}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="camera-iris" size={28} color={Colors.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    backgroundColor: '#667eea',
  },
  aiCardContent: {
    flexDirection: 'row',
    padding: 20,
    gap: 16,
  },
  aiIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiCardText: {
    flex: 1,
    justifyContent: 'center',
  },
  aiCardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 4,
  },
  aiCardSubtitle: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.9,
    marginBottom: 12,
  },
  aiCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 8,
  },
  aiCardButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  section: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  itemsList: {
    gap: 12,
  },
  itemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  expiryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  expiryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 100, // More space for FAB
  },
  fab: {
    position: 'absolute',
    bottom: 90, // Above tab bar
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 1000,
  },
});

