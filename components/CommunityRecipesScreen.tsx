import CampaignDetailsModal from '@/components/CampaignDetailsModal';
import ChallengeCard from '@/components/ChallengeCard';
import SubmissionCard from '@/components/SubmissionCard';
import SubmissionModal from '@/components/SubmissionModal';
import { Colors } from '@/constants/Colors';
import { Challenge, ChallengeSubmission, getTrendingSubmissions } from '@/data/challenges';
import { supabase } from '@/lib/supabase';
import { track } from '@/utils/analytics';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { TrophyIcon } from 'phosphor-react-native';  
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
  const submissionsFlatListRef = useRef<FlatList>(null);
  
  // Campaign data from Supabase
  const [activeCampaigns, setActiveCampaigns] = useState<Challenge[]>([]);
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(true);
  const [trendingSubmissions, setTrendingSubmissions] = useState<ChallengeSubmission[]>([]);
  
  // Modal states
  const [selectedCampaign, setSelectedCampaign] = useState<Challenge | null>(null);
  const [showCampaignDetails, setShowCampaignDetails] = useState(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);

  // Fetch active campaigns from Supabase
  useEffect(() => {
    fetchActiveCampaigns();
  }, []);

  const fetchActiveCampaigns = async () => {
    try {
      setIsLoadingCampaigns(true);
      
      // Fetch active campaigns from Supabase
      const { data: campaigns, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching campaigns:', error);
        return;
      }

      if (campaigns && campaigns.length > 0) {
        // Map Supabase campaign data to Challenge interface
        const mappedCampaigns: Challenge[] = campaigns.map(campaign => ({
          id: campaign.id,
          name: campaign.title,
          status: 'active' as const,
          startDate: campaign.start_date,
          endDate: campaign.end_date,
          participants: campaign.participants_count || 0,
          submissions: campaign.submissions_count || 0,
          prize: campaign.prize_description || 'Amazing prizes',
          description: campaign.description,
          image: campaign.cover_image_url ? { uri: campaign.cover_image_url } : require('@/assets/images/airfryerchallengeposter.jpg'),
          tags: campaign.tags ? (Array.isArray(campaign.tags) ? campaign.tags : []) : [],
          rules: campaign.rules ? (Array.isArray(campaign.rules) ? campaign.rules : [campaign.rules]) : [],
          totalPrizeValue: campaign.total_prize_value_kes,
          submissionDeadline: campaign.submission_deadline || campaign.end_date,
          backgroundColor: campaign.background_color || '#FFFBF0',
          themeColor: campaign.theme_color || '#FF8F00',
        }));

        setActiveCampaigns(mappedCampaigns);
        // Set the first campaign as the active challenge
        if (mappedCampaigns.length > 0) {
          setActiveChallenge(mappedCampaigns[0]);
        }
      }

      // Fetch trending submissions if there's an active campaign
      if (campaigns && campaigns.length > 0) {
        await fetchTrendingSubmissions(campaigns[0].id);
      }
    } catch (error) {
      console.error('Error in fetchActiveCampaigns:', error);
    } finally {
      setIsLoadingCampaigns(false);
    }
  };

  const fetchTrendingSubmissions = async (campaignId: string) => {
    try {
      // Fetch submissions from campaign_contributions table
      const { data: submissions, error } = await supabase
        .from('campaign_contributions')
        .select(`
          *,
          profiles:user_id (
            full_name,
            avatar_url
          )
        `)
        .eq('campaign_id', campaignId)
        .eq('status', 'approved')
        .order('votes_count', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching submissions:', error);
        return;
      }

      if (submissions && submissions.length > 0) {
        // Map to ChallengeSubmission interface
        const mappedSubmissions: ChallengeSubmission[] = submissions.map(sub => ({
          id: sub.id,
          challengeId: parseInt(campaignId),
          campaign: activeChallenge?.name || 'Active Campaign',
          title: sub.title,
          author: sub.profiles?.full_name || 'Anonymous Chef',
          authorAvatar: sub.profiles?.avatar_url ? { uri: sub.profiles.avatar_url } : require('@/assets/images/food-example.jpg'),
          submittedAt: sub.submitted_at || sub.created_at,
          votes: sub.votes_count || 0,
          comments: sub.comments_count || 0,
          status: 'approved' as const,
          images: sub.images ? (Array.isArray(sub.images) ? sub.images.map(img => ({ uri: img })) : []) : [require('@/assets/images/food-example.jpg')],
          description: sub.description,
          isLiked: false,
        }));

        setTrendingSubmissions(mappedSubmissions);
      } else {
        // Use mock data as fallback
        setTrendingSubmissions(getTrendingSubmissions());
      }
    } catch (error) {
      console.error('Error in fetchTrendingSubmissions:', error);
      // Use mock data as fallback
      setTrendingSubmissions(getTrendingSubmissions());
    }
  };

  const handleChallengePress = (challenge: Challenge) => {
    setSelectedCampaign(challenge);
    setShowCampaignDetails(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    track('challenge_opened', { challengeId: challenge.id });
  };

  const handleJoinAndSubmit = (campaign: Challenge) => {
    setShowCampaignDetails(false);
    setSelectedCampaign(campaign);
    // Small delay for modal transition
    setTimeout(() => {
      setShowSubmissionModal(true);
    }, 300);
  };

  const handleSubmissionSuccess = async () => {
    // Refresh campaigns to update counts
    await fetchActiveCampaigns();
    track('submission_completed');
  };

  const handleSubmissionPress = (submission: ChallengeSubmission) => {
    // Navigate to submission details or show in modal
    track('submission_viewed', { submissionId: submission.id });
  };

  const handleVoteSubmission = async (submission: ChallengeSubmission) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Login Required', 'Please login to vote');
        return;
      }

      const { error } = await supabase
        .from('campaign_votes')
        .insert({
          contribution_id: submission.id,
          campaign_id: submission.challengeId,
          user_id: user.id,
          vote_value: 1,
        });

      if (error) {
        if (error.code === '23505') {
          Alert.alert('Already Voted', 'You have already voted for this submission');
        } else {
          console.error('Vote error:', error);
        }
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        // Refresh submissions
        if (activeChallenge) {
          await fetchTrendingSubmissions(activeChallenge.id.toString());
        }
      }
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Challenges</Text>
      <Text style={styles.headerSubtitle}>
        Compete, create, and win amazing prizes
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {renderHeader()}
      {/* Loading state */}
      {isLoadingCampaigns && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading campaigns...</Text>
        </View>
      )}

        {/* Active Challenge */}
        {!isLoadingCampaigns && activeChallenge && (
          <ChallengeCard
            challenge={activeChallenge}
            onPress={() => handleChallengePress(activeChallenge)}
          />
        )}

        {/* No campaigns message */}
        {!isLoadingCampaigns && !activeChallenge && ( 
          <View style={styles.noCampaignsContainer}>
            <TrophyIcon size={48} color={Colors.text.secondary} />
            <Text style={styles.noCampaignsTitle}>No Active Challenges</Text>
            <Text style={styles.noCampaignsText}>Check back soon for exciting cooking competitions!</Text>
          </View>
        )}

        {/* Trending Submissions */}
        {!isLoadingCampaigns && trendingSubmissions.length > 0 && (
          <View style={styles.submissionsSection}>
            <Text style={styles.sectionTitle}>Top Entries</Text>
            <FlatList
              ref={submissionsFlatListRef}
              data={trendingSubmissions}
              renderItem={({ item }) => (
                <SubmissionCard
                  submission={item}
                  onPress={() => handleSubmissionPress(item)}
                  onLike={() => handleVoteSubmission(item)}
                  onComment={() => {}}
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
        )}
      </ScrollView>

      {/* Modals */}
      <CampaignDetailsModal
        visible={showCampaignDetails}
        campaign={selectedCampaign}
        onClose={() => setShowCampaignDetails(false)}
        onJoinAndSubmit={handleJoinAndSubmit}
      />

      <SubmissionModal
        visible={showSubmissionModal}
        campaign={selectedCampaign}
        onClose={() => setShowSubmissionModal(false)}
        onSubmitSuccess={handleSubmissionSuccess}
      />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginTop: 12,
  },
  noCampaignsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  noCampaignsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  noCampaignsText: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});
