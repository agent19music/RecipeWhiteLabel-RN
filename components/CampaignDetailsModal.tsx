import { Colors } from '@/constants/Colors';
import { Challenge } from '@/data/challenges';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface CampaignDetailsModalProps {
  visible: boolean;
  campaign: Challenge | null;
  onClose: () => void;
  onJoinAndSubmit: (campaign: Challenge) => void;
}

export default function CampaignDetailsModal({
  visible,
  campaign,
  onClose,
  onJoinAndSubmit,
}: CampaignDetailsModalProps) {
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Slide up animation
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 10,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Slide down animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!campaign) return null;

  const getDaysRemaining = () => {
    const endDate = new Date(campaign.endDate);
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
      return `${diffDays} days remaining`;
    } else if (diffDays === 0) {
      return 'Last day to participate!';
    } else {
      return 'Challenge ended';
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

  const handleJoin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onJoinAndSubmit(campaign);
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
      </Animated.View>

      {/* Modal Content */}
      <Animated.View
        style={[
          styles.modalContainer,
          {
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={[styles.modal, { paddingTop: insets.top }]}>
          {/* Header with Image */}
          <View style={styles.imageHeader}>
            <Image
              source={campaign.image}
              style={styles.headerImage}
              resizeMode="cover"
            />
            <View style={styles.imageOverlay} />
            
            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleClose}
            >
              <BlurView intensity={50} style={styles.blurButton}>
                <Ionicons name="close" size={20} color={Colors.white} />
              </BlurView>
            </TouchableOpacity>

            {/* Header Content */}
            <View style={styles.headerContent}>
              {campaign.status === 'active' && (
                <View style={styles.liveBadge}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>LIVE NOW</Text>
                </View>
              )}
              <Text style={styles.title}>{campaign.name}</Text>
              <Text style={styles.subtitle}>{getDaysRemaining()}</Text>
            </View>
          </View>

          {/* Scrollable Content */}
          <ScrollView
            style={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={true}
          >
            {/* Stats Row */}
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Ionicons name="people" size={20} color={Colors.text.secondary} />
                <Text style={styles.statNumber}>{formatNumber(campaign.participants)}</Text>
                <Text style={styles.statLabel}>Participants</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Ionicons name="images" size={20} color={Colors.text.secondary} />
                <Text style={styles.statNumber}>{formatNumber(campaign.submissions)}</Text>
                <Text style={styles.statLabel}>Submissions</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Ionicons name="trophy" size={20} color={Colors.primary} />
                <Text style={[styles.statNumber, { color: Colors.primary }]}>{campaign.prize}</Text>
                <Text style={styles.statLabel}>Prize</Text>
              </View>
            </View>

            {/* Description */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About this Challenge</Text>
              <Text style={styles.description}>{campaign.description}</Text>
            </View>

            {/* Rules */}
            {campaign.rules && campaign.rules.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Rules</Text>
                {campaign.rules.map((rule, index) => (
                  <View key={index} style={styles.ruleItem}>
                    <Text style={styles.ruleNumber}>{index + 1}</Text>
                    <Text style={styles.ruleText}>{rule}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Judging Criteria */}
            {campaign.judgesCriteria && campaign.judgesCriteria.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Judging Criteria</Text>
                {campaign.judgesCriteria.map((criteria, index) => (
                  <View key={index} style={styles.criteriaItem}>
                    <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
                    <Text style={styles.criteriaText}>{criteria}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Tags */}
            {campaign.tags && campaign.tags.length > 0 && (
              <View style={styles.section}>
                <View style={styles.tagsContainer}>
                  {campaign.tags.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>#{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Bottom Padding */}
            <View style={{ height: 100 }} />
          </ScrollView>

          {/* Fixed Bottom CTA */}
          <View style={[styles.bottomCTA, { paddingBottom: insets.bottom + 20 }]}>
            <TouchableOpacity
              style={[
                styles.ctaButton,
                campaign.status !== 'active' && styles.ctaButtonDisabled
              ]}
              onPress={handleJoin}
              disabled={campaign.status !== 'active'}
            >
              <Text style={styles.ctaText}>
                {campaign.status === 'active' ? 'Join & Submit Entry' : 'Challenge Not Active'}
              </Text>
              {campaign.status === 'active' && (
                <Ionicons name="arrow-forward" size={20} color={Colors.white} />
              )}
            </TouchableOpacity>
            {campaign.status === 'active' && (
              <Text style={styles.ctaHint}>Start creating your winning recipe</Text>
            )}
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modal: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  imageHeader: {
    height: 300,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
  },
  blurButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  headerContent: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,59,48,0.9)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
    gap: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.white,
  },
  liveText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.9)',
  },
  scrollContent: {
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 16,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginVertical: 8,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.text.secondary,
  },
  ruleItem: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
  },
  ruleNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
    width: 20,
  },
  ruleText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: Colors.text.secondary,
  },
  criteriaItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 8,
  },
  criteriaText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: Colors.text.secondary,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  bottomCTA: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  ctaButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  ctaButtonDisabled: {
    backgroundColor: Colors.gray[400],
  },
  ctaText: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.white,
  },
  ctaHint: {
    fontSize: 13,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginTop: 8,
  },
});