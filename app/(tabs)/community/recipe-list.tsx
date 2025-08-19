import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, Pressable, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { theme, useTheme } from '../../../theme';
import { recipes as seedRecipes } from '../../../data/seed';
import ExpandableRecipeCard from '../../../components/ExpandableRecipeCard';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { getAllEnhancedRecipes } from '@/data/enhanced-recipes';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RecipeList() {
  const { palette } = useTheme();
  const { ids } = useLocalSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState<any[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load enhanced recipes
    const enhancedRecipes = getAllEnhancedRecipes();
    
    // If specific IDs are passed, filter to those
    const idSet: Set<string> =
      typeof ids === 'string' ? new Set(ids.split(',').filter(Boolean)) : new Set<string>();
    
    const recipesToShow = idSet.size 
      ? enhancedRecipes.filter(r => idSet.has(r.id))
      : enhancedRecipes;
    
    setRecipes(recipesToShow);
    setFilteredRecipes(recipesToShow);
  }, [ids]);

  useEffect(() => {
    // Filter recipes based on search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const filtered = recipes.filter(recipe => {
        const title = recipe.title.toLowerCase();
        const description = (recipe.description || '').toLowerCase();
        const cuisine = (recipe.cuisine || recipe.details?.cuisine || '').toLowerCase();
        const tags = (recipe.tags || []).join(' ').toLowerCase();
        
        return title.includes(query) ||
               description.includes(query) ||
               cuisine.includes(query) ||
               tags.includes(query);
      });
      setFilteredRecipes(filtered);
    } else {
      setFilteredRecipes(recipes);
    }
  }, [searchQuery, recipes]);

  const toggleFavorite = (recipeId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(recipeId)) {
        newFavorites.delete(recipeId);
      } else {
        newFavorites.add(recipeId);
      }
      return newFavorites;
    });
  };

  const renderRecipe = ({ item }: { item: any }) => (
    <ExpandableRecipeCard
      id={item.id}
      title={item.title}
      image={item.image}
      time={item.time || item.minutes}
      difficulty={item.difficulty || item.details?.difficulty}
      servings={item.servings || item.details?.servings}
      calories={item.nutrition?.calories || item.calories}
      rating={item.rating || item.details?.rating}
      reviews={item.reviews || item.details?.ratingCount}
      description={item.description || item.summary}
      cuisine={item.cuisine || item.details?.cuisine}
      ingredients={item.ingredients}
      tags={item.tags}
      personalNote={item.personalNote}
      isFavorite={favorites.has(item.id)}
      onToggleFavorite={() => toggleFavorite(item.id)}
      onPress={() => router.push(`/recipe/${item.id}`)}
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Recipes</Text>
        <Text style={styles.subtitle}>
          {filteredRecipes.length} delicious recipes to explore
        </Text>
      </View>
      
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
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={Colors.gray[400]} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Recipe List */}
      <FlatList
        data={filteredRecipes}
        renderItem={renderRecipe}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="restaurant-outline" size={64} color={Colors.gray[400]} />
            <Text style={styles.emptyText}>No recipes found</Text>
            {searchQuery && (
              <Text style={styles.emptySubtext}>Try adjusting your search</Text>
            )}
          </View>
        }
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
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
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.secondary,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.text.tertiary,
    marginTop: 8,
  },
});
