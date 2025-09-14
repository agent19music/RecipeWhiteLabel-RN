import ChallengeCard from '@/components/ChallengeCard';
import CommunityRecipeCard from '@/components/CommunityRecipeCard';
import SubmissionCard from '@/components/SubmissionCard';
import { Colors } from '@/constants/Colors';
import { Challenge, ChallengeSubmission, getActiveChallenge, getTrendingSubmissions } from '@/data/challenges';
import { getCommunityRecipes, getViralRecipes } from '@/data/community-recipes';
import { Recipe } from '@/data/types';
import { track } from '@/utils/analytics';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

type TabType = 'challenges' | 'social';
type FilterType = 'all' | 'viral' | 'recent' | 'favorites';

export default function CommunityRecipesScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('challenges');
  const [recipes] = useState<Recipe[]>(getCommunityRecipes());
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>(recipes);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const flatListRef = useRef<FlatList>(null);
  const submissionsFlatListRef = useRef<FlatList>(null);
  
  // Challenge data
  const activeChallenge = getActiveChallenge();
  const trendingSubmissions = getTrendingSubmissions();

  const tabIndicatorAnimation = useRef(new Animated.Value(0)).current;

  const switchTab = (tab: TabType) => {
    if (tab === activeTab) return;
    
    setActiveTab(tab);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    const toValue = tab === 'challenges' ? 0 : 1;
    Animated.spring(tabIndicatorAnimation, {
      toValue,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();

    track('community_tab_switched', { tab });
  };

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
        filtered = filtered.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case 'favorites':
        filtered = filtered.filter(recipe => (recipe.details?.rating ?? 0) >= 4.5);
        break;
      default:
        break;
    }

    setFilteredRecipes(filtered);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    track('community_recipes_filtered', { filter: filterType, resultCount: filtered.length });
  };

  const handleRecipePress = (recipe: Recipe) => {
    router.push(`/recipe/${recipe.id}`);
    track('community_recipe_opened', { recipeId: recipe.id, author: recipe.author });
  };

  const handleChallengePress = (challenge: Challenge) => {
    Alert.alert(
      challenge.name,
      challenge.description,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'View Details', onPress: () => track('challenge_details_viewed', { challengeId: challenge.id }) }
      ]
    );
  };

  const handleJoinChallenge = (challenge: Challenge) => {
    Alert.alert(
      'Join Challenge',
      `Are you ready to participate in ${challenge.name}? Show off your cooking skills and win amazing prizes!`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Join Now',
          onPress: () => {
            track('challenge_joined', { challengeId: challenge.id });
            Alert.alert('Success!', 'You have joined the challenge! Start creating your submission.');
          }
        }
      ]
    );
  };

  const handleSubmissionPress = (submission: ChallengeSubmission) => {
    Alert.alert(
      submission.title,
      `By ${submission.author}\n\n${submission.description || 'View full recipe and cooking details.'}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'View Recipe', onPress: () => track('submission_viewed', { submissionId: submission.id }) }
      ]
    );
  };

  const handleSubmissionLike = (submission: ChallengeSubmission) => {
    track('submission_liked', { submissionId: submission.id });
  };

  const handleSubmissionComment = (submission: ChallengeSubmission) => {
    Alert.alert('Comments', 'View and add comments for this submission');
    track('submission_comment_viewed', { submissionId: submission.id });
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Community</Text>
      <Text style={styles.headerSubtitle}>
        Join challenges and discover viral recipes
      </Text>
    </View>
  );

  const renderTabs = () => {
    const indicatorTranslateX = tabIndicatorAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, width * 0.5 - 40],
    });

    return (
      <View style={styles.tabsContainer}>
        <View style={styles.tabsWrapper}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'challenges' && styles.tabActive]}
            onPress={() => switchTab('challenges')}
          >
            <Ionicons 
              name="trophy" 
              size={20} 
              color={activeTab === 'challenges' ? Colors.primary : Colors.text.secondary} 
            />
            <Text style={[
              styles.tabText,
              activeTab === 'challenges' && styles.tabTextActive
            ]}>
              Challenges
            </Text>
            {activeChallenge && (
              <View style={styles.activeIndicator} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'social' && styles.tabActive]}
            onPress={() => switchTab('social')}
          >
            <Ionicons 
              name="people" 
              size={20} 
              color={activeTab === 'social' ? Colors.primary : Colors.text.secondary} 
            />
            <Text style={[
              styles.tabText,
              activeTab === 'social' && styles.tabTextActive
            ]}>
              Social Feed
            </Text>
          </TouchableOpacity>

          <Animated.View
            style={[
              styles.tabIndicator,
              {
                transform: [{ translateX: indicatorTranslateX }],
              },
            ]}
          />
        </View>
      </View>
    );
  };

  const renderChallengesContent = () => (
    <ScrollView 
      style={styles.challengesContent}
      showsVerticalScrollIndicator={false}
      bounces={true}
    >
      {/* Active Challenge Hero */}
      {activeChallenge && (
        <View style={styles.activeChallengeSection}>
          <Text style={styles.sectionTitle}>Active Challenge</Text>
          <ChallengeCard
            challenge={activeChallenge}
            onPress={() => handleChallengePress(activeChallenge)}
            onJoin={() => handleJoinChallenge(activeChallenge)}
          />
        </View>
      )}

      {/* Trending Submissions */}
      <View style={styles.submissionsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trending Submissions</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          ref={submissionsFlatListRef}
          data={trendingSubmissions}
          renderItem={({ item }) => (
            <SubmissionCard
              submission={item}
              onPress={() => handleSubmissionPress(item)}
              onLike={() => handleSubmissionLike(item)}
              onComment={() => handleSubmissionComment(item)}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.submissionsList}
          snapToInterval={width * 0.85 + 16}
          decelerationRate="fast"
          snapToAlignment="start"
        />
      </View>

      {/* Submit Your Own */}
      <TouchableOpacity
        style={styles.submitPrompt}
        onPress={() => {
          Alert.alert(
            'Submit Your Recipe',
            'Ready to join the challenge? Submit your amazing creation!',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Start Submission', onPress: () => track('submission_started') }
            ]
          );
        }}
      >
        <View style={styles.submitPromptContent}>
          <View style={styles.submitIcon}>
            <Ionicons name="camera" size={24} color={Colors.primary} />
          </View>
          <View style={styles.submitTextContainer}>
            <Text style={styles.submitTitle}>Submit Your Entry</Text>
            <Text style={styles.submitSubtitle}>Share your recipe and win prizes!</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.text.secondary} />
        </View>
      </TouchableOpacity>
      
      {/* Add some bottom padding for FAB */}
      <View style={{ height: 100 }} />
    </ScrollView>
  );

  const renderSocialFilters = () => (
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

  const renderSocialContent = () => (
    <ScrollView 
      style={styles.socialContent}
      showsVerticalScrollIndicator={false}
      bounces={true}
    >
      {renderSocialFilters()}
      {renderStatsBar()}
      
      <FlatList
        ref={flatListRef}
        data={filteredRecipes}
        renderItem={({ item, index }) => (
          <View style={[styles.cardContainer, { marginLeft: index === 0 ? 20 : 0 }]}>
            <CommunityRecipeCard
              recipe={item}
              onPress={() => handleRecipePress(item)}
              onShare={() => track('community_recipe_shared', { recipeId: item.id })}
              onSave={() => track('community_recipe_saved', { recipeId: item.id })}
              onViewCreator={() => {}}
            />
          </View>
        )}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.recipesList}
        snapToInterval={width * 0.85 + 16}
        decelerationRate="fast"
        snapToAlignment="start"
        scrollEnabled={true}
      />
      
      {/* Add some bottom padding for FAB */}
      <View style={{ height: 100 }} />
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.mainContent}>
        {/* Fixed Header Section */}
        <View style={styles.fixedHeader}>
          {renderHeader()}
          {renderTabs()}
        </View>
        
        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === 'challenges' ? renderChallengesContent() : renderSocialContent()}
        </View>
      </View>
      
      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          const action = activeTab === 'challenges' ? 'Submit Entry' : 'Share Recipe';
          const message = activeTab === 'challenges' 
            ? 'Ready to submit your challenge entry?' 
            : 'Share your amazing recipe with the community!';
          
          Alert.alert(
            action,
            message,
            [
              { text: 'Cancel', style: 'cancel' },
              { text: action, onPress: () => track(`${activeTab}_submission_started`) }
            ]
          );
        }}
      >
        <Ionicons name="add" size={24} color={Colors.white} />
      </TouchableOpacity>
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
    paddingBottom: 0,
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
  tabsContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  tabsWrapper: {
    position: 'relative',
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
    position: 'relative',
  },
  tabActive: {
    backgroundColor: Colors.white,
    shadowColor: Colors.shadow.medium,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  tabTextActive: {
    color: Colors.primary,
  },
  activeIndicator: {
    position: 'absolute',
    top: -2,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
  },
  tabIndicator: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: 4,
    bottom: 4,
    backgroundColor: Colors.white,
    borderRadius: 8,
    shadowColor: Colors.shadow.medium,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabContent: {
    flex: 1,
  },
  challengesContent: {
    flex: 1,
    paddingTop: 8,
  },
  activeChallengeSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  submissionsSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  submissionsList: {
    paddingLeft: 20,
    paddingRight: 8,
  },
  submitPrompt: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderStyle: 'solid',
  },
  submitPromptContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    gap: 16,
  },
  submitIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitTextContainer: {
    flex: 1,
  },
  submitTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  submitSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  socialContent: {
    flex: 1,
    paddingTop: 8,
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
  recipeFlatList: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
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
