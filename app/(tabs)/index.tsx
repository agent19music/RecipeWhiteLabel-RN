import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  Animated,
  Dimensions,
  TextInput,
  FlatList,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import ModernButton from '@/components/ModernButton';
import { 
  Recipe,
  getMealsByTimeOfDay, 
  getFeaturedRecipes,
  eastAfricanBreakfast,
  eastAfricanLunch,
  eastAfricanDinner
} from '@/data/recipes';

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
    // Load time-based meals
    const meals = getMealsByTimeOfDay();
    setTimeBasedMeals(meals);
    setFeaturedMeals(getFeaturedRecipes());
    
    // Get quick meals (meals under 30 min)
    const quick = meals.filter(meal => {
      const minutes = parseInt(meal.time.split(' ')[0]);
      return minutes <= 30;
    }).slice(0, 6);
    setQuickMeals(quick);

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
            <View>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <Text style={styles.userName}>Perfect time for {getMealType().toLowerCase()}</Text>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons name="notifications-outline" size={24} color={Colors.black} />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
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

        {/* Time-based Meals Section */}
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

        {/* AI Recipe Generator */}
        <TouchableOpacity 
          style={styles.aiCard}
          onPress={() => router.push('/ai')}
          activeOpacity={0.9}
        >
          <View style={styles.aiCardContent}>
            <MaterialCommunityIcons name="robot-happy" size={40} color={Colors.white} />
            <View style={styles.aiCardText}>
              <Text style={styles.aiCardTitle}>AI Recipe Generator</Text>
              <Text style={styles.aiCardSubtitle}>Create custom recipes with AI</Text>
            </View>
            <Ionicons name="arrow-forward" size={24} color={Colors.white} />
          </View>
        </TouchableOpacity>

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
});
