import CommunityRecipeCard from '@/components/CommunityRecipeCard';
import { Colors } from '@/constants/Colors';
import { getCommunityRecipes, getViralRecipes } from '@/data/community-recipes';
import { Recipe } from '@/data/types';
import { track } from '@/utils/analytics';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    Linking,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

type FilterType = 'all' | 'viral' | 'recent' | 'favorites';

export default function CommunityRecipesScreen() {
  const router = useRouter();
  const [recipes] = useState<Recipe[]>(getCommunityRecipes());
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>(recipes);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const filters: { key: FilterType; label: string; icon: string }[] = [
    { key: 'all', label: 'All', icon: 'grid-outline' },
    { key: 'viral', label: 'Viral', icon: 'trending-up' },
    { key: 'recent', label: 'Recent', icon: 'time-outline' },
    { key: 'favorites', label: 'Favorites', icon: 'heart-outline' },
  ];

  const applyFilter = (filterType: FilterType) => {
    setActiveFilter(filterType);
    let filtered = [...recipes];

    switch (filterType) {
      case 'viral':
        filtered = getViralRecipes();
        break;
      case 'recent':
        // Sort by creation date (mock implementation)
        filtered = filtered.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case 'favorites':
        // Filter by high ratings
        filtered = filtered.filter(recipe => (recipe.details?.rating ?? 0) >= 4.5);
        break;
      default:
        // All recipes
        break;
    }

    // Apply search filter if active
    if (searchQuery) {
      filtered = filtered.filter(recipe =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredRecipes(filtered);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    track('community_recipes_filtered', { filter: filterType, resultCount: filtered.length });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    let filtered = [...recipes];

    // Apply current filter first
    if (activeFilter !== 'all') {
      applyFilter(activeFilter);
      return;
    }

    // Apply search
    if (query) {
      filtered = filtered.filter(recipe =>
        recipe.title.toLowerCase().includes(query.toLowerCase()) ||
        recipe.author?.toLowerCase().includes(query.toLowerCase()) ||
        recipe.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
    }

    setFilteredRecipes(filtered);
    track('community_recipes_searched', { query, resultCount: filtered.length });
  };

  const handleRecipePress = (recipe: Recipe) => {
    router.push(`/recipe/${recipe.id}`);
    track('community_recipe_opened', { recipeId: recipe.id, author: recipe.author });
  };

  const handleShare = (recipe: Recipe) => {
    track('community_recipe_shared', { recipeId: recipe.id, author: recipe.author });
  };

  const handleSave = (recipe: Recipe) => {
    track('community_recipe_saved', { recipeId: recipe.id, author: recipe.author });
  };

  const handleViewCreator = (recipe: Recipe) => {
    if (recipe.sourceUrl) {
      Alert.alert(
        `Follow ${recipe.author}`,
        `Visit ${recipe.author}'s ${recipe.socialMedia?.platform} profile?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Visit Profile',
            onPress: () => {
              Linking.openURL(recipe.sourceUrl!);
              track('community_creator_profile_visited', { 
                author: recipe.author,
                platform: recipe.socialMedia?.platform 
              });
            }
          }
        ]
      );
    }
  };

  const refreshRecipes = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      applyFilter(activeFilter);
    }, 1000);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Community Recipes</Text>
      <Text style={styles.headerSubtitle}>
        Viral recipes from your favorite Kenyan TikTok creators
      </Text>
    </View>
  );

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <Ionicons name="search" size={20} color={Colors.gray[400]} />
      <TextInput
        style={styles.searchInput}
        placeholder="Search recipes or creators..."
        placeholderTextColor={Colors.gray[400]}
        value={searchQuery}
        onChangeText={handleSearch}
      />
      {searchQuery && (
        <TouchableOpacity
          onPress={() => handleSearch('')}
          style={styles.clearButton}
        >
          <Ionicons name="close-circle" size={20} color={Colors.gray[400]} />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderFilters = () => (
    <View style={styles.filtersContainer}>
      <FlatList
        data={filters}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.filtersList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.filterChip,
              activeFilter === item.key && styles.filterChipActive
            ]}
            onPress={() => applyFilter(item.key)}
          >
            <Ionicons
              name={item.icon as any}
              size={16}
              color={activeFilter === item.key ? Colors.white : Colors.text.secondary}
            />
            <Text
              style={[
                styles.filterText,
                activeFilter === item.key && styles.filterTextActive
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  const renderStatsBar = () => (
    <View style={styles.statsBar}>
      <View style={styles.statItem}>
        <MaterialCommunityIcons name="chef-hat" size={16} color={Colors.primary} />
        <Text style={styles.statText}>7 Creators</Text>
      </View>
      <View style={styles.statItem}>
        <Ionicons name="restaurant" size={16} color={Colors.primary} />
        <Text style={styles.statText}>{filteredRecipes.length} Recipes</Text>
      </View>
      <View style={styles.statItem}>
        <Ionicons name="trending-up" size={16} color={Colors.primary} />
        <Text style={styles.statText}>
          {filteredRecipes.filter(r => (r.details?.favoriteCount ?? 0) > 5000).length} Viral
        </Text>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons name="chef-hat" size={64} color={Colors.gray[300]} />
      <Text style={styles.emptyTitle}>No recipes found</Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery
          ? 'Try adjusting your search terms'
          : 'Try changing your filter selection'}
      </Text>
      {searchQuery && (
        <TouchableOpacity
          style={styles.clearSearchButton}
          onPress={() => handleSearch('')}
        >
          <Text style={styles.clearSearchText}>Clear Search</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderRecipeCard = ({ item, index }: { item: Recipe; index: number }) => (
    <View style={[styles.cardContainer, { marginLeft: index === 0 ? 20 : 0 }]}>
      <CommunityRecipeCard
        recipe={item}
        onPress={() => handleRecipePress(item)}
        onShare={() => handleShare(item)}
        onSave={() => handleSave(item)}
        onViewCreator={() => handleViewCreator(item)}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.mainContent}>
        {/* Fixed Header Section */}
        <View style={styles.fixedHeader}>
          {renderHeader()}
          {renderSearchBar()}
          {renderFilters()}
          {renderStatsBar()}
        </View>
        
        {/* Scrollable Recipe Cards */}
        <FlatList
          ref={flatListRef}
          data={filteredRecipes}
          renderItem={renderRecipeCard}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.recipesList}
          snapToInterval={width * 0.85 + 16}
          decelerationRate="fast"
          snapToAlignment="start"
          ListEmptyComponent={renderEmptyState()}
          onRefresh={refreshRecipes}
          refreshing={isLoading}
          style={styles.recipeFlatList}
        />

      </View>
      
      {/* Quick Actions FAB */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={styles.fab}
          onPress={() => {
            Alert.alert(
              'Submit Recipe',
              'Want to share your viral recipe? Submit your TikTok video for a chance to be featured!',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Submit', onPress: () => track('recipe_submission_interest') }
              ]
            );
          }}
        >
          <Ionicons name="add" size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  mainContent: {
    flex: 1,
  },
  fixedHeader: {
    backgroundColor: Colors.background,
    paddingBottom: 10,
  },
  recipeFlatList: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    lineHeight: 22,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    height: 50,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
  },
  clearButton: {
    padding: 4,
  },
  filtersContainer: {
    marginBottom: 16,
  },
  filtersList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  filterTextActive: {
    color: Colors.white,
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    marginHorizontal: 20,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    marginBottom: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  recipesList: {
    paddingRight: 20,
  },
  cardContainer: {
    marginRight: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  clearSearchButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.primary,
    borderRadius: 20,
  },
  clearSearchText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
