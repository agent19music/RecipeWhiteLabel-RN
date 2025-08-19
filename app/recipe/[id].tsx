import CookingStepper from '@/components/CookingStepper';
import ModernButton from '@/components/ModernButton';
import { Colors } from '@/constants/Colors';
import { getRecipeById } from '@/data/enhanced-recipes';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    // Get recipe details from enhanced recipes (async)
    const loadRecipe = async () => {
      try {
        const foundRecipe = await getRecipeById(id as string);
        if (foundRecipe) {
          setRecipe(foundRecipe);
          // Use details.servings if available, otherwise use servings field
          const recipeServings = foundRecipe.details?.servings || foundRecipe.servings || 4;
          setServings(recipeServings);
        }
      } catch (error) {
        console.error('Error loading recipe:', error);
      }
    };

    loadRecipe();

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
        {(recipe.ingredients || mockIngredients).map((ingredient: any, index: number) => {
          // Handle both enhanced recipe format and mock format
          const amount = ingredient.quantity ? 
            `${ingredient.quantity} ${ingredient.unit || ''}`.trim() : 
            ingredient.amount;
          const name = ingredient.name || ingredient.item;
          const category = ingredient.group || ingredient.category || 'Ingredient';
          const key = ingredient.id || `ingredient-${index}`;
          
          return (
            <Animated.View
              key={key}
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
                <Text style={styles.amountText}>{amount}</Text>
              </View>
              <View style={styles.ingredientInfo}>
                <Text style={styles.ingredientName}>{name}</Text>
                {ingredient.note && (
                  <Text style={styles.ingredientNote}>{ingredient.note}</Text>
                )}
                <Text style={styles.ingredientCategory}>{category}</Text>
              </View>
              <TouchableOpacity style={styles.checkBox}>
                <Ionicons name="checkmark-circle-outline" size={24} color={Colors.gray[400]} />
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    </Animated.View>
  );

  const renderSteps = () => {
    // Convert steps to the format expected by CookingStepper if needed
    const formattedSteps = recipe.steps || mockSteps.map((step: any) => ({
      id: step.id,
      title: step.title,
      body: step.description,
      time: step.time ? parseInt(step.time) : undefined,
      tips: step.tip ? [step.tip] : undefined,
      imageUrl: step.imageUrl,
    }));

    return (
      <CookingStepper 
        steps={formattedSteps} 
        recipeId={recipe.id} 
        recipeName={recipe.title}
      />
    );
  };

  const renderNutrition = () => {
    // Use recipe nutrition data if available, otherwise use mock data
    const nutritionInfo = recipe.nutrition || {};
    const nutritionItems = [
      { label: 'Calories', value: nutritionInfo.calories || 520, unit: 'kcal', percentage: ((nutritionInfo.calories || 520) / 2000) * 100 },
      { label: 'Protein', value: nutritionInfo.protein || 35, unit: 'g', percentage: ((nutritionInfo.protein || 35) / 50) * 100 },
      { label: 'Carbs', value: nutritionInfo.carbs || 45, unit: 'g', percentage: ((nutritionInfo.carbs || 45) / 300) * 100 },
      { label: 'Fat', value: nutritionInfo.fat || 18, unit: 'g', percentage: ((nutritionInfo.fat || 18) / 65) * 100 },
    ];
    
    return (
      <View style={styles.nutritionContainer}>
        <View style={styles.nutritionGrid}>
          {nutritionItems.map((item, index) => (
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
                    { width: `${Math.min(item.percentage, 100)}%` }
                  ]} 
                />
              </View>
            </Animated.View>
          ))}
        </View>
        {recipe.nutrition?.fiber && (
          <View style={styles.additionalNutrition}>
            <Text style={styles.additionalNutritionText}>Fiber: {recipe.nutrition.fiber}g • Sugar: {recipe.nutrition.sugar || 0}g • Sodium: {recipe.nutrition.sodium || 0}mg</Text>
          </View>
        )}
        <View style={styles.dailyValueNote}>
          <Text style={styles.dailyValueText}>* Based on a 2,000 calorie diet</Text>
        </View>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          headerShown: false,
        }} 
      />
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
              <Text style={styles.cuisineText}>{recipe.details?.cuisine || recipe.cuisine || 'International'}</Text>
            </View>
            <Text style={styles.recipeTitle}>{recipe.title}</Text>
            {recipe.description && (
              <Text style={styles.recipeDescription}>{recipe.description}</Text>
            )}
            
            {/* Quick Stats */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Ionicons name="time-outline" size={16} color={Colors.gray[600]} />
                <Text style={styles.statText}>{recipe.details?.totalTime || recipe.minutes || 30} min</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Ionicons name="fitness-outline" size={16} color={Colors.gray[600]} />
                <Text style={styles.statText}>{recipe.details?.difficulty || recipe.difficulty || 'Medium'}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Ionicons name="flame-outline" size={16} color={Colors.gray[600]} />
                <Text style={styles.statText}>{recipe.nutrition?.calories || recipe.calories || '350'} cal</Text>
              </View>
            </View>

            {/* Rating */}
            <View style={styles.ratingRow}>
              <View style={styles.rating}>
                {[1, 2, 3, 4, 5].map((star) => {
                  const rating = recipe.details?.rating || recipe.rating || 4.5;
                  return (
                    <Ionicons
                      key={star}
                      name={star <= Math.floor(rating) ? "star" : "star-outline"}
                      size={18}
                      color="#FFB800"
                    />
                  );
                })}
                <Text style={styles.ratingText}>{recipe.details?.rating || recipe.rating || 4.5}</Text>
              </View>
              <Text style={styles.reviewsText}>({recipe.details?.ratingCount || recipe.reviews || 120} reviews)</Text>
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

      {/* Bottom CTA - Only show for non-steps tabs */}
      {activeTab !== 'steps' && (
        <View style={styles.bottomCTA}>
          <ModernButton
            title="Start Cooking"
            onPress={handleStartCooking}
            variant="primary"
            size="large"
            icon={<MaterialCommunityIcons name="chef-hat" size={24} color={Colors.white} />}
          />
        </View>
      )}
      </View>
    </>
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
    marginBottom: 8,
  },
  recipeDescription: {
    fontSize: 15,
    color: Colors.text.secondary,
    lineHeight: 22,
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
  ingredientNote: {
    fontSize: 13,
    color: Colors.text.secondary,
    fontStyle: 'italic',
    marginTop: 2,
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
  additionalNutrition: {
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  additionalNutritionText: {
    fontSize: 13,
    color: Colors.text.secondary,
    textAlign: 'center',
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
