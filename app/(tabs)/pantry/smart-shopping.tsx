import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Linking,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import * as Haptics from 'expo-haptics';
import { track } from '../../../utils/analytics';
import { debounce } from 'lodash';

// Store configurations
const STORES = {
  carrefour: {
    name: 'Carrefour',
    icon: '🛒',
    color: '#004B93',
    baseUrl: 'https://www.carrefour.ke',
    searchUrl: 'https://www.carrefour.ke/search?query=',
  },
  jumia: {
    name: 'Jumia',
    icon: '📦',
    color: '#F68B1E',
    baseUrl: 'https://www.jumia.co.ke',
    searchUrl: 'https://www.jumia.co.ke/catalog/?q=',
  },
};

// Mock product database with real Kenyan prices (KES)
const PRODUCT_DATABASE = {
  'milk': [
    { store: 'carrefour', name: 'Brookside Fresh Milk 500ml', price: 65, image: 'https://cdn.shopify.com/s/files/1/0548/8199/7831/products/milk.jpg', unit: '500ml', inStock: true },
    { store: 'carrefour', name: 'Brookside Fresh Milk 1L', price: 120, image: 'https://cdn.shopify.com/s/files/1/0548/8199/7831/products/milk1l.jpg', unit: '1L', inStock: true },
    { store: 'jumia', name: 'KCC Fresh Milk 500ml', price: 60, image: 'https://ke.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/milk.jpg', unit: '500ml', inStock: true },
    { store: 'jumia', name: 'Tuzo Milk 1L', price: 115, image: 'https://ke.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/tuzo.jpg', unit: '1L', inStock: true },
  ],
  'bread': [
    { store: 'carrefour', name: 'Supa Loaf White Bread', price: 55, image: 'https://cdn.shopify.com/s/files/1/0548/8199/7831/products/bread.jpg', unit: '400g', inStock: true },
    { store: 'carrefour', name: 'Festive Brown Bread', price: 60, image: 'https://cdn.shopify.com/s/files/1/0548/8199/7831/products/brown.jpg', unit: '400g', inStock: true },
    { store: 'jumia', name: 'Elliotts White Bread', price: 52, image: 'https://ke.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/bread.jpg', unit: '400g', inStock: true },
  ],
  'eggs': [
    { store: 'carrefour', name: 'Kenchic Eggs Tray', price: 360, image: 'https://cdn.shopify.com/s/files/1/0548/8199/7831/products/eggs.jpg', unit: '30 eggs', inStock: true },
    { store: 'jumia', name: 'Fresh Eggs Tray', price: 340, image: 'https://ke.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/eggs.jpg', unit: '30 eggs', inStock: true },
  ],
  'rice': [
    { store: 'carrefour', name: 'Daawat Basmati Rice', price: 380, image: 'https://cdn.shopify.com/s/files/1/0548/8199/7831/products/rice.jpg', unit: '2kg', inStock: true },
    { store: 'jumia', name: 'Pishori Rice', price: 350, image: 'https://ke.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/rice.jpg', unit: '2kg', inStock: true },
  ],
  'sugar': [
    { store: 'carrefour', name: 'Kabras Sugar', price: 145, image: 'https://cdn.shopify.com/s/files/1/0548/8199/7831/products/sugar.jpg', unit: '1kg', inStock: true },
    { store: 'jumia', name: 'Mumias Sugar', price: 140, image: 'https://ke.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/sugar.jpg', unit: '1kg', inStock: true },
  ],
  'cooking oil': [
    { store: 'carrefour', name: 'Fresh Fri Cooking Oil', price: 380, image: 'https://cdn.shopify.com/s/files/1/0548/8199/7831/products/oil.jpg', unit: '2L', inStock: true },
    { store: 'jumia', name: 'Rina Cooking Oil', price: 365, image: 'https://ke.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/oil.jpg', unit: '2L', inStock: true },
  ],
  'tomatoes': [
    { store: 'carrefour', name: 'Fresh Tomatoes', price: 80, image: 'https://cdn.shopify.com/s/files/1/0548/8199/7831/products/tomatoes.jpg', unit: '1kg', inStock: true },
    { store: 'jumia', name: 'Organic Tomatoes', price: 95, image: 'https://ke.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/tomatoes.jpg', unit: '1kg', inStock: false },
  ],
  'onions': [
    { store: 'carrefour', name: 'Red Onions', price: 65, image: 'https://cdn.shopify.com/s/files/1/0548/8199/7831/products/onions.jpg', unit: '1kg', inStock: true },
    { store: 'jumia', name: 'White Onions', price: 70, image: 'https://ke.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/onions.jpg', unit: '1kg', inStock: true },
  ],
  'potatoes': [
    { store: 'carrefour', name: 'Fresh Potatoes', price: 85, image: 'https://cdn.shopify.com/s/files/1/0548/8199/7831/products/potatoes.jpg', unit: '1kg', inStock: true },
    { store: 'jumia', name: 'Irish Potatoes', price: 90, image: 'https://ke.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/potatoes.jpg', unit: '1kg', inStock: true },
  ],
  'chicken': [
    { store: 'carrefour', name: 'Kenchic Chicken Whole', price: 550, image: 'https://cdn.shopify.com/s/files/1/0548/8199/7831/products/chicken.jpg', unit: '1.2kg', inStock: true },
    { store: 'jumia', name: 'Fresh Chicken', price: 520, image: 'https://ke.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/chicken.jpg', unit: '1kg', inStock: true },
  ],
  'beef': [
    { store: 'carrefour', name: 'Prime Beef Cubes', price: 650, image: 'https://cdn.shopify.com/s/files/1/0548/8199/7831/products/beef.jpg', unit: '1kg', inStock: true },
    { store: 'jumia', name: 'Beef Mince', price: 580, image: 'https://ke.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/beef.jpg', unit: '1kg', inStock: true },
  ],
  'flour': [
    { store: 'carrefour', name: 'EXE All Purpose Flour', price: 135, image: 'https://cdn.shopify.com/s/files/1/0548/8199/7831/products/flour.jpg', unit: '2kg', inStock: true },
    { store: 'jumia', name: 'Jogoo Maize Flour', price: 125, image: 'https://ke.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/flour.jpg', unit: '2kg', inStock: true },
  ],
};

interface Product {
  store: string;
  name: string;
  price: number;
  image: string;
  unit: string;
  inStock: boolean;
}

interface ShoppingItem {
  id: string;
  query: string;
  products: Product[];
  selectedProduct?: Product;
  quantity: number;
}

export default function SmartShoppingPantry() {
  const [searchQuery, setSearchQuery] = useState('');
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [selectedStore, setSelectedStore] = useState<'all' | 'carrefour' | 'jumia'>('all');
  const [isSearching, setIsSearching] = useState(false);
  const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Smart search function
  const searchProducts = useCallback((query: string): Product[] => {
    const normalizedQuery = query.toLowerCase().trim();
    let results: Product[] = [];
    
    // Direct match
    if (PRODUCT_DATABASE[normalizedQuery]) {
      results = PRODUCT_DATABASE[normalizedQuery];
    } else {
      // Fuzzy search
      Object.entries(PRODUCT_DATABASE).forEach(([key, products]) => {
        if (key.includes(normalizedQuery) || normalizedQuery.includes(key)) {
          results.push(...products);
        }
      });
    }
    
    // Filter by selected store
    if (selectedStore !== 'all') {
      results = results.filter(p => p.store === selectedStore);
    }
    
    return results;
  }, [selectedStore]);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query.length > 1) {
        setIsSearching(true);
        const products = searchProducts(query);
        
        if (products.length > 0) {
          const newItem: ShoppingItem = {
            id: Date.now().toString(),
            query,
            products,
            selectedProduct: products[0],
            quantity: 1,
          };
          setShoppingList(prev => [...prev, newItem]);
          setSearchQuery('');
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          track('smart_search_success', { query, resultCount: products.length });
        } else {
          Alert.alert('No products found', `Try searching for: milk, bread, eggs, rice, chicken, etc.`);
        }
        setIsSearching(false);
      }
    }, 500),
    [searchProducts]
  );

  // Auto-suggestions
  useEffect(() => {
    if (searchQuery.length > 0) {
      const allKeys = Object.keys(PRODUCT_DATABASE);
      const filtered = allKeys.filter(key => 
        key.includes(searchQuery.toLowerCase())
      ).slice(0, 3);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const handleAddItem = () => {
    if (searchQuery.trim()) {
      debouncedSearch(searchQuery);
    }
  };

  const selectProduct = (itemId: string, product: Product) => {
    setShoppingList(prev => prev.map(item => 
      item.id === itemId ? { ...item, selectedProduct: product } : item
    ));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity > 0) {
      setShoppingList(prev => prev.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      ));
    }
  };

  const removeItem = (itemId: string) => {
    setShoppingList(prev => prev.filter(item => item.id !== itemId));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const getTotalPrice = () => {
    return shoppingList.reduce((total, item) => {
      if (item.selectedProduct) {
        return total + (item.selectedProduct.price * item.quantity);
      }
      return total;
    }, 0);
  };

  const handleCheckout = (store: 'carrefour' | 'jumia') => {
    const items = shoppingList.filter(item => 
      item.selectedProduct?.store === store
    );
    
    if (items.length === 0) {
      Alert.alert('No items', `No items selected from ${STORES[store].name}`);
      return;
    }

    const searchTerms = items.map(item => item.query).join('+');
    const url = STORES[store].searchUrl + searchTerms;
    
    Linking.openURL(url);
    track('checkout_initiated', { store, itemCount: items.length });
  };

  const renderShoppingItem = ({ item }: { item: ShoppingItem }) => (
    <View style={styles.shoppingItem}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemQuery}>{item.query}</Text>
        <TouchableOpacity onPress={() => removeItem(item.id)}>
          <Ionicons name="close-circle" size={24} color="#EF4444" />
        </TouchableOpacity>
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productScroll}>
        {item.products.map((product, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.productCard,
              item.selectedProduct === product && styles.selectedProduct,
              !product.inStock && styles.outOfStock,
            ]}
            onPress={() => selectProduct(item.id, product)}
            disabled={!product.inStock}
          >
            <Image source={{ uri: product.image }} style={styles.productImage} />
            <View style={styles.storeTag} backgroundColor={STORES[product.store as keyof typeof STORES].color}>
              <Text style={styles.storeTagText}>{STORES[product.store as keyof typeof STORES].icon}</Text>
            </View>
            <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
            <Text style={styles.productUnit}>{product.unit}</Text>
            <Text style={styles.productPrice}>KES {product.price}</Text>
            {!product.inStock && (
              <View style={styles.outOfStockBadge}>
                <Text style={styles.outOfStockText}>Out of Stock</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <View style={styles.quantityControl}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.id, item.quantity - 1)}
        >
          <Ionicons name="remove" size={20} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.id, item.quantity + 1)}
        >
          <Ionicons name="add" size={20} color={Colors.text.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Smart Shopping 🛍️</Text>
            <Text style={styles.headerSubtitle}>Find best prices instantly</Text>
          </View>

          {/* Store Selector */}
          <View style={styles.storeSelector}>
            <TouchableOpacity
              style={[styles.storeButton, selectedStore === 'all' && styles.storeButtonActive]}
              onPress={() => setSelectedStore('all')}
            >
              <Text style={[styles.storeButtonText, selectedStore === 'all' && styles.storeButtonTextActive]}>
                All Stores
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.storeButton, selectedStore === 'carrefour' && styles.storeButtonActive]}
              onPress={() => setSelectedStore('carrefour')}
            >
              <Text style={[styles.storeButtonText, selectedStore === 'carrefour' && styles.storeButtonTextActive]}>
                🛒 Carrefour
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.storeButton, selectedStore === 'jumia' && styles.storeButtonActive]}
              onPress={() => setSelectedStore('jumia')}
            >
              <Text style={[styles.storeButtonText, selectedStore === 'jumia' && styles.storeButtonTextActive]}>
                📦 Jumia
              </Text>
            </TouchableOpacity>
          </View>

          {/* Search Input */}
          <View style={styles.searchSection}>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color={Colors.text.secondary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Type what you want to buy..."
                placeholderTextColor={Colors.text.secondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleAddItem}
                returnKeyType="search"
              />
              {isSearching ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : searchQuery.length > 0 ? (
                <TouchableOpacity onPress={handleAddItem}>
                  <Ionicons name="add-circle" size={24} color={Colors.primary} />
                </TouchableOpacity>
              ) : null}
            </View>
            
            {/* Suggestions */}
            {suggestions.length > 0 && (
              <View style={styles.suggestions}>
                {suggestions.map((suggestion, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionChip}
                    onPress={() => {
                      setSearchQuery(suggestion);
                      handleAddItem();
                    }}
                  >
                    <Text style={styles.suggestionText}>{suggestion}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Quick Add Buttons */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickAdd}>
            {['milk', 'bread', 'eggs', 'rice', 'chicken', 'tomatoes'].map(item => (
              <TouchableOpacity
                key={item}
                style={styles.quickAddButton}
                onPress={() => {
                  setSearchQuery(item);
                  debouncedSearch(item);
                }}
              >
                <Text style={styles.quickAddText}>+ {item}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Shopping List */}
          {shoppingList.length > 0 ? (
            <View style={styles.listContainer}>
              <Text style={styles.sectionTitle}>Your Shopping List</Text>
              <FlatList
                data={shoppingList}
                renderItem={renderShoppingItem}
                keyExtractor={item => item.id}
                scrollEnabled={false}
              />
            </View>
          ) : (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="cart-outline" size={64} color={Colors.text.secondary} />
              <Text style={styles.emptyText}>Start adding items to compare prices</Text>
              <Text style={styles.emptySubtext}>Type or tap quick add buttons above</Text>
            </View>
          )}

          {/* Price Summary */}
          {shoppingList.length > 0 && (
            <View style={styles.priceContainer}>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Total Estimate:</Text>
                <Text style={styles.priceValue}>KES {getTotalPrice().toLocaleString()}</Text>
              </View>
              
              <View style={styles.checkoutButtons}>
                <TouchableOpacity
                  style={[styles.checkoutButton, { backgroundColor: STORES.carrefour.color }]}
                  onPress={() => handleCheckout('carrefour')}
                >
                  <Text style={styles.checkoutButtonText}>Shop at Carrefour</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.checkoutButton, { backgroundColor: STORES.jumia.color }]}
                  onPress={() => handleCheckout('jumia')}
                >
                  <Text style={styles.checkoutButtonText}>Shop at Jumia</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  storeSelector: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  storeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center',
  },
  storeButtonActive: {
    backgroundColor: Colors.primary,
  },
  storeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  storeButtonTextActive: {
    color: Colors.white,
  },
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
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
  suggestions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  suggestionChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.primary + '20',
    borderRadius: 16,
  },
  suggestionText: {
    fontSize: 14,
    color: Colors.primary,
  },
  quickAdd: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  quickAddButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.primary + '15',
    borderRadius: 20,
    marginRight: 8,
  },
  quickAddText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  shoppingItem: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemQuery: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    textTransform: 'capitalize',
  },
  productScroll: {
    marginBottom: 12,
  },
  productCard: {
    width: 120,
    marginRight: 12,
    padding: 8,
    backgroundColor: Colors.background,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedProduct: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  outOfStock: {
    opacity: 0.5,
  },
  productImage: {
    width: '100%',
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
  },
  storeTag: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storeTagText: {
    fontSize: 16,
  },
  productName: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  productUnit: {
    fontSize: 11,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  outOfStockBadge: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -40 }, { translateY: -10 }],
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  outOfStockText: {
    fontSize: 10,
    color: Colors.white,
    fontWeight: '600',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
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
  priceContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: Colors.surface,
    borderRadius: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  priceLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  priceValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
  },
  checkoutButtons: {
    gap: 12,
  },
  checkoutButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
  },
});
