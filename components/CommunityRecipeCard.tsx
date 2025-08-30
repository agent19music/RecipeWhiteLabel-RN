import { Colors } from '@/constants/Colors';
import { Recipe } from '@/data/types';
import { track } from '@/utils/analytics';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    Modal,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;

interface CommunityRecipeCardProps {
  recipe: Recipe;
  onPress?: () => void;
  onShare?: () => void;
  onSave?: () => void;
  onViewCreator?: () => void;
}

export default function CommunityRecipeCard({ 
  recipe, 
  onPress, 
  onShare, 
  onSave, 
  onViewCreator 
}: CommunityRecipeCardProps) {
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleCardPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
    track('community_recipe_viewed', { 
      recipeId: recipe.id, 
      author: recipe.author,
      platform: recipe.socialMedia?.platform 
    });
  };

  const handleVideoPress = () => {
    setShowVideoModal(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    track('community_recipe_video_opened', { 
      recipeId: recipe.id, 
      author: recipe.author 
    });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this amazing ${recipe.title} recipe by ${recipe.author}! ${recipe.sourceUrl}`,
        title: recipe.title,
      });
      onShare?.();
      track('community_recipe_shared', { 
        recipeId: recipe.id, 
        author: recipe.author 
      });
    } catch (error) {
      console.error('Error sharing recipe:', error);
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onSave?.();
    track('community_recipe_saved', { 
      recipeId: recipe.id, 
      saved: !isSaved 
    });
  };

  const handleCreatorPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onViewCreator?.();
    track('community_recipe_creator_viewed', { 
      author: recipe.author,
      platform: recipe.socialMedia?.platform 
    });
  };

  const formatFollowers = (followers?: string) => {
    if (!followers) return '';
    return followers.replace(/(\d+\.?\d*)([KMB])/, '$1$2 followers');
  };

  return (
    <>
      <TouchableOpacity 
        style={styles.card}
        onPress={handleCardPress}
        activeOpacity={0.95}
      >
        {/* Hero Image with Overlay */}
        <View style={styles.heroContainer}>
          <Image
            source={typeof recipe.image === 'string' ? { uri: recipe.image } : recipe.image}
            style={styles.heroImage}
            resizeMode="cover"
          />
          
          {/* Gradient Overlay */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.heroOverlay}
          />
          
          {/* Video Play Button */}
          <TouchableOpacity 
            style={styles.playButton}
            onPress={handleVideoPress}
          >
            <BlurView intensity={80} style={styles.playButtonBlur}>
              <Ionicons name="play" size={32} color={Colors.white} />
            </BlurView>
          </TouchableOpacity>
          
          {/* TikTok Badge */}
          {recipe.socialMedia?.platform === 'TikTok' && (
            <View style={styles.platformBadge}>
              <MaterialIcons name="tiktok" size={16} color={Colors.white} />
              <Text style={styles.platformText}>TikTok</Text>
            </View>
          )}
          
          {/* Save Button */}
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Ionicons 
              name={isSaved ? "bookmark" : "bookmark-outline"} 
              size={24} 
              color={isSaved ? Colors.primary : Colors.white} 
            />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Creator Info */}
          <TouchableOpacity 
            style={styles.creatorRow}
            onPress={handleCreatorPress}
          >
            <View style={styles.creatorAvatar}>
              <MaterialCommunityIcons name="chef-hat" size={20} color={Colors.primary} />
            </View>
            <View style={styles.creatorInfo}>
              <Text style={styles.creatorName}>{recipe.author}</Text>
              <Text style={styles.creatorHandle}>
                {recipe.socialMedia?.handle} • {formatFollowers(recipe.socialMedia?.followers)}
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.gray[400]} />
          </TouchableOpacity>

          {/* Recipe Title */}
          <Text style={styles.title} numberOfLines={2}>
            {recipe.title}
          </Text>

          {/* Summary */}
          <Text style={styles.summary} numberOfLines={3}>
            {recipe.summary}
          </Text>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Ionicons name="time-outline" size={16} color={Colors.gray[500]} />
              <Text style={styles.statText}>{recipe.time}</Text>
            </View>
            
            <View style={styles.stat}>
              <Ionicons name="restaurant-outline" size={16} color={Colors.gray[500]} />
              <Text style={styles.statText}>{recipe.details?.servings} servings</Text>
            </View>
            
            <View style={styles.stat}>
              <MaterialIcons name="trending-up" size={16} color={Colors.gray[500]} />
              <Text style={styles.statText}>{recipe.difficulty}</Text>
            </View>
          </View>

          {/* Engagement Row */}
          <View style={styles.engagementRow}>
            <View style={styles.engagementStats}>
              <View style={styles.engagementStat}>
                <Ionicons name="heart" size={16} color={Colors.error} />
                <Text style={styles.engagementText}>
                  {recipe.details?.favoriteCount ? (recipe.details.favoriteCount / 1000).toFixed(1) + 'K' : '0'}
                </Text>
              </View>
              
              <View style={styles.engagementStat}>
                <Ionicons name="star" size={16} color={Colors.warning} />
                <Text style={styles.engagementText}>
                  {recipe.details?.rating?.toFixed(1) || '0.0'}
                </Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.shareButton}
              onPress={handleShare}
            >
              <Ionicons name="share-outline" size={20} color={Colors.gray[600]} />
            </TouchableOpacity>
          </View>

          {/* Viral Badge */}
          {(recipe.details?.favoriteCount ?? 0) > 5000 && (
            <View style={styles.viralBadge}>
              <MaterialCommunityIcons name="fire" size={16} color={Colors.white} />
              <Text style={styles.viralText}>VIRAL</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      {/* Video Modal */}
      <Modal
        visible={showVideoModal}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setShowVideoModal(false)}
      >
        <View style={styles.videoModal}>
          <View style={styles.videoHeader}>
            <TouchableOpacity 
              onPress={() => setShowVideoModal(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={28} color={Colors.white} />
            </TouchableOpacity>
            
            <View style={styles.videoTitle}>
              <Text style={styles.videoTitleText} numberOfLines={1}>
                {recipe.title}
              </Text>
              <Text style={styles.videoCreator}>
                by {recipe.author}
              </Text>
            </View>
          </View>

          {/* Video Container */}
          <View style={styles.videoContainer}>
            {/* Placeholder for TikTok Embed */}
            <View style={styles.videoPlaceholder}>
              <MaterialCommunityIcons name="video" size={64} color={Colors.gray[400]} />
              <Text style={styles.videoPlaceholderText}>
                TikTok Video Player
              </Text>
              <Text style={styles.videoPlaceholderSubtext}>
                Video will be embedded here when you add the TikTok video assets
              </Text>
              
              {recipe.videoUrl && (
                <TouchableOpacity 
                  style={styles.openTikTokButton}
                  onPress={() => {
                    // In a real implementation, this would open the TikTok app or web URL
                    Alert.alert('Open TikTok', 'This would open the TikTok app or web browser');
                  }}
                >
                  <MaterialIcons name="tiktok" size={20} color={Colors.white} />
                  <Text style={styles.openTikTokText}>Open in TikTok</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Video Controls */}
          <View style={styles.videoControls}>
            <TouchableOpacity style={styles.videoControlButton}>
              <Ionicons name="heart-outline" size={24} color={Colors.white} />
              <Text style={styles.videoControlText}>Like</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.videoControlButton}>
              <Ionicons name="bookmark-outline" size={24} color={Colors.white} />
              <Text style={styles.videoControlText}>Save</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.videoControlButton} onPress={handleShare}>
              <Ionicons name="share-outline" size={24} color={Colors.white} />
              <Text style={styles.videoControlText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: Colors.white,
    borderRadius: 20,
    marginHorizontal: 8,
    marginVertical: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  heroContainer: {
    position: 'relative',
    height: 220,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -30 }, { translateY: -30 }],
  },
  playButtonBlur: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  platformBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  platformText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  saveButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  creatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  creatorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  creatorInfo: {
    flex: 1,
  },
  creatorName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  creatorHandle: {
    fontSize: 12,
    color: Colors.text.tertiary,
    marginTop: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 8,
    lineHeight: 24,
  },
  summary: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  engagementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  engagementStats: {
    flexDirection: 'row',
    gap: 16,
  },
  engagementStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  engagementText: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: '600',
  },
  shareButton: {
    padding: 8,
  },
  viralBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  viralText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  
  // Video Modal Styles
  videoModal: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  closeButton: {
    padding: 8,
    marginRight: 12,
  },
  videoTitle: {
    flex: 1,
  },
  videoTitleText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  videoCreator: {
    color: Colors.gray[400],
    fontSize: 14,
    marginTop: 2,
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  videoPlaceholderText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  videoPlaceholderSubtext: {
    color: Colors.gray[400],
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    maxWidth: 280,
  },
  openTikTokButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 20,
    gap: 8,
  },
  openTikTokText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  videoControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingBottom: 40,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  videoControlButton: {
    alignItems: 'center',
    padding: 10,
  },
  videoControlText: {
    color: Colors.white,
    fontSize: 12,
    marginTop: 4,
  },
});
