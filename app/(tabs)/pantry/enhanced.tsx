import { Colors } from '@/constants/Colors';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { differenceInDays, parseISO } from 'date-fns';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { pantry as seedPantry } from '../../../data/seed';
import { track } from '../../../utils/analytics';
import Dialog from '@/components/Dialog';
import { useDialog } from '@/hooks/useDialog';

const { width } = Dimensions.get('window');

interface PantryItem {
  id: string;
  title: string;
  qty: number;
  unit: string;
  expiresOn?: string;
  category?: string;
  price?: number;
}

interface ShoppingItem extends PantryItem {
  checked: boolean;
  store?: 'carrefour' | 'jumia';
  storePrice?: number;
  imageUrl?: string;
}

// Mock prices from stores
const STORE_PRICES = {
  carrefour: {
    'tomatoes': { price: 45, unit: 'kg', image: 'https://example.com/tomato.jpg' },
    'onions': { price: 35, unit: 'kg', image: 'https://example.com/onion.jpg' },
    'garlic': { price: 150, unit: 'kg', image: 'https://example.com/garlic.jpg' },
    'chicken': { price: 320, unit: 'kg', image: 'https://example.com/chicken.jpg' },
    'beef': { price: 550, unit: 'kg', image: 'https://example.com/beef.jpg' },
    'rice': { price: 180, unit: 'kg', image: 'https://example.com/rice.jpg' },
    'milk': { price: 65, unit: 'liter', image: 'https://example.com/milk.jpg' },
    'bread': { price: 55, unit: 'loaf', image: 'https://example.com/bread.jpg' },
    'eggs': { price: 18, unit: 'piece', image: 'https://example.com/eggs.jpg' },
  },
  jumia: {
    'tomatoes': { price: 48, unit: 'kg', image: 'https://example.com/tomato.jpg' },
    'onions': { price: 38, unit: 'kg', image: 'https://example.com/onion.jpg' },
    'garlic': { price: 160, unit: 'kg', image: 'https://example.com/garlic.jpg' },
    'chicken': { price: 310, unit: 'kg', image: 'https://example.com/chicken.jpg' },
    'beef': { price: 580, unit: 'kg', image: 'https://example.com/beef.jpg' },
    'rice': { price: 175, unit: 'kg', image: 'https://example.com/rice.jpg' },
    'milk': { price: 68, unit: 'liter', image: 'https://example.com/milk.jpg' },
    'bread': { price: 58, unit: 'loaf', image: 'https://example.com/bread.jpg' },
    'eggs': { price: 20, unit: 'piece', image: 'https://example.com/eggs.jpg' },
  }
};

export default function EnhancedPantryScreen() {
  const router = useRouter();
  const [items, setItems] = useState<PantryItem[]>(seedPantry);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [editingItem, setEditingItem] = useState<PantryItem | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showShoppingModal, setShowShoppingModal] = useState(false);
  const [selectedStore, setSelectedStore] = useState<'carrefour' | 'jumia'>('carrefour');
  const [isLoadingPrices, setIsLoadingPrices] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { dialog, showDialog, hideDialog,showErrorDialog,showSuccessDialog,showWarningDialog } = useDialog();
  // Form states for add/edit
  const [formTitle, setFormTitle] = useState('');
  const [formQty, setFormQty] = useState('');
  const [formUnit, setFormUnit] = useState('');
  const [formExpiresOn, setFormExpiresOn] = useState('');
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;

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

  const savePantryItems = async (newItems: PantryItem[]) => {
    try {
      await AsyncStorage.setItem('pantry_items', JSON.stringify(newItems));
      setItems(newItems);
    } catch (error) {
      console.error('Error saving pantry items:', error);
    }
  };

  const handleEdit = (item: PantryItem) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormQty(item.qty.toString());
    setFormUnit(item.unit);
    setFormExpiresOn(item.expiresOn || '');
    setShowEditModal(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleDelete = (itemId: string) => {
      showWarningDialog('Delete Item', 'Are you sure you want to delete this item?', );
    // Alert.alert(
    //   'Delete Item',
    //   'Are you sure you want to delete this item?',
    //   [
    //     { text: 'Cancel', style: 'cancel' },
    //     {
    //       text: 'Delete',
    //       style: 'destructive',
    //       onPress: () => {
    //         const newItems = items.filter(item => item.id !== itemId);
    //         savePantryItems(newItems);
    //         Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    //         track('pantry_item_deleted');
    //       }
    //     }
    //   ]
    // );
  };

  const handleSaveEdit = () => {
    if (!formTitle.trim() || !formQty.trim() || !formUnit.trim()) {
      showErrorDialog('Error', 'Please fill in all required fields');
      return;
    }

    const updatedItems = items.map(item => {
      if (item.id === editingItem?.id) {
        return {
          ...item,
          title: formTitle,
          qty: parseFloat(formQty) || 0,
          unit: formUnit,
          expiresOn: formExpiresOn || undefined,
        };
      }
      return item;
    });

    savePantryItems(updatedItems);
    setShowEditModal(false);
    setEditingItem(null);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    track('pantry_item_edited');
  };

  const handleAddItem = () => {
    if (!formTitle.trim() || !formQty.trim() || !formUnit.trim()) {
      showErrorDialog('Error', 'Please fill in all required fields');
      return;
    }

    const newItem: PantryItem = {
      id: Date.now().toString(),
      title: formTitle,
      qty: parseFloat(formQty) || 0,
      unit: formUnit,
      expiresOn: formExpiresOn || undefined,
    };

    savePantryItems([...items, newItem]);
    setShowAddModal(false);
    resetForm();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    track('pantry_item_added');
  };

  const resetForm = () => {
    setFormTitle('');
    setFormQty('');
    setFormUnit('');
    setFormExpiresOn('');
  };

  const addToShoppingList = (item: PantryItem) => {
    const itemName = item.title.toLowerCase();
    const carrefourPrice = STORE_PRICES.carrefour[itemName];
    const jumiaPrice = STORE_PRICES.jumia[itemName];
    
    const shoppingItem: ShoppingItem = {
      ...item,
      checked: false,
      storePrice: selectedStore === 'carrefour' ? carrefourPrice?.price : jumiaPrice?.price,
      store: selectedStore,
      imageUrl: selectedStore === 'carrefour' ? carrefourPrice?.image : jumiaPrice?.image,
    };

    setShoppingList(prev => [...prev, shoppingItem]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    track('item_added_to_shopping_list', { item: item.title, store: selectedStore });
  };

  const removeFromShoppingList = (itemId: string) => {
    setShoppingList(prev => prev.filter(item => item.id !== itemId));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const toggleShoppingItem = (itemId: string) => {
    setShoppingList(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, checked: !item.checked } : item
      )
    );
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const calculateTotal = () => {
    return shoppingList.reduce((total, item) => {
      return total + ((item.storePrice || 0) * item.qty);
    }, 0);
  };

  const handleCheckout = () => {
    const total = calculateTotal();
    const itemsList = shoppingList.map(item => `${item.title} (${item.qty} ${item.unit})`).join(', ');
    
    Alert.alert(
      'Checkout',
      `Total: KES ${total.toFixed(2)}\n\nItems: ${itemsList}\n\nProceed to ${selectedStore === 'carrefour' ? 'Carrefour' : 'Jumia'} checkout?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Proceed',
          onPress: () => {
            // In a real app, this would integrate with the store's API
            const storeUrl = selectedStore === 'carrefour' 
              ? 'https://www.carrefour.ke' 
              : 'https://www.jumia.ke';
            
            Linking.openURL(storeUrl);
            track('checkout_initiated', { store: selectedStore, total, itemCount: shoppingList.length });
          }
        }
      ]
    );
  };

  const filteredItems = sorted.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Pantry</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              style={styles.headerButton} 
              onPress={() => setShowShoppingModal(true)}
            >
              <View style={styles.badgeContainer}>
                <Ionicons name="cart" size={24} color={Colors.primary} />
                {shoppingList.length > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{shoppingList.length}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.addButton} 
              onPress={() => {
                resetForm();
                setShowAddModal(true);
              }}
            >
              <Ionicons name="add" size={24} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={Colors.gray[400]} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search pantry items..."
            placeholderTextColor={Colors.gray[400]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
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

        {/* Community Recipes Card */}
        <TouchableOpacity 
          style={styles.communityCard}
          onPress={() => router.push('/community')}
          activeOpacity={0.95}
        >
          <View style={styles.communityCardContent}>
            <View style={styles.communityIconContainer}>
              <MaterialCommunityIcons name="chef-hat" size={48} color={Colors.white} />
            </View>
            <View style={styles.communityCardText}>
              <Text style={styles.communityCardTitle}>TikTok Recipes</Text>
              <Text style={styles.communityCardSubtitle}>Viral recipes from Kenyan creators</Text>
              <View style={styles.communityCardButton}>
                <Text style={styles.communityCardButtonText}>Explore Recipes</Text>
                <MaterialCommunityIcons name="music-note" size={20} color={Colors.primary} />
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* Quick Shopping Section */}
        <View style={styles.quickShoppingSection}>
          <Text style={styles.sectionTitle}>Quick Shopping</Text>
          <View style={styles.storeButtons}>
            <TouchableOpacity 
              style={[
                styles.storeButton, 
                selectedStore === 'carrefour' && styles.storeButtonActive
              ]}
              onPress={() => setSelectedStore('carrefour')}
            >
              <Text style={[
                styles.storeButtonText,
                selectedStore === 'carrefour' && styles.storeButtonTextActive
              ]}>Carrefour</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.storeButton, 
                selectedStore === 'jumia' && styles.storeButtonActive
              ]}
              onPress={() => setSelectedStore('jumia')}
            >
              <Text style={[
                styles.storeButtonText,
                selectedStore === 'jumia' && styles.storeButtonTextActive
              ]}>Jumia</Text>
            </TouchableOpacity>
          </View>
        </View>

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
            {filteredItems.map(it => {
              const days = it.expiresOn ? differenceInDays(parseISO(it.expiresOn), new Date()) : 99;
              const expiryColor = getExpiryColor(days);
              const isInShoppingList = shoppingList.some(item => item.id === it.id);
              
              return (
                <View key={it.id} style={styles.itemCard}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemTitle}>{it.title}</Text>
                    <Text style={styles.itemQuantity}>{it.qty} {it.unit}</Text>
                  </View>
                  <View style={styles.itemActions}>
                    <View style={[styles.expiryChip, { backgroundColor: expiryColor + '20' }]}>
                      <Text style={[styles.expiryText, { color: expiryColor }]}>
                        {it.expiresOn ? (days <= 0 ? 'Expired' : `${days} days`) : 'No expiry'}
                      </Text>
                    </View>
                    <View style={styles.actionButtons}>
                      <TouchableOpacity 
                        onPress={() => addToShoppingList(it)}
                        disabled={isInShoppingList}
                        style={[styles.iconButton, isInShoppingList && styles.iconButtonDisabled]}
                      >
                        <Ionicons 
                          name={isInShoppingList ? "checkmark-circle" : "cart-outline"} 
                          size={20} 
                          color={isInShoppingList ? Colors.success : Colors.primary} 
                        />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleEdit(it)} style={styles.iconButton}>
                        <Ionicons name="pencil" size={18} color={Colors.gray[600]} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDelete(it.id)} style={styles.iconButton}>
                        <Ionicons name="trash-outline" size={18} color={Colors.error} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Item</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Item name"
              value={formTitle}
              onChangeText={setFormTitle}
            />
            
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Quantity"
                value={formQty}
                onChangeText={setFormQty}
                keyboardType="numeric"
              />
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Unit (kg, L, pcs)"
                value={formUnit}
                onChangeText={setFormUnit}
              />
            </View>
            
            <TextInput
              style={styles.input}
              placeholder="Expiry date (YYYY-MM-DD)"
              value={formExpiresOn}
              onChangeText={setFormExpiresOn}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]} 
                onPress={handleSaveEdit}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Item</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Item name"
              value={formTitle}
              onChangeText={setFormTitle}
            />
            
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Quantity"
                value={formQty}
                onChangeText={setFormQty}
                keyboardType="numeric"
              />
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Unit (kg, L, pcs)"
                value={formUnit}
                onChangeText={setFormUnit}
              />
            </View>
            
            <TextInput
              style={styles.input}
              placeholder="Expiry date (YYYY-MM-DD) - Optional"
              value={formExpiresOn}
              onChangeText={setFormExpiresOn}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]} 
                onPress={handleAddItem}
              >
                <Text style={styles.saveButtonText}>Add Item</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Shopping List Modal */}
      <Modal
        visible={showShoppingModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowShoppingModal(false)}
      >
        <SafeAreaView style={styles.shoppingModal}>
          <View style={styles.shoppingHeader}>
            <TouchableOpacity onPress={() => setShowShoppingModal(false)}>
              <Ionicons name="close" size={28} color={Colors.text.primary} />
            </TouchableOpacity>
            <Text style={styles.shoppingTitle}>Shopping List</Text>
            <View style={styles.storeBadge}>
              <Text style={styles.storeBadgeText}>{selectedStore}</Text>
            </View>
          </View>

          {shoppingList.length === 0 ? (
            <View style={styles.emptyShoppingList}>
              <Ionicons name="cart-outline" size={64} color={Colors.gray[400]} />
              <Text style={styles.emptyText}>Your shopping list is empty</Text>
              <Text style={styles.emptySubtext}>Add items from your pantry to get started</Text>
            </View>
          ) : (
            <>
              <FlatList
                data={shoppingList}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <View style={styles.shoppingItem}>
                    <TouchableOpacity
                      onPress={() => toggleShoppingItem(item.id)}
                      style={styles.checkboxContainer}
                    >
                      <Ionicons
                        name={item.checked ? "checkbox" : "square-outline"}
                        size={24}
                        color={item.checked ? Colors.success : Colors.gray[400]}
                      />
                    </TouchableOpacity>
                    
                    <View style={styles.shoppingItemInfo}>
                      <Text style={[
                        styles.shoppingItemTitle,
                        item.checked && styles.checkedText
                      ]}>
                        {item.title}
                      </Text>
                      <Text style={styles.shoppingItemQty}>
                        {item.qty} {item.unit}
                      </Text>
                    </View>
                    
                    <View style={styles.priceContainer}>
                      <Text style={styles.priceText}>
                        KES {((item.storePrice || 0) * item.qty).toFixed(2)}
                      </Text>
                      {item.storePrice && (
                        <Text style={styles.unitPrice}>
                          @ {item.storePrice}/{item.unit}
                        </Text>
                      )}
                    </View>
                    
                    <TouchableOpacity
                      onPress={() => removeFromShoppingList(item.id)}
                      style={styles.removeButton}
                    >
                      <Ionicons name="close-circle" size={24} color={Colors.error} />
                    </TouchableOpacity>
                  </View>
                )}
                style={styles.shoppingList}
              />
              
              <View style={styles.checkoutContainer}>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalAmount}>KES {calculateTotal().toFixed(2)}</Text>
                </View>
                <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                  <Text style={styles.checkoutButtonText}>
                    Checkout with {selectedStore === 'carrefour' ? 'Carrefour' : 'Jumia'}
                  </Text>
                  <Ionicons name="arrow-forward" size={20} color={Colors.white} />
                </TouchableOpacity>
              </View>
            </>
          )}
        </SafeAreaView>
      </Modal>
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
  headerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    padding: 8,
  },
  badgeContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: Colors.error,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    height: 48,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
  },
  aiCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
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
  
  // Community Card Styles
  communityCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#FF6B6B',
  },
  communityCardContent: {
    flexDirection: 'row',
    padding: 20,
    gap: 16,
  },
  communityIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  communityCardText: {
    flex: 1,
    justifyContent: 'center',
  },
  communityCardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 4,
  },
  communityCardSubtitle: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.9,
    marginBottom: 12,
  },
  communityCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 8,
  },
  communityCardButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  quickShoppingSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  storeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  storeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  storeButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryMuted,
  },
  storeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  storeButtonTextActive: {
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
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    padding: 6,
  },
  iconButtonDisabled: {
    opacity: 0.5,
  },
  bottomSpacing: {
    height: 20,
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    width: width - 40,
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
    color: Colors.text.primary,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.surface,
  },
  saveButton: {
    backgroundColor: Colors.primary,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  
  // Shopping Modal Styles
  shoppingModal: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  shoppingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  shoppingTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  storeBadge: {
    backgroundColor: Colors.primaryMuted,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  storeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
    textTransform: 'uppercase',
  },
  emptyShoppingList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 8,
  },
  shoppingList: {
    flex: 1,
  },
  shoppingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  checkboxContainer: {
    marginRight: 12,
  },
  shoppingItemInfo: {
    flex: 1,
  },
  shoppingItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  checkedText: {
    textDecorationLine: 'line-through',
    color: Colors.text.tertiary,
  },
  shoppingItemQty: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  priceContainer: {
    alignItems: 'flex-end',
    marginRight: 12,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  unitPrice: {
    fontSize: 12,
    color: Colors.text.tertiary,
  },
  removeButton: {
    padding: 4,
  },
  checkoutContainer: {
    backgroundColor: Colors.white,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
  },
  checkoutButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
});
