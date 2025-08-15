import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import ModernButton from '@/components/ModernButton';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { getRecipeById } from '@/data/enhanced-recipes';

const { width, height } = Dimensions.get('window');

// Mock data for recipe details
const mockIngredients = [
  { id: '1', amount: '500g', item: 'Beef (cubed)', category: 'Protein' },
  { id: '2', amount: '2 cups', item: 'Basmati Rice', category: 'Grains' },
  { id: '3', amount: '3', item: 'Tomatoes (diced)', category: 'Vegetables' },
  { id: '4', amount: '2', item: 'Onions (sliced)', category: 'Vegetables' },
  { id: '5', amount: '4 cloves', item: 'Garlic (minced)', category: 'Aromatics' },
  { id: '6', amount: '1 tbsp', item: 'Royco Beef Cubes', category: 'Seasoning' },
  { id: '7', amount: '1 tsp', item: 'Turmeric Powder', category: 'Spices' },
  { id: '8', amount: '2 tbsp', item: 'Cooking Oil', category: 'Oil' },
  { id: '9', amount: '1 cup', item: 'Beef Stock', category: 'Liquid' },
  { id: '10', amount: 'To taste', item: 'Salt & Pepper', category: 'Seasoning' },
];

const mockSteps = [
  {
    id: '1',
    title: 'Prepare Ingredients',
    description: 'Cube the beef into bite-sized pieces. Dice tomatoes and slice onions. Mince garlic cloves.',
    time: '10 min',
    tip: 'Cut beef against the grain for more tender pieces',
  },
  {
    id: '2',
    title: 'Marinate Beef',
    description: 'Season beef with Royco cubes, salt, pepper, and half the turmeric. Let it rest for 15 minutes.',
    time: '15 min',
    tip: 'Marinating helps the flavors penetrate deeper',
  },
  {
    id: '3',
    title: 'Sauté Aromatics',
    description: 'Heat oil in a large pot. Add onions and garlic, cook until fragrant and golden.',
    time: '5 min',
    tip: 'Don\'t let the garlic burn - it will taste bitter',
  },
  {
    id: '4',
    title: 'Brown the Beef',
    description: 'Add marinated beef to the pot. Brown on all sides over high heat.',
    time: '8 min',
    tip: 'Don\'t overcrowd the pot - brown in batches if needed',
  },
  {
    id: '5',
    title: 'Add Tomatoes & Spices',
    description: 'Add diced tomatoes and remaining turmeric. Cook until tomatoes break down.',
    time: '5 min',
    tip: 'Mash tomatoes slightly to create a thick sauce',
  },
  {
    id: '6',
    title: 'Simmer',
    description: 'Add beef stock, reduce heat to low. Cover and simmer until beef is tender.',
    time: '45 min',
    tip: 'Check occasionally and add water if needed',
  },
  {
    id: '7',
    title: 'Prepare Rice',
    description: 'While beef simmers, rinse rice and cook according to package instructions.',
    time: '20 min',
    tip: 'Add a cinnamon stick to rice for extra flavor',
  },
  {
    id: '8',
    title: 'Final Touches',
    description: 'Taste and adjust seasoning. Let rest for 5 minutes before serving.',
    time: '5 min',
    tip: 'Garnish with fresh coriander for color',
  },
];

const nutritionData = [
  { label: 'Calories', value: '520', unit: 'kcal', percentage: 26 },
  { label: 'Protein', value: '35', unit: 'g', percentage: 70 },
  { label: 'Carbs', value: '45', unit: 'g', percentage: 15 },
  { label: 'Fat', value: '18', unit: 'g', percentage: 25 },
];

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [recipe, setRecipe] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'steps' | 'nutrition'>('ingredients');
  const [isFavorite, setIsFavorite] = useState(false);
  const [servings, setServings] = useState(4);
  
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Get recipe details from enhanced recipes
    const foundRecipe = getRecipeById(id as string);
    if (foundRecipe) {
      setRecipe(foundRecipe);
      if (foundRecipe.servings) {
        setServings(foundRecipe.servings);
      }
    }

    // Animate in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [id]);

  if (!recipe) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [1, 0.3],
    extrapolate: 'clamp',
  });

  const imageScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.5, 1],
    extrapolate: 'clamp',
  });

  const handleStartCooking = () => {
    router.push(`/cook/${recipe.id}`);
  };

  const adjustServings = (increment: boolean) => {
    if (increment) {
      setServings(prev => prev + 1);
    } else if (servings > 1) {
      setServings(prev => prev - 1);
    }
  };

  const renderIngredients = () => (
    <Animated.View style={{ opacity: fadeAnim }}>
      {/* Servings Adjuster */}
      <View style={styles.servingsContainer}>
        <Text style={styles.servingsLabel}>Servings</Text>
        <View style={styles.servingsAdjuster}>
          <TouchableOpacity 
            style={styles.servingButton}
            onPress={() => adjustServings(false)}
          >
            <Ionicons name="remove" size={20} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.servingsNumber}>{servings}</Text>
          <TouchableOpacity 
            style={styles.servingButton}
            onPress={() => adjustServings(true)}
          >
            <Ionicons name="add" size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Ingredients List */}
      <View style={styles.ingredientsList}>
        {mockIngredients.map((ingredient, index) => (
          <Animated.View
            key={ingredient.id}
            style={[
              styles.ingredientItem,
              {
                opacity: fadeAnim,
                transform: [{
                  translateX: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                }],
              },
            ]}
          >
            <View style={styles.ingredientAmount}>
              <Text style={styles.amountText}>{ingredient.amount}</Text>
            </View>
            <View style={styles.ingredientInfo}>
              <Text style={styles.ingredientName}>{ingredient.item}</Text>
              <Text style={styles.ingredientCategory}>{ingredient.category}</Text>
            </View>
            <TouchableOpacity style={styles.checkBox}>
              <Ionicons name="checkmark-circle-outline" size={24} color={Colors.gray[400]} />
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </Animated.View>
  );

  const renderSteps = () => (
    <View style={styles.stepsList}>
      {mockSteps.map((step, index) => (
        <Animated.View
          key={step.id}
          style={[
            styles.stepItem,
            {
              opacity: fadeAnim,
              transform: [{
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              }],
            },
          ]}
        >
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>{index + 1}</Text>
          </View>
          <View style={styles.stepContent}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <View style={styles.stepTime}>
                <Ionicons name="time-outline" size={14} color={Colors.primary} />
                <Text style={styles.stepTimeText}>{step.time}</Text>
              </View>
            </View>
            <Text style={styles.stepDescription}>{step.description}</Text>
            {step.tip && (
              <View style={styles.tipContainer}>
                <MaterialIcons name="lightbulb-outline" size={16} color={Colors.warning} />
                <Text style={styles.tipText}>{step.tip}</Text>
              </View>
            )}
          </View>
        </Animated.View>
      ))}
    </View>
  );

  const renderNutrition = () => (
    <View style={styles.nutritionContainer}>
      <View style={styles.nutritionGrid}>
        {nutritionData.map((item, index) => (
          <Animated.View
            key={item.label}
            style={[
              styles.nutritionCard,
              {
                opacity: fadeAnim,
                transform: [{
                  scale: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                }],
              },
            ]}
          >
            <View style={styles.nutritionCircle}>
              <Text style={styles.nutritionValue}>{item.value}</Text>
              <Text style={styles.nutritionUnit}>{item.unit}</Text>
            </View>
            <Text style={styles.nutritionLabel}>{item.label}</Text>
            <View style={styles.nutritionBar}>
              <View 
                style={[
                  styles.nutritionBarFill, 
                  { width: `${item.percentage}%` }
                ]} 
              />
            </View>
          </Animated.View>
        ))}
      </View>
      <View style={styles.dailyValueNote}>
        <Text style={styles.dailyValueText}>* Based on a 2,000 calorie diet</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header Image with Parallax */}
      <Animated.View 
        style={[
          styles.imageContainer,
          {
            opacity: imageOpacity,
            transform: [{ scale: imageScale }],
          },
        ]}
      >
        <Image source={recipe.image} style={styles.heroImage} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.imageGradient}
        />
      </Animated.View>

      {/* Back and Action Buttons */}
      <SafeAreaView style={styles.headerButtons} edges={['top']}>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <BlurView intensity={80} tint="dark" style={styles.blurButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </BlurView>
        </TouchableOpacity>
        <View style={styles.headerRightButtons}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => setIsFavorite(!isFavorite)}
          >
            <BlurView intensity={80} tint="dark" style={styles.blurButton}>
              <Ionicons 
                name={isFavorite ? "heart" : "heart-outline"} 
                size={24} 
                color={isFavorite ? Colors.error : Colors.white} 
              />
            </BlurView>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <BlurView intensity={80} tint="dark" style={styles.blurButton}>
              <Ionicons name="share-outline" size={24} color={Colors.white} />
            </BlurView>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Scrollable Content */}
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Spacer for image */}
        <View style={{ height: height * 0.35 }} />

        {/* Main Content Card */}
        <View style={styles.contentCard}>
          {/* Recipe Header */}
          <Animated.View 
            style={[
              styles.recipeHeader,
              { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
            ]}
          >
            <View style={styles.cuisineBadge}>
              <Text style={styles.cuisineText}>{recipe.cuisine}</Text>
            </View>
            <Text style={styles.recipeTitle}>{recipe.title}</Text>
            
            {/* Quick Stats */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Ionicons name="time-outline" size={16} color={Colors.gray[600]} />
                <Text style={styles.statText}>{recipe.time}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Ionicons name="fitness-outline" size={16} color={Colors.gray[600]} />
                <Text style={styles.statText}>{recipe.difficulty}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Ionicons name="flame-outline" size={16} color={Colors.gray[600]} />
                <Text style={styles.statText}>{recipe.calories}</Text>
              </View>
            </View>

            {/* Rating */}
            <View style={styles.ratingRow}>
              <View style={styles.rating}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons
                    key={star}
                    name={star <= Math.floor(recipe.rating) ? "star" : "star-outline"}
                    size={18}
                    color="#FFB800"
                  />
                ))}
                <Text style={styles.ratingText}>{recipe.rating}</Text>
              </View>
              <Text style={styles.reviewsText}>({recipe.reviews} reviews)</Text>
            </View>
          </Animated.View>

          {/* Tab Navigation */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'ingredients' && styles.activeTab]}
              onPress={() => setActiveTab('ingredients')}
            >
              <Text style={[styles.tabText, activeTab === 'ingredients' && styles.activeTabText]}>
                Ingredients
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'steps' && styles.activeTab]}
              onPress={() => setActiveTab('steps')}
            >
              <Text style={[styles.tabText, activeTab === 'steps' && styles.activeTabText]}>
                Steps
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'nutrition' && styles.activeTab]}
              onPress={() => setActiveTab('nutrition')}
            >
              <Text style={[styles.tabText, activeTab === 'nutrition' && styles.activeTabText]}>
                Nutrition
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          <View style={styles.tabContent}>
            {activeTab === 'ingredients' && renderIngredients()}
            {activeTab === 'steps' && renderSteps()}
            {activeTab === 'nutrition' && renderNutrition()}
          </View>
        </View>
      </Animated.ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomCTA}>
        <ModernButton
          title="Start Cooking"
          onPress={handleStartCooking}
          variant="primary"
          size="large"
          icon={<MaterialCommunityIcons name="chef-hat" size={24} color={Colors.white} />}
        />
      </View>
    </View>
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
  },
  imageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.4,
    zIndex: 0,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  headerButtons: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  headerButton: {
    marginTop: 10,
  },
  headerRightButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  blurButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  contentCard: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 30,
    minHeight: height * 0.7,
  },
  recipeHeader: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cuisineBadge: {
    backgroundColor: Colors.primaryMuted,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  cuisineText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  recipeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  statDivider: {
    width: 1,
    height: 16,
    backgroundColor: Colors.border,
    marginHorizontal: 16,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginLeft: 8,
  },
  reviewsText: {
    fontSize: 14,
    color: Colors.text.tertiary,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginHorizontal: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.tertiary,
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  tabContent: {
    paddingTop: 20,
  },
  servingsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  servingsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  servingsAdjuster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  servingButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  servingsNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    minWidth: 30,
    textAlign: 'center',
  },
  ingredientsList: {
    paddingHorizontal: 20,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  ingredientAmount: {
    width: 80,
  },
  amountText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  ingredientInfo: {
    flex: 1,
  },
  ingredientName: {
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  ingredientCategory: {
    fontSize: 12,
    color: Colors.text.tertiary,
  },
  checkBox: {
    padding: 4,
  },
  stepsList: {
    paddingHorizontal: 20,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  stepContent: {
    flex: 1,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  stepTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stepTimeText: {
    fontSize: 12,
    color: Colors.primary,
  },
  stepDescription: {
    fontSize: 15,
    color: Colors.text.secondary,
    lineHeight: 22,
    marginBottom: 8,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: Colors.warning + '10',
    padding: 10,
    borderRadius: 12,
  },
  tipText: {
    fontSize: 13,
    color: Colors.text.secondary,
    flex: 1,
  },
  nutritionContainer: {
    paddingHorizontal: 20,
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  nutritionCard: {
    width: '48%',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  nutritionCircle: {
    alignItems: 'center',
    marginBottom: 8,
  },
  nutritionValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
  },
  nutritionUnit: {
    fontSize: 14,
    color: Colors.text.tertiary,
  },
  nutritionLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  nutritionBar: {
    width: '100%',
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  nutritionBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  dailyValueNote: {
    alignItems: 'center',
  },
  dailyValueText: {
    fontSize: 12,
    color: Colors.text.tertiary,
    fontStyle: 'italic',
  },
  bottomCTA: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
