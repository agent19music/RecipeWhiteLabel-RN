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

export default function ChallengeCard({ challenge, onPress }: ChallengeCardProps) {
  const getDaysRemaining = () => {
    const endDate = new Date(challenge.endDate);
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
      return `${diffDays} days`;
    } else if (diffDays === 0) {
      return 'Final day';
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
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Clean Image Display */}
      <View style={styles.imageContainer}>
        <Image
          source={challenge.image}
          style={styles.challengeImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.imageGradient}
        />
        
        {/* Minimal Overlay Content */}
        <View style={styles.overlayContent}>
          <View style={styles.overlayHeader}>
            {challenge.status === 'active' && (
              <View style={styles.liveIndicator}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LIVE</Text>
              </View>
            )}
          </View>

          <View style={styles.overlayFooter}>
            <View>
              <Text style={styles.challengeName}>{challenge.name}</Text>
              <Text style={styles.timeRemaining}>
                {challenge.status === 'active' ? getDaysRemaining() : new Date(challenge.startDate).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statPill}>
                <Ionicons name="people" size={12} color={Colors.white} />
                <Text style={styles.statValue}>{formatNumber(challenge.participants)}</Text>
              </View>
              <View style={styles.statPill}>
                <Ionicons name="trophy" size={12} color={Colors.white} />
                <Text style={styles.statValue}>{challenge.prize}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: 280,
    borderRadius: 24,
    marginHorizontal: 20,
    marginVertical: 12,
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
    overflow: 'hidden',
  },
  imageContainer: {
    flex: 1,
    position: 'relative',
  },
  challengeImage: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 180,
  },
  overlayContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    padding: 20,
  },
  overlayHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    backdropFilter: 'blur(10px)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF3B30',
  },
  liveText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: 0.5,
  },
  overlayFooter: {
    gap: 12,
  },
  challengeName: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  timeRemaining: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.9)',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    backdropFilter: 'blur(10px)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.white,
  },
});

