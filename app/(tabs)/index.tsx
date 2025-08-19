import { Colors } from '@/constants/Colors';
import { Recipe } from '@/data/types';
import {
  getEnhancedFeaturedRecipes,
  getEnhancedMealsByTimeOfDay,
  getEnhancedQuickRecipes
} from '@/data/enhanced-recipes';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const categories = [
  { id: '1', name: 'All', icon: 'apps' },
  { id: '2', name: 'Breakfast', icon: 'sunny' },
  { id: '3', name: 'Lunch', icon: 'restaurant' },
  { id: '4', name: 'Dinner', icon: 'moon' },
  { id: '5', name: 'Kenyan', icon: 'flag' },
  { id: '6', name: 'Swahili', icon: 'boat' },
];

export default function HomeScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('1');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeBasedMeals, setTimeBasedMeals] = useState<Recipe[]>([]);
  const [featuredMeals, setFeaturedMeals] = useState<Recipe[]>([]);
  const [quickMeals, setQuickMeals] = useState<Recipe[]>([]);
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Get time-appropriate greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good Morning';
    if (hour >= 12 && hour < 17) return 'Good Afternoon';
    if (hour >= 17 && hour < 21) return 'Good Evening';
    return 'Good Night';
  };

  // Get meal type based on time
  const getMealType = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return 'Breakfast';
    if (hour >= 11 && hour < 16) return 'Lunch';
    return 'Dinner';
  };

  useEffect(() => {
    // Load all recipes and categories
    const loadRecipes = async () => {
      const { getAllEnhancedRecipes } = await import('@/data/enhanced-recipes');
      const all = getAllEnhancedRecipes();
      setAllRecipes(all);
      setFilteredRecipes(all);
      
      // Load time-based meals
      const meals = getEnhancedMealsByTimeOfDay();
      setTimeBasedMeals(meals);
      setFeaturedMeals(getEnhancedFeaturedRecipes());
      
      // Get quick meals (meals under 30 min)
      const quick = getEnhancedQuickRecipes().slice(0, 6);
      setQuickMeals(quick);
    };
    
    loadRecipes();

    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  // Filter recipes based on selected category and search
  useEffect(() => {
    let filtered = [...allRecipes];
    
    // Apply category filter
    if (selectedCategory !== '1') { // '1' is "All"
      const categoryMap: { [key: string]: string } = {
        '2': 'breakfast',
        '3': 'lunch', 
        '4': 'dinner',
        '5': 'kenyan',
        '6': 'swahili'
      };
      
      const filterType = categoryMap[selectedCategory];
      
      if (filterType === 'breakfast' || filterType === 'lunch' || filterType === 'dinner') {
        // Filter by meal type
        filtered = filtered.filter(recipe => {
          const courses = recipe.details?.course || [];
          const tags = recipe.tags || [];
          const title = recipe.title.toLowerCase();
          
          // Check in courses, tags, or title
          return courses.some(c => c.toLowerCase() === filterType) ||
                 tags.some(t => t.toLowerCase() === filterType) ||
                 title.includes(filterType);
        });
      } else if (filterType === 'kenyan' || filterType === 'swahili') {
        // Filter by cuisine
        filtered = filtered.filter(recipe => {
          const cuisine = recipe.details?.cuisine?.toLowerCase() || recipe.cuisine?.toLowerCase() || '';
          const tags = recipe.tags || [];
          const title = recipe.title.toLowerCase();
          
          return cuisine.includes(filterType) ||
                 tags.some(t => t.toLowerCase().includes(filterType)) ||
                 title.includes(filterType);
        });
      }
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(recipe => {
        const title = recipe.title.toLowerCase();
        const description = (recipe.description || '').toLowerCase();
        const tags = (recipe.tags || []).join(' ').toLowerCase();
        const ingredients = recipe.ingredients.map(i => i.name.toLowerCase()).join(' ');
        
        return title.includes(query) ||
               description.includes(query) ||
               tags.includes(query) ||
               ingredients.includes(query);
      });
    }
    
    setFilteredRecipes(filtered);
  }, [selectedCategory, searchQuery, allRecipes]);

  const renderCategoryItem = ({ item }: { item: typeof categories[0] }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item.id && styles.categoryItemActive
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Ionicons 
        name={item.icon as any} 
        size={24} 
        color={selectedCategory === item.id ? Colors.white : Colors.gray[600]} 
      />
      <Text style={[
        styles.categoryText,
        selectedCategory === item.id && styles.categoryTextActive
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderRecipeCard = ({ item }: { item: Recipe }) => (
    <TouchableOpacity 
      style={styles.recipeCard} 
      activeOpacity={0.9}
      onPress={() => router.push(`/recipe/${item.id}`)}
    >
      <Image source={item.image} style={styles.recipeImage} />
      <View style={styles.recipeInfo}>
        <Text style={styles.recipeTitle} numberOfLines={2}>{item.title}</Text>
        <View style={styles.recipeMetaContainer}>
          <View style={styles.recipeMeta}>
            <Ionicons name="time-outline" size={14} color={Colors.gray[500]} />
            <Text style={styles.recipeMetaText}>{item.time}</Text>
          </View>
          <View style={styles.recipeMeta}>
            <Ionicons name="fitness-outline" size={14} color={Colors.gray[500]} />
            <Text style={styles.recipeMetaText}>{item.difficulty}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderQuickRecipe = ({ item }: { item: Recipe }) => (
    <TouchableOpacity 
      style={styles.quickRecipeCard} 
      activeOpacity={0.9}
      onPress={() => router.push(`/recipe/${item.id}`)}
    >
      <Image source={item.image} style={styles.quickRecipeImage} />
      <View style={styles.quickRecipeOverlay}>
        <Text style={styles.quickRecipeTime}>{item.time}</Text>
      </View>
      <Text style={styles.quickRecipeTitle} numberOfLines={1}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
      >
        {/* Header */}
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <Text style={styles.greeting}>{getGreeting()}!</Text>
              <Text style={styles.userName}>What would you like to cook today?</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => router.push('/profile')}
              >
                <Ionicons name="person-circle-outline" size={32} color={Colors.text.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={Colors.gray[400]} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search recipes..."
              placeholderTextColor={Colors.gray[400]}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity>
              <MaterialCommunityIcons name="tune-variant" size={20} color={Colors.gray[600]} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Filtered Results or Time-based Meals Section */}
        {selectedCategory !== '1' && filteredRecipes.length > 0 ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {categories.find(c => c.id === selectedCategory)?.name} Recipes ({filteredRecipes.length})
              </Text>
            </View>
            <FlatList
              data={filteredRecipes.slice(0, 10)}
              renderItem={renderRecipeCard}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recipesList}
            />
          </View>
        ) : selectedCategory === '1' ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recommended for {getMealType()}</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See all</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={timeBasedMeals.slice(0, 5)}
              renderItem={renderRecipeCard}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recipesList}
            />
          </View>
        ) : (
          <View style={styles.section}>
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={48} color={Colors.gray[400]} />
              <Text style={styles.emptyText}>No recipes found for this filter</Text>
            </View>
          </View>
        )}

        {/* East African Favorites */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>East African Favorites</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={featuredMeals}
            renderItem={renderRecipeCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recipesList}
          />
        </View>

        {/* Quick Recipes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick & Easy</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={quickMeals}
            renderItem={renderQuickRecipe}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recipesList}
          />
        </View>

        {/* Quick Access Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Explore More</Text>
          </View>
          <View style={styles.quickAccessContainer}>
            <TouchableOpacity 
              style={styles.largeCard}
              onPress={() => router.push('/discover')}
              activeOpacity={0.95}
            >
              <View style={styles.largeCardContent}>
                <Ionicons name="compass" size={40} color={Colors.white} />
                <View style={styles.largeCardText}>
                  <Text style={styles.largeCardTitle}>Discover Recipes</Text>
                  <Text style={styles.largeCardSubtitle}>Browse our full collection</Text>
                </View>
                <Ionicons name="arrow-forward" size={24} color={Colors.white} />
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.largeCard, { backgroundColor: '#4ECDC4' }]}
              onPress={() => router.push('/plan')}
              activeOpacity={0.95}
            >
              <View style={styles.largeCardContent}>
                <MaterialCommunityIcons name="calendar-month" size={40} color={Colors.white} />
                <View style={styles.largeCardText}>
                  <Text style={styles.largeCardTitle}>Meal Planner</Text>
                  <Text style={styles.largeCardSubtitle}>Plan your weekly meals</Text>
                </View>
                <Ionicons name="arrow-forward" size={24} color={Colors.white} />
              </View>
            </TouchableOpacity>
          </View>
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
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: Colors.background,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
  },
  categoriesContainer: {
    paddingVertical: 15,
  },
  categoriesList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    gap: 8,
    marginRight: 10,
  },
  categoryItemActive: {
    backgroundColor: Colors.primary,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  categoryTextActive: {
    color: Colors.white,
  },
  section: {
    paddingVertical: 15,
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
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  recipesList: {
    paddingHorizontal: 20,
  },
  recipeCard: {
    width: width * 0.7,
    marginRight: 16,
    backgroundColor: Colors.card,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: Colors.shadow.medium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  recipeImage: {
    width: '100%',
    height: 180,
  },
  recipeInfo: {
    padding: 16,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  recipeMetaContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  recipeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  recipeMetaText: {
    fontSize: 13,
    color: Colors.text.tertiary,
  },
  quickRecipeCard: {
    width: width * 0.35,
    marginRight: 12,
  },
  quickRecipeImage: {
    width: '100%',
    height: 120,
    borderRadius: 16,
  },
  quickRecipeOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.white,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  quickRecipeTime: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  quickRecipeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginTop: 8,
  },
  aiCard: {
    marginHorizontal: 20,
    marginVertical: 20,
    backgroundColor: Colors.primary,
    borderRadius: 20,
    overflow: 'hidden',
  },
  aiCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  aiCardText: {
    flex: 1,
  },
  aiCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 4,
  },
  aiCardSubtitle: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.9,
  },
  bottomSpacing: {
    height: 20,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  quickAccessCard: {
    width: (width - 52) / 2, // 2 cards per row with gaps
    height: 110,
    borderRadius: 20,
    padding: 16,
    justifyContent: 'space-between',
    shadowColor: Colors.shadow.medium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  quickAccessTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
    marginTop: 8,
  },
  quickAccessSubtitle: {
    fontSize: 12,
    color: Colors.white,
    opacity: 0.85,
  },
  headerLeft: {
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    padding: 4,
  },
  quickAccessContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  largeCard: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: Colors.shadow.medium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  largeCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  largeCardText: {
    flex: 1,
  },
  largeCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 4,
  },
  largeCardSubtitle: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.9,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginTop: 16,
  },
});
