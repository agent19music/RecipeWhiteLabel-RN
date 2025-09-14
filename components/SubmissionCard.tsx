import { Colors } from '@/constants/Colors';
import { ChallengeSubmission } from '@/data/challenges';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;

interface SubmissionCardProps {
  submission: ChallengeSubmission;
  onPress: () => void;
  onLike?: () => void;
  onComment?: () => void;
  onViewProfile?: () => void;
}

export default function SubmissionCard({ 
  submission, 
  onPress, 
  onLike, 
  onComment,
  onViewProfile 
}: SubmissionCardProps) {
  const [isLiked, setIsLiked] = useState(submission.isLiked || false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onLike?.();
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getBadgeIcon = (badge?: string) => {
    switch (badge) {
      case 'verified':
        return 'checkmark-circle';
      case 'top_chef':
        return 'trophy';
      case 'rising_star':
        return 'star';
      default:
        return null;
    }
  };

  const getBadgeColor = (badge?: string) => {
    switch (badge) {
      case 'verified':
        return Colors.info;
      case 'top_chef':
        return Colors.warning;
      case 'rising_star':
        return Colors.primary;
      default:
        return Colors.gray[400];
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy':
        return Colors.success;
      case 'medium':
        return Colors.warning;
      case 'hard':
        return Colors.error;
      default:
        return Colors.gray[400];
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffDays > 0) {
      return `${diffDays}d ago`;
    } else if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes}m ago`;
    } else {
      return 'Just now';
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.98}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.authorInfo} onPress={onViewProfile}>
          <Image
            source={submission.authorAvatar || require('@/assets/images/food-example.jpg')}
            style={styles.authorAvatar}
          />
          <View style={styles.authorDetails}>
            <View style={styles.authorNameContainer}>
              <Text style={styles.authorName}>{submission.author}</Text>
              {submission.authorBadge && (
                <Ionicons
                  name={getBadgeIcon(submission.authorBadge) as any}
                  size={14}
                  color={getBadgeColor(submission.authorBadge)}
                />
              )}
            </View>
            <Text style={styles.timeAgo}>{getTimeAgo(submission.submittedAt)}</Text>
            {submission.location && (
              <Text style={styles.location}>
                <Ionicons name="location" size={12} color={Colors.text.tertiary} />
                {' '}{submission.location}
              </Text>
            )}
          </View>
        </TouchableOpacity>

        {submission.isPinned && (
          <View style={styles.pinnedBadge}>
            <MaterialCommunityIcons name="pin" size={16} color={Colors.primary} />
          </View>
        )}
      </View>

      {/* Image Carousel */}
      <View style={styles.imageContainer}>
        <Image
          source={submission.images[0]}
          style={styles.submissionImage}
          resizeMode="cover"
        />
        {submission.images.length > 1 && (
          <View style={styles.imageCountBadge}>
            <Ionicons name="images" size={12} color={Colors.white} />
            <Text style={styles.imageCountText}>{submission.images.length}</Text>
          </View>
        )}

        {/* Difficulty Badge */}
        {submission.difficulty && (
          <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(submission.difficulty) }]}>
            <Text style={styles.difficultyText}>{submission.difficulty.toUpperCase()}</Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>{submission.title}</Text>
        {submission.description && (
          <Text style={styles.description} numberOfLines={2}>
            {submission.description}
          </Text>
        )}

        {/* Recipe Info */}
        {submission.cookingTime && (
          <View style={styles.recipeInfo}>
            <View style={styles.infoItem}>
              <Ionicons name="time" size={14} color={Colors.primary} />
              <Text style={styles.infoText}>{submission.cookingTime} min</Text>
            </View>
          </View>
        )}

        {/* Tags */}
        {submission.tags && submission.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {submission.tags.slice(0, 3).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <View style={styles.leftActions}>
          <TouchableOpacity
            style={[styles.actionButton, isLiked && styles.actionButtonLiked]}
            onPress={handleLike}
          >
            <Ionicons
              name={isLiked ? 'heart' : 'heart-outline'}
              size={20}
              color={isLiked ? Colors.error : Colors.text.secondary}
            />
            <Text style={[styles.actionText, isLiked && { color: Colors.error }]}>
              {formatNumber(submission.votes)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={onComment}>
            <Ionicons name="chatbubble-outline" size={20} color={Colors.text.secondary} />
            <Text style={styles.actionText}>{formatNumber(submission.comments)}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.rightActions}>
          <TouchableOpacity style={styles.shareButton}>
            <Ionicons name="share-outline" size={18} color={Colors.text.secondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.bookmarkButton}>
            <Ionicons name="bookmark-outline" size={18} color={Colors.text.secondary} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginHorizontal: 8,
    marginVertical: 6,
    shadowColor: Colors.shadow.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  authorDetails: {
    flex: 1,
  },
  authorNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  timeAgo: {
    fontSize: 12,
    color: Colors.text.tertiary,
    marginTop: 2,
  },
  location: {
    fontSize: 12,
    color: Colors.text.tertiary,
    marginTop: 1,
  },
  pinnedBadge: {
    padding: 4,
  },
  imageContainer: {
    position: 'relative',
  },
  submissionImage: {
    width: '100%',
    height: 240,
  },
  imageCountBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  imageCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.white,
  },
  difficultyBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.white,
  },
  content: {
    padding: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  recipeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: Colors.gray[100],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  leftActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 4,
  },
  actionButtonLiked: {
    // Additional styles for liked state
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  rightActions: {
    flexDirection: 'row',
    gap: 16,
  },
  shareButton: {
    padding: 4,
  },
  bookmarkButton: {
    padding: 4,
  },
});
