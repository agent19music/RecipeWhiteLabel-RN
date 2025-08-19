import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { differenceInDays, parseISO } from 'date-fns';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { track } from '../../utils/analytics';
import { pantry as seedPantry } from '../../data/seed';

export default function PantryScreen() {
  const router = useRouter();
  const [items, setItems] = useState(seedPantry);
  const [searchQuery, setSearchQuery] = useState('');

  // Sort items by expiry date
  const sortedItems = useMemo(() => {
    let filtered = [...items];
    
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered.sort((a, b) => {
      const ad = a.expiresOn ? parseISO(a.expiresOn) : undefined;
      const bd = b.expiresOn ? parseISO(b.expiresOn) : undefined;
      if (ad && bd) return ad.getTime() - bd.getTime();
      if (ad) return -1;
      if (bd) return 1;
      return a.title.localeCompare(b.title);
    });
  }, [items, searchQuery]);

  const getExpiryColor = (days: number) => {
    if (days <= 2) return '#EF4444';
    if (days <= 5) return '#F59E0B';
    return '#10B981';
  };

  const stats = useMemo(() => {
    const expiringSoon = items.filter(it => {
      const days = it.expiresOn ? differenceInDays(parseISO(it.expiresOn), new Date()) : 99;
      return days <= 2;
    }).length;

    const fresh = items.filter(it => {
      const days = it.expiresOn ? differenceInDays(parseISO(it.expiresOn), new Date()) : 99;
      return days > 5;
    }).length;

    return { total: items.length, expiringSoon, fresh };
  }, [items]);

  const handleSmartShopping = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    track('smart_shopping_opened', {});
    router.push('/(tabs)/pantry/smart-shopping' as any);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>My Pantry</Text>
            <Text style={styles.headerSubtitle}>Manage your ingredients</Text>
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              track('pantry_add_item', {});
            }}
          >
            <Ionicons name="add" size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* Smart Shopping Card */}
        <TouchableOpacity
          style={styles.smartShoppingCard}
          onPress={handleSmartShopping}
          activeOpacity={0.95}
        >
          <View style={styles.smartShoppingGradient}>
            <View style={styles.smartShoppingContent}>
              <View style={styles.smartShoppingIcon}>
                <MaterialIcons name="shopping-cart" size={32} color={Colors.white} />
              </View>
              <View style={styles.smartShoppingText}>
                <Text style={styles.smartShoppingTitle}>Smart Shopping 🛍️</Text>
                <Text style={styles.smartShoppingSubtitle}>
                  Compare prices from Carrefour & Jumia instantly
                </Text>
                <View style={styles.smartShoppingButton}>
                  <Text style={styles.smartShoppingButtonText}>Start Shopping</Text>
                  <Ionicons name="arrow-forward" size={18} color={Colors.white} />
                </View>
              </View>
            </View>
            
            {/* Store Logos */}
            <View style={styles.storeLogos}>
              <View style={styles.storeLogo}>
                <Text style={styles.storeEmoji}>🛒</Text>
                <Text style={styles.storeLogoText}>Carrefour</Text>
              </View>
              <View style={styles.storeDivider} />
              <View style={styles.storeLogo}>
                <Text style={styles.storeEmoji}>📦</Text>
                <Text style={styles.storeLogoText}>Jumia</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={Colors.text.secondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search pantry items..."
            placeholderTextColor={Colors.text.secondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total Items</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: '#EF4444' }]}>
              {stats.expiringSoon}
            </Text>
            <Text style={styles.statLabel}>Expiring Soon</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: '#10B981' }]}>
              {stats.fresh}
            </Text>
            <Text style={styles.statLabel}>Fresh</Text>
          </View>
        </View>

        {/* Pantry Items */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pantry Items</Text>
            <Text style={styles.sectionCount}>{sortedItems.length} items</Text>
          </View>
          
          {sortedItems.length > 0 ? (
            <View style={styles.itemsList}>
              {sortedItems.map(item => {
                const days = item.expiresOn 
                  ? differenceInDays(parseISO(item.expiresOn), new Date()) 
                  : 99;
                const expiryColor = getExpiryColor(days);
                
                return (
                  <TouchableOpacity 
                    key={item.id} 
                    style={styles.itemCard}
                    activeOpacity={0.7}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                  >
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemTitle}>{item.title}</Text>
                      <Text style={styles.itemQuantity}>
                        {item.qty} {item.unit}
                      </Text>
                    </View>
                    <View style={styles.itemRight}>
                      <View style={[styles.expiryChip, { backgroundColor: expiryColor + '20' }]}>
                        <Text style={[styles.expiryText, { color: expiryColor }]}>
                          {item.expiresOn 
                            ? (days <= 0 ? 'Expired' : days === 1 ? '1 day' : `${days} days`)
                            : 'No expiry'}
                        </Text>
                      </View>
                      <TouchableOpacity 
                        style={styles.itemMenu}
                        onPress={() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }}
                      >
                        <Ionicons name="ellipsis-vertical" size={18} color={Colors.text.secondary} />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="fridge-outline" size={48} color={Colors.text.secondary} />
              <Text style={styles.emptyText}>No items found</Text>
              <Text style={styles.emptySubtext}>
                {searchQuery ? 'Try a different search' : 'Add items to your pantry'}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smartShoppingCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  smartShoppingGradient: {
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    backgroundColor: '#5B63D3',
    padding: 20,
  },
  smartShoppingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  smartShoppingIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  smartShoppingText: {
    flex: 1,
  },
  smartShoppingTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 4,
  },
  smartShoppingSubtitle: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.95,
    marginBottom: 12,
    lineHeight: 18,
  },
  smartShoppingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  smartShoppingButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.white,
  },
  storeLogos: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    gap: 20,
  },
  storeLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  storeEmoji: {
    fontSize: 20,
  },
  storeLogoText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },
  storeDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  sectionCount: {
    fontSize: 14,
    color: Colors.text.secondary,
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
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  itemMenu: {
    padding: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  bottomSpacing: {
    height: 20,
  },
});
