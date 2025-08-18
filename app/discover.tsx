import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

interface Recipe {
  id: string;
  title: string;
  time: string;
  calories: string;
  image: any;
  rating: number;
  reviews: number;
}

const trendingSearches = [
  'Healthy Breakfast',
  'Quick Dinner',
  'Vegan',
  'Pasta',
  'Salad',
  'Chicken',
  'Dessert',
  'Soup',
];

const popularRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Spaghetti Carbonara',
    time: '20 min',
    calories: '450 cal',
    image: require('@/assets/images/food-example.jpg'),
    rating: 4.8,
    reviews: 234,
  },
  {
    id: '2',
    title: 'Greek Salad',
    time: '15 min',
    calories: '280 cal',
    image: require('@/assets/images/food-example.jpg'),
    rating: 4.6,
    reviews: 189,
  },
  {
    id: '3',
    title: 'Chicken Tikka Masala',
    time: '45 min',
    calories: '520 cal',
    image: require('@/assets/images/food-example.jpg'),
    rating: 4.9,
    reviews: 567,
  },
  {
    id: '4',
    title: 'Mushroom Risotto',
    time: '35 min',
    calories: '380 cal',
    image: require('@/assets/images/food-example.jpg'),
    rating: 4.7,
    reviews: 145,
  },
];

const cuisineTypes = [
  { id: '1', name: 'Italian', emoji: '🇮🇹', color: '#FFE4E4' },
  { id: '2', name: 'Asian', emoji: '🥢', color: '#E4F4FF' },
  { id: '3', name: 'Mexican', emoji: '🌮', color: '#FFF4E4' },
  { id: '4', name: 'Indian', emoji: '🍛', color: '#FFE4F4' },
  { id: '5', name: 'American', emoji: '🍔', color: '#E4FFE4' },
  { id: '6', name: 'Mediterranean', emoji: '🥙', color: '#F4E4FF' },
];

export default function ExploreScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const renderTrendingItem = (item: string) => (
    <TouchableOpacity
      key={item}
      style={styles.trendingChip}
      onPress={() => setSearchQuery(item)}
    >
      <Ionicons name="trending-up" size={14} color={Colors.primary} />
      <Text style={styles.trendingText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderRecipeItem = ({ item }: { item: Recipe }) => (
    <TouchableOpacity style={styles.recipeItem} activeOpacity={0.9}>
      <Image source={item.image} style={styles.recipeItemImage} />
      <View style={styles.recipeItemInfo}>
        <Text style={styles.recipeItemTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.recipeItemMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={14} color={Colors.gray[500]} />
            <Text style={styles.metaText}>{item.time}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="flame-outline" size={14} color={Colors.gray[500]} />
            <Text style={styles.metaText}>{item.calories}</Text>
          </View>
        </View>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={14} color="#FFB800" />
          <Text style={styles.ratingText}>{item.rating}</Text>
          <Text style={styles.reviewsText}>({item.reviews} reviews)</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCuisineType = ({ item }: { item: typeof cuisineTypes[0] }) => (
    <TouchableOpacity
      style={[styles.cuisineCard, { backgroundColor: item.color }]}
      activeOpacity={0.8}
    >
      <Text style={styles.cuisineEmoji}>{item.emoji}</Text>
      <Text style={styles.cuisineName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
      >
        {/* Search Header */}
        <View style={styles.searchHeader}>
          <Text style={styles.headerTitle}>Discover</Text>
          <View style={styles.searchContainer}>
            <View style={[styles.searchBar, isSearchFocused && styles.searchBarFocused]}>
              <Ionicons name="search" size={20} color={Colors.gray[400]} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search recipes, ingredients..."
                placeholderTextColor={Colors.gray[400]}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={20} color={Colors.gray[400]} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Trending Searches */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trending Searches</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.trendingContainer}
            >
              {trendingSearches.map(renderTrendingItem)}
            </ScrollView>
          </View>

          {/* Cuisine Types */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Explore Cuisines</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See all</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={cuisineTypes}
              renderItem={renderCuisineType}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.cuisineList}
            />
          </View>

          {/* Popular Recipes */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Popular Recipes</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See all</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.recipeGrid}>
              {popularRecipes.map((recipe) => (
                <View key={recipe.id} style={styles.recipeItemWrapper}>
                  {renderRecipeItem({ item: recipe })}
                </View>
              ))}
            </View>
          </View>

          {/* Diet Plans */}
          <View style={styles.dietSection}>
            <Text style={styles.sectionTitle}>Diet Plans</Text>
            <TouchableOpacity style={styles.dietCard}>
              <View style={styles.dietCardContent}>
                <MaterialCommunityIcons name="food-apple" size={32} color={Colors.primary} />
                <View style={styles.dietCardText}>
                  <Text style={styles.dietCardTitle}>Personalized Meal Plans</Text>
                  <Text style={styles.dietCardSubtitle}>
                    Get custom meal plans based on your preferences
                  </Text>
                </View>
                <Ionicons name="arrow-forward" size={20} color={Colors.primary} />
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
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
  searchHeader: {
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  searchContainer: {
    width: '100%',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    gap: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  searchBarFocused: {
    borderColor: Colors.primary,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
  },
  section: {
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text.primary,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  trendingContainer: {
    paddingHorizontal: 20,
    gap: 10,
  },
  trendingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryMuted,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    marginRight: 10,
  },
  trendingText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  cuisineList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  cuisineCard: {
    width: 100,
    height: 100,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cuisineEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  cuisineName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  recipeGrid: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  recipeItemWrapper: {
    width: '48%',
    marginBottom: 16,
  },
  recipeItem: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  recipeItemImage: {
    width: '100%',
    height: 120,
  },
  recipeItemInfo: {
    padding: 12,
  },
  recipeItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  recipeItemMeta: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: Colors.text.tertiary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  reviewsText: {
    fontSize: 12,
    color: Colors.text.tertiary,
  },
  dietSection: {
    padding: 20,
  },
  dietCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dietCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  dietCardText: {
    flex: 1,
  },
  dietCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  dietCardSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
});
