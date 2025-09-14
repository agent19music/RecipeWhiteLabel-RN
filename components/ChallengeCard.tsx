import { Colors } from '@/constants/Colors';
import { Challenge } from '@/data/challenges';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40;

interface ChallengeCardProps {
  challenge: Challenge;
  onPress: () => void;
  onJoin?: () => void;
}

export default function ChallengeCard({ challenge, onPress, onJoin }: ChallengeCardProps) {
  const getStatusColor = (status: Challenge['status']) => {
    switch (status) {
      case 'active':
        return Colors.success;
      case 'upcoming':
        return Colors.primary;
      case 'completed':
        return Colors.gray[400];
      default:
        return Colors.gray[400];
    }
  };

  const getStatusText = (status: Challenge['status']) => {
    switch (status) {
      case 'active':
        return 'Active Now';
      case 'upcoming':
        return 'Coming Soon';
      case 'completed':
        return 'Completed';
      default:
        return '';
    }
  };

  const getDaysRemaining = () => {
    const endDate = new Date(challenge.endDate);
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
      return `${diffDays} days left`;
    } else if (diffDays === 0) {
      return 'Last day!';
    } else {
      return 'Ended';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: challenge.backgroundColor || Colors.surface }]}
      onPress={onPress}
      activeOpacity={0.95}
    >
      {/* Header with Status */}
      <View style={styles.header}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(challenge.status) }]}>
          <Text style={styles.statusText}>{getStatusText(challenge.status)}</Text>
        </View>
        <View style={styles.prizeContainer}>
          <Ionicons name="trophy" size={16} color={challenge.themeColor || Colors.primary} />
          <Text style={[styles.prizeText, { color: challenge.themeColor || Colors.primary }]}>
            {challenge.prize}
          </Text>
        </View>
      </View>

      {/* Challenge Image */}
      <View style={styles.imageContainer}>
        <Image
          source={challenge.image}
          style={styles.challengeImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.3)']}
          style={styles.imageGradient}
        />
        
        {/* Floating Stats */}
        <View style={styles.floatingStats}>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="account-group" size={14} color={Colors.white} />
            <Text style={styles.statText}>{formatNumber(challenge.participants)}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="images" size={14} color={Colors.white} />
            <Text style={styles.statText}>{formatNumber(challenge.submissions)}</Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.challengeName}>{challenge.name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {challenge.description}
        </Text>

        {/* Tags */}
        <View style={styles.tagsContainer}>
          {challenge.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={[styles.tag, { borderColor: challenge.themeColor || Colors.primary }]}>
              <Text style={[styles.tagText, { color: challenge.themeColor || Colors.primary }]}>
                #{tag}
              </Text>
            </View>
          ))}
          {challenge.tags.length > 3 && (
            <Text style={styles.moreTagsText}>+{challenge.tags.length - 3}</Text>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.timeInfo}>
            <Ionicons name="time-outline" size={16} color={Colors.text.secondary} />
            <Text style={styles.timeText}>
              {challenge.status === 'active' ? getDaysRemaining() : `Starts ${new Date(challenge.startDate).toLocaleDateString()}`}
            </Text>
          </View>

          {challenge.status === 'active' && onJoin && (
            <TouchableOpacity
              style={[styles.joinButton, { backgroundColor: challenge.themeColor || Colors.primary }]}
              onPress={onJoin}
            >
              <Text style={styles.joinButtonText}>Join Challenge</Text>
              <Ionicons name="arrow-forward" size={14} color={Colors.white} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    borderRadius: 20,
    marginHorizontal: 20,
    marginVertical: 8,
    shadowColor: Colors.shadow.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 0,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.white,
  },
  prizeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  prizeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  imageContainer: {
    position: 'relative',
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  challengeImage: {
    width: '100%',
    height: 180,
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  floatingStats: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    gap: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.white,
  },
  content: {
    padding: 16,
    paddingTop: 0,
  },
  challengeName: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  moreTagsText: {
    fontSize: 12,
    color: Colors.text.tertiary,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  joinButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },
});

