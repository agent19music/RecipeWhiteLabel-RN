import Dialog from '@/components/Dialog';
import GlassmorphicBackButton from '@/components/GlassmorphicBackButton';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Colors } from '@/constants/Colors';
import { useDialog } from '@/hooks/useDialog';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoadingIndicator } from '@rn-nui/loading-indicator';
import { format } from 'date-fns';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const cardWidth = (width - 36) / 2;

interface AIRecipe {
  id: string;
  title: string;
  image: string;
  cuisine: string;
  time: string;
  calories: number;
  generatedAt: string;
  ingredients: string[];
  roycoProducts?: {
    products: Array<{
      name: string;
      usage: string;
      benefit: string;
      amount: string;
    }>;
    flavorProfile: string;
    servingSuggestion: string;
  };
  isFavorite?: boolean;
}

export default function AIRecipesScreen() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<AIRecipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<AIRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'favorites' | 'recent'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'time'>('date');
  const { dialog, showDialog, showConfirmDialog, hideDialog } = useDialog();

  useEffect(() => {
    loadAIRecipes();
  }, []);

  useEffect(() => {
    filterAndSortRecipes();
  }, [recipes, filter, sortBy]);

  const loadAIRecipes = async () => {
    try {
      const storedRecipes = await AsyncStorage.getItem('ai_generated_recipes');
      if (storedRecipes) {
        const parsedRecipes = JSON.parse(storedRecipes);
        setRecipes(parsedRecipes);
      }
    } catch (error) {
      console.error('Error loading AI recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortRecipes = () => {
    let filtered = [...recipes];

    // Apply filter
    if (filter === 'favorites') {
      filtered = filtered.filter(r => r.isFavorite);
    } else if (filter === 'recent') {
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      filtered = filtered.filter(r => new Date(r.generatedAt) > lastWeek);
    }

    // Apply sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime();
        case 'name':
          return a.title.localeCompare(b.title);
        case 'time':
          const aTime = parseInt(a.time) || 0;
          const bTime = parseInt(b.time) || 0;
          return aTime - bTime;
        default:
          return 0;
      }
    });

    setFilteredRecipes(filtered);
  };

  const toggleFavorite = async (recipeId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const updatedRecipes = recipes.map(r => 
      r.id === recipeId ? { ...r, isFavorite: !r.isFavorite } : r
    );
    
    setRecipes(updatedRecipes);
    await AsyncStorage.setItem('ai_generated_recipes', JSON.stringify(updatedRecipes));
  };

  const deleteRecipe = async (recipeId: string) => {
    showConfirmDialog(
      'Delete Recipe',
      'Are you sure you want to delete this AI-generated recipe?',
      async () => {
        const updatedRecipes = recipes.filter(r => r.id !== recipeId);
        setRecipes(updatedRecipes);
        await AsyncStorage.setItem('ai_generated_recipes', JSON.stringify(updatedRecipes));
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      },
      'Delete'
    );
  };

  const clearAllRecipes = () => {
    showConfirmDialog(
      'Clear All Recipes',
      'This will permanently delete all your AI-generated recipes. Are you sure?',
      async () => {
        await AsyncStorage.removeItem('ai_generated_recipes');
        setRecipes([]);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      },
      'Clear All'
    );
  };

  const renderRecipeCard = ({ item }: { item: AIRecipe }) => (
    <TouchableOpacity
      style={styles.recipeCard}
      onPress={() => router.push(`/recipe/${item.id}`)}
      onLongPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        showRecipeOptions(item);
      }}
      activeOpacity={0.9}
    >
      <Image source={{ uri: item.image }} style={styles.recipeImage} />
      
      {/* AI Badge */}
      <View style={styles.aiBadge}>
        <MaterialCommunityIcons name="robot" size={14} color={Colors.white} />
        <Text style={styles.aiBadgeText}>AI</Text>
      </View>

      {/* Favorite Button */}
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => toggleFavorite(item.id)}
      >
        <Ionicons
          name={item.isFavorite ? 'heart' : 'heart-outline'}
          size={20}
          color={item.isFavorite ? Colors.error : Colors.white}
        />
      </TouchableOpacity>

      <View style={styles.recipeInfo}>
        <Text style={styles.recipeTitle} numberOfLines={2}>
          {item.title}
        </Text>
        
        <View style={styles.recipeMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={12} color={Colors.text.secondary} />
            <Text style={styles.metaText}>{item.time}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="flame-outline" size={12} color={Colors.text.secondary} />
            <Text style={styles.metaText}>{item.calories} cal</Text>
          </View>
        </View>

        {item.roycoProducts && (
          <View style={styles.roycoIndicator}>
            <Image
              source={require('../assets/images/royco.jpg')}
              style={styles.roycoLogo}
            />
            <Text style={styles.roycoText}>Enhanced</Text>
          </View>
        )}

        <Text style={styles.generatedDate}>
          {format(new Date(item.generatedAt), 'MMM d, yyyy')}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const showRecipeOptions = (recipe: AIRecipe) => {
    showDialog({
      title: recipe.title,
      message: 'What would you like to do with this recipe?',
      icon: { name: 'chef-hat', backgroundColor: Colors.primary },
      actions: [
        {
          label: 'View Recipe',
          variant: 'primary',
          onPress: () => {
            hideDialog();
            router.push(`/recipe/${recipe.id}`);
          },
        },
        {
          label: 'Cook Now',
          variant: 'secondary',
          onPress: () => {
            hideDialog();
            router.push(`/cook/${recipe.id}`);
          },
        },
        {
          label: 'Delete',
          variant: 'danger',
          onPress: () => {
            hideDialog();
            deleteRecipe(recipe.id);
          },
        },
      ],
    });
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons name="robot-confused" size={80} color={Colors.gray[400]} />
      <Text style={styles.emptyTitle}>No AI Recipes Yet</Text>
      <Text style={styles.emptySubtitle}>
        Start generating personalized recipes with our AI chef
      </Text>
      <TouchableOpacity
        style={styles.generateButton}
        onPress={() => router.push('/ai/manual')}
      >
        <MaterialCommunityIcons name="chef-hat" size={20} color={Colors.white} />
        <Text style={styles.generateButtonText}>Generate Recipe</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <>
      {/* Header */}
      <View style={styles.header}>
        <GlassmorphicBackButton />
        <Text style={styles.headerTitle}>AI Recipes</Text>
        {recipes.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={clearAllRecipes}>
            <Ionicons name="trash-outline" size={20} color={Colors.error} />
          </TouchableOpacity>
        )}
      </View>

      {/* Stats Card */}
      {recipes.length > 0 && (
        <>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{recipes.length}</Text>
            <Text style={styles.statLabel}>Total Recipes</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {recipes.filter(r => r.isFavorite).length}
            </Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {recipes.filter(r => r.roycoProducts).length}
            </Text>
            <Text style={styles.statLabel}>Royco Enhanced</Text>
          </View>
      </>        
      )}

      {/* Filters */}
      {recipes.length > 0 && (
        <>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterContainer}
            contentContainerStyle={styles.filterContent}
          >
            <TouchableOpacity
              style={[styles.filterChip, filter === 'all' && styles.filterChipActive]}
              onPress={() => setFilter('all')}
            >
              <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterChip, filter === 'favorites' && styles.filterChipActive]}
              onPress={() => setFilter('favorites')}
            >
              <Ionicons
                name="heart"
                size={14}
                color={filter === 'favorites' ? Colors.white : Colors.text.secondary}
              />
              <Text style={[styles.filterText, filter === 'favorites' && styles.filterTextActive]}>
                Favorites
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterChip, filter === 'recent' && styles.filterChipActive]}
              onPress={() => setFilter('recent')}
            >
              <Ionicons
                name="time"
                size={14}
                color={filter === 'recent' ? Colors.white : Colors.text.secondary}
              />
              <Text style={[styles.filterText, filter === 'recent' && styles.filterTextActive]}>
                Recent
              </Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Sort Options */}
          <View style={styles.sortContainer}>
            <Text style={styles.sortLabel}>Sort by:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.sortOptions}
            >
              <TouchableOpacity
                style={[styles.sortChip, sortBy === 'date' && styles.sortChipActive]}
                onPress={() => setSortBy('date')}
              >
                <Text style={[styles.sortText, sortBy === 'date' && styles.sortTextActive]}>
                  Date
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sortChip, sortBy === 'name' && styles.sortChipActive]}
                onPress={() => setSortBy('name')}
              >
                <Text style={[styles.sortText, sortBy === 'name' && styles.sortTextActive]}>
                  Name
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sortChip, sortBy === 'time' && styles.sortChipActive]}
                onPress={() => setSortBy('time')}
              >
                <Text style={[styles.sortText, sortBy === 'time' && styles.sortTextActive]}>
                  Cook Time
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </>
      )}
    </>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
       <LoadingSpinner
        visible={loading}
        type="cooking"
        text="Creating your personalized Royco-enhanced recipe..."
      />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={filteredRecipes}
        renderItem={renderRecipeCard}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/ai/manual')}
      >
        <MaterialCommunityIcons name="robot" size={24} color={Colors.white} />
        <Text style={styles.fabText}>Generate</Text>
      </TouchableOpacity>

      <Dialog
        visible={dialog.visible}
        onClose={hideDialog}
        title={dialog.title}
        message={dialog.message}
        icon={dialog.icon}
        actions={dialog.actions}
      />
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
    flex: 1,
  },
  clearButton: {
    padding: 8,
  },
  statsCard: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  filterContainer: {
    marginBottom: 12,
  },
  filterContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    marginRight: 8,
    gap: 6,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  filterTextActive: {
    color: Colors.white,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sortLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginRight: 12,
  },
  sortOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  sortChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: Colors.surface,
  },
  sortChipActive: {
    backgroundColor: Colors.primary,
  },
  sortText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  sortTextActive: {
    color: Colors.white,
  },
  listContent: {
    paddingBottom: 100,
  },
  row: {
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  recipeCard: {
    width: cardWidth,
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  recipeImage: {
    width: '100%',
    height: cardWidth * 0.8,
    backgroundColor: Colors.surface,
  },
  aiBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  aiBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.white,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipeInfo: {
    padding: 12,
  },
  recipeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  recipeMeta: {
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
    fontSize: 11,
    color: Colors.text.secondary,
  },
  roycoIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  roycoLogo: {
    width: 16,
    height: 16,
  },
  roycoText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primary,
  },
  generatedDate: {
    fontSize: 10,
    color: Colors.text.tertiary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 28,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  fabText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },
});