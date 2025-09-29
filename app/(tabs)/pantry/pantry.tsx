import { Colors } from '@/constants/Colors';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { differenceInDays, parseISO, addDays } from 'date-fns';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    RefreshControl,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PantryAddModal from '../../../components/PantryAddModal';
import PantryItemActionsModal from '../../../components/PantryItemActionsModal';
import { PantryItem } from '../../../data/types';
import { track } from '../../../utils/analytics';
import { useAuth } from '../../../context/AuthContext';
import { pantryService, SupabasePantryItem } from '../../../services/pantryService';
import { supabase } from '../../../lib/supabase';

export default function PantryScreen() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<PantryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [actionsModal, setActionsModal] = useState<{
    visible: boolean;
    item: PantryItem | null;
  }>({ visible: false, item: null });

  // Load pantry items from Supabase
  const loadPantryItems = useCallback(async () => {
    if (!user) return;
    
    try {
      const supabaseItems = await pantryService.getPantryItems();
      const convertedItems = supabaseItems.map(item => pantryService.convertToLocalFormat(item));
      setItems(convertedItems);
    } catch (error) {
      console.error('Error loading pantry items:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;
    
    // Set user ID for pantry service
    pantryService.setUserId(user.id);
    
    // Initial load
    loadPantryItems();
    
    // Subscribe to real-time changes
    const subscription = pantryService.subscribeToChanges((payload) => {
      console.log('Pantry change detected:', payload);
      loadPantryItems(); // Reload on any change
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [user, loadPantryItems]);

  // Handle pull to refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadPantryItems();
  }, [loadPantryItems]);

  // Sort items by expiry date
  const sortedItems = useMemo(() => {
    let filtered = [...items];
    
    if (searchQuery) {
      filtered = filtered.filter(item =>
        (item.title || item.name || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered.sort((a, b) => {
      const ad = a.expiresOn || a.expiryDate ? parseISO(a.expiresOn || a.expiryDate!) : undefined;
      const bd = b.expiresOn || b.expiryDate ? parseISO(b.expiresOn || b.expiryDate!) : undefined;
      if (ad && bd) return ad.getTime() - bd.getTime();
      if (ad) return -1;
      if (bd) return 1;
      return (a.title || a.name || '').localeCompare(b.title || b.name || '');
    });
  }, [items, searchQuery]);

  const getExpiryColor = (days: number) => {
    if (days <= 2) return '#EF4444';
    if (days <= 5) return '#F59E0B';
    return '#10B981';
  };

  const stats = useMemo(() => {
    const expiringSoon = items.filter(it => {
      const expiryDate = it.expiresOn || it.expiryDate;
      if (!expiryDate) return false;
      const days = differenceInDays(parseISO(expiryDate), new Date());
      return days <= 2;
    }).length;

    const fresh = items.filter(it => {
      const expiryDate = it.expiresOn || it.expiryDate;
      if (!expiryDate) return true;
      const days = differenceInDays(parseISO(expiryDate), new Date());
      return days > 5;
    }).length;

    return { total: items.length, expiringSoon, fresh };
  }, [items]);

  const handleSmartShopping = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    track('smart_shopping_opened', {});
    router.push('/(tabs)/pantry/smart-shopping' as any);
  };

  const handleAddItems = async (newItems: PantryItem[]) => {
    if (!user) {
      Alert.alert('Sign In Required', 'Please sign in to manage your pantry');
      return;
    }

    try {
      const supabaseItems = newItems.map(item => pantryService.convertToSupabaseFormat(item));
      await pantryService.addMultiplePantryItems(supabaseItems);
      track('pantry_items_added', { count: newItems.length });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      // Real-time subscription will update the list automatically
    } catch (error) {
      console.error('Error adding items:', error);
      Alert.alert('Error', 'Failed to add items to pantry');
    }
  };

  const handleItemActions = (item: PantryItem) => {
    setActionsModal({ visible: true, item });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleEditItem = async (item: PantryItem, updates: Partial<PantryItem>) => {
    if (!user) return;
    
    try {
      const supabaseUpdates = pantryService.convertToSupabaseFormat(updates);
      await pantryService.updatePantryItem(item.id, supabaseUpdates);
      track('pantry_item_edited', { itemName: item.title || item.name });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Error updating item:', error);
      Alert.alert('Error', 'Failed to update item');
    }
  };

  const handleDeleteItem = async (item: PantryItem) => {
    if (!user) return;
    
    try {
      await pantryService.deletePantryItem(item.id);
      track('pantry_item_deleted', { itemName: item.title || item.name });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Error deleting item:', error);
      Alert.alert('Error', 'Failed to delete item');
    }
  };

  const handlePinItem = async (item: PantryItem) => {
    if (!user) return;
    
    try {
      await pantryService.togglePinStatus(item.id);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.error('Error toggling pin:', error);
    }
  };

  const handleMarkLowStock = async (item: PantryItem) => {
    if (!user) return;
    
    try {
      await pantryService.toggleLowStockStatus(item.id);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.error('Error toggling low stock:', error);
    }
  };

  // Show loading state
  if (authLoading || (user && loading)) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading your pantry...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show auth gate if not logged in
  if (!user) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.authGateContainer}>
          <View style={styles.authIconContainer}>
            <MaterialCommunityIcons name="fridge-outline" size={80} color={Colors.primary} />
          </View>
          <Text style={styles.authTitle}>Your Personal Pantry</Text>
          <Text style={styles.authSubtitle}>
            Sign in to manage your ingredients, track expiry dates, and use AI scanning
          </Text>
          
          <View style={styles.authFeatures}>
            <View style={styles.authFeature}>
              <Ionicons name="camera" size={24} color={Colors.primary} />
              <Text style={styles.authFeatureText}>AI-powered grocery scanning</Text>
            </View>
            <View style={styles.authFeature}>
              <Ionicons name="sync" size={24} color={Colors.primary} />
              <Text style={styles.authFeatureText}>Real-time sync across devices</Text>
            </View>
            <View style={styles.authFeature}>
              <Ionicons name="notifications" size={24} color={Colors.primary} />
              <Text style={styles.authFeatureText}>Expiry date alerts</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.signInButton}
            onPress={() => router.push('/auth/signin')}
          >
            <Text style={styles.signInButtonText}>Sign In to Continue</Text>
            <Ionicons name="arrow-forward" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
      >
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
              setShowAddModal(true);
              track('pantry_add_modal_opened', {});
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
                const expiryDate = item.expiresOn || item.expiryDate;
                const days = expiryDate ? differenceInDays(parseISO(expiryDate), new Date()) : 99;
                const expiryColor = getExpiryColor(days);
                
                return (
                  <TouchableOpacity 
                    key={item.id} 
                    style={[
                      styles.itemCard,
                      item.isPinned && styles.pinnedItem,
                      item.isLowStock && styles.lowStockItem,
                    ]}
                    activeOpacity={0.7}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                  >
                    <View style={styles.itemInfo}>
                      <View style={styles.itemTitleRow}>
                        <Text style={styles.itemTitle}>{item.title || item.name}</Text>
                        {item.isPinned && (
                          <Ionicons name="bookmark" size={16} color={Colors.primary} />
                        )}
                      </View>
                      <Text style={styles.itemQuantity}>
                        {item.qty || item.quantity} {item.unit}
                        {item.isLowStock && (
                          <Text style={styles.lowStockText}> • Low Stock</Text>
                        )}
                      </Text>
                    </View>
                    <View style={styles.itemRight}>
                      <View style={[styles.expiryChip, { backgroundColor: expiryColor + '20' }]}>
                        <Text style={[styles.expiryText, { color: expiryColor }]}>
                          {expiryDate 
                            ? (days <= 0 ? 'Expired' : days === 1 ? '1 day' : `${days} days`)
                            : 'No expiry'}
                        </Text>
                      </View>
                      <TouchableOpacity 
                        style={styles.itemMenu}
                        onPress={() => handleItemActions(item)}
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

      {/* Modals */}
      <PantryAddModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddItems={handleAddItems}
      />

      <PantryItemActionsModal
        visible={actionsModal.visible}
        item={actionsModal.item}
        onClose={() => setActionsModal({ visible: false, item: null })}
        onEdit={handleEditItem}
        onDelete={handleDeleteItem}
        onPin={handlePinItem}
        onMarkLowStock={handleMarkLowStock}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.text.secondary,
  },
  authGateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  authIconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  authTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  authSubtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  authFeatures: {
    width: '100%',
    marginBottom: 32,
  },
  authFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 16,
  },
  authFeatureText: {
    fontSize: 15,
    color: Colors.text.primary,
    flex: 1,
  },
  signInButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    gap: 8,
    width: '100%',
  },
  signInButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
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
  itemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    flex: 1,
  },
  itemQuantity: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  lowStockText: {
    color: '#F59E0B',
    fontWeight: '600',
  },
  pinnedItem: {
    borderColor: Colors.primary,
    borderWidth: 1,
  },
  lowStockItem: {
    borderColor: '#F59E0B',
    borderWidth: 1,
    backgroundColor: '#FEF3C7',
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
