import { Colors } from '@/constants/Colors';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

interface RecipeCardProps {
  id: string;
  title: string;
  image?: any;
  time?: string | number;
  difficulty?: string;
  servings?: number;
  calories?: number | string;
  rating?: number;
  reviews?: number;
  description?: string;
  chef?: string;
  cuisine?: string;
  ingredients?: Array<{ name: string; quantity?: string | number; unit?: string }>;
  tags?: string[];
  onPress?: () => void;
  personalNote?: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export default function ExpandableRecipeCard({
  id,
  title,
  image,
  time,
  difficulty,
  servings,
  calories,
  rating,
  reviews,
  description,
  chef,
  cuisine,
  ingredients = [],
  tags = [],
  onPress,
  personalNote,
  isFavorite = false,
  onToggleFavorite,
}: RecipeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const toggleExpand = () => {
    const toValue = isExpanded ? 0 : 1;
    
    Animated.parallel([
      Animated.spring(animatedHeight, {
        toValue,
        friction: 8,
        tension: 40,
        useNativeDriver: false,
      }),
      Animated.timing(rotateAnim, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.98,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
    
    setIsExpanded(!isExpanded);
  };

  const handleCardPress = () => {
    if (onPress) {
      onPress();
    } else {
      toggleExpand();
    }
  };

  const handleFavoritePress = () => {
    if (onToggleFavorite) {
      onToggleFavorite();
    }
  };

  const expandedHeight = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 300], // Adjust based on content
  });

  const arrowRotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  // Get personal greeting based on time of day
  const getPersonalGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Perfect for breakfast!";
    if (hour < 17) return "Great lunch choice!";
    return "Delicious dinner option!";
  };

  // Calculate prep level color
  const getDifficultyColor = () => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return '#10B981';
      case 'medium': return '#F59E0B';
      case 'hard': return '#EF4444';
      default: return Colors.primary;
    }
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity 
        style={styles.card} 
        activeOpacity={0.95}
        onPress={handleCardPress}
      >
        {/* Image Section */}
        <View style={styles.imageContainer}>
          {image ? (
            <Image source={image} style={styles.image} />
          ) : (
            <View style={[styles.image, styles.placeholderImage]}>
              <MaterialCommunityIcons name="food" size={40} color={Colors.gray[400]} />
            </View>
          )}
          
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.6)']}
            style={styles.imageGradient}
          />
          
          {/* Favorite Button */}
          <TouchableOpacity 
            style={styles.favoriteButton}
            onPress={handleFavoritePress}
          >
            <Ionicons 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={24} 
              color={isFavorite ? "#EF4444" : Colors.white} 
            />
          </TouchableOpacity>
          
          {/* Time Badge */}
          {time && (
            <View style={styles.timeBadge}>
              <Ionicons name="time-outline" size={14} color={Colors.white} />
              <Text style={styles.timeBadgeText}>
                {typeof time === 'number' ? `${time} min` : time}
              </Text>
            </View>
          )}
          
          {/* Rating */}
          {rating && (
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={14} color="#FFB800" />
              <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
            </View>
          )}
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={2}>{title}</Text>
            <TouchableOpacity onPress={toggleExpand} style={styles.expandButton}>
              <Animated.View style={{ transform: [{ rotate: arrowRotate }] }}>
                <Ionicons name="chevron-down" size={20} color={Colors.primary} />
              </Animated.View>
            </TouchableOpacity>
          </View>

          {/* Quick Info */}
          <View style={styles.quickInfo}>
            {cuisine && (
              <View style={styles.infoChip}>
                <MaterialCommunityIcons name="earth" size={12} color={Colors.gray[600]} />
                <Text style={styles.infoText}>{cuisine}</Text>
              </View>
            )}
            
            {difficulty && (
              <View style={[styles.infoChip, { backgroundColor: getDifficultyColor() + '20' }]}>
                <Text style={[styles.infoText, { color: getDifficultyColor() }]}>
                  {difficulty}
                </Text>
              </View>
            )}
            
            {calories && (
              <View style={styles.infoChip}>
                <Ionicons name="flame-outline" size={12} color={Colors.gray[600]} />
                <Text style={styles.infoText}>
                  {typeof calories === 'number' ? `${calories} cal` : calories}
                </Text>
              </View>
            )}
            
            {servings && (
              <View style={styles.infoChip}>
                <Ionicons name="people-outline" size={12} color={Colors.gray[600]} />
                <Text style={styles.infoText}>{servings}</Text>
              </View>
            )}
          </View>

          {/* Personal Touch */}
          {personalNote ? (
            <View style={styles.personalNote}>
              <MaterialCommunityIcons name="chef-hat" size={14} color={Colors.primary} />
              <Text style={styles.personalNoteText}>{personalNote}</Text>
            </View>
          ) : (
            <View style={styles.personalNote}>
              <Ionicons name="sparkles" size={14} color={Colors.primary} />
              <Text style={styles.personalNoteText}>{getPersonalGreeting()}</Text>
            </View>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <View style={styles.tags}>
              {tags.slice(0, 3).map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Expandable Content */}
        <Animated.View style={[styles.expandedContent, { height: expandedHeight }]}>
          {description && (
            <View style={styles.expandedSection}>
              <Text style={styles.expandedSectionTitle}>About this recipe</Text>
              <Text style={styles.description}>{description}</Text>
            </View>
          )}
          
          {ingredients.length > 0 && (
            <View style={styles.expandedSection}>
              <Text style={styles.expandedSectionTitle}>
                Key Ingredients ({ingredients.length})
              </Text>
              <View style={styles.ingredientsList}>
                {ingredients.slice(0, 5).map((ing, index) => (
                  <View key={index} style={styles.ingredientItem}>
                    <Ionicons name="checkmark-circle" size={16} color={Colors.primary} />
                    <Text style={styles.ingredientText}>
                      {ing.quantity && `${ing.quantity} ${ing.unit || ''} `}
                      {ing.name}
                    </Text>
                  </View>
                ))}
                {ingredients.length > 5 && (
                  <Text style={styles.moreIngredients}>
                    +{ingredients.length - 5} more ingredients
                  </Text>
                )}
              </View>
            </View>
          )}
          
          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={onPress}>
              <MaterialCommunityIcons name="chef-hat" size={20} color={Colors.white} />
              <Text style={styles.actionButtonText}>Start Cooking</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
              <Ionicons name="share-outline" size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: Colors.card || Colors.white,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: Colors.shadow?.medium || '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  imageContainer: {
    position: 'relative',
    height: 180,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    backgroundColor: Colors.gray?.[100] || '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  timeBadgeText: {
    fontSize: 12,
    color: Colors.white,
    fontWeight: '600',
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text?.primary || '#1F2937',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text?.primary || '#1F2937',
    marginRight: 8,
  },
  expandButton: {
    padding: 4,
  },
  quickInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  infoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray?.[100] || '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  infoText: {
    fontSize: 12,
    color: Colors.text?.secondary || '#6B7280',
    fontWeight: '500',
  },
  personalNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryMuted || '#E0F2FE',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
    marginBottom: 12,
  },
  personalNoteText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '500',
    flex: 1,
  },
  tags: {
    flexDirection: 'row',
    gap: 6,
  },
  tag: {
    backgroundColor: Colors.surface || '#F9FAFB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 11,
    color: Colors.text?.tertiary || '#9CA3AF',
    fontWeight: '500',
  },
  expandedContent: {
    overflow: 'hidden',
    paddingHorizontal: 16,
  },
  expandedSection: {
    marginBottom: 16,
  },
  expandedSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text?.primary || '#1F2937',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: Colors.text?.secondary || '#6B7280',
    lineHeight: 20,
  },
  ingredientsList: {
    gap: 6,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ingredientText: {
    fontSize: 13,
    color: Colors.text?.secondary || '#6B7280',
  },
  moreIngredients: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '500',
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    color: Colors.white,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 0,
    paddingHorizontal: 16,
    backgroundColor: Colors.primaryMuted || '#E0F2FE',
  },
});
