import React, { useState } from 'react';
import GlassmorphicBackButton from '@/components/GlassmorphicBackButton';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity,
  Image,
  Switch,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useAppState } from '@/context/AppState';
import { useAuth } from '@/context/AuthContext';
import { theme, useTheme } from '@/theme';
import ProfileSetupBanner from '@/components/ProfileSetupBanner';

const { width } = Dimensions.get('window');

export default function Profile() {
  const router = useRouter();
  const { palette } = useTheme();
  const { prefs } = useAppState();
  const { user, profile, signOut } = useAuth();
  
  // State for settings
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const [privateAccount, setPrivateAccount] = useState(false);
  
  // User data from auth or mock for guests
  const userData = {
    name: user ? (profile?.full_name || user.email?.split('@')[0] || 'User') : 'Guest User',
    email: user?.email || 'guest@example.com',
    avatar: profile?.avatar_url || null,
    joinDate: user ? `Member since ${new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}` : 'Guest User',
    recipesCount: profile?.recipes_count || 0,
    savedCount: 0, // TODO: Implement favorites count
    followersCount: profile?.followers_count || 0,
    followingCount: profile?.following_count || 0,
    level: user ? 'Home Chef' : 'Guest',
    points: 0,
  };

  const settingsSections = [
    {
      title: 'Dietary Preferences',
      items: [
        {
          icon: 'nutrition',
          title: 'Diet Type',
          subtitle: (prefs.diets || []).join(', ') || 'Not set',
          onPress: () => router.push('/onboarding/diet'),
        },
        {
          icon: 'warning',
          title: 'Allergies',
          subtitle: (prefs.allergies || []).join(', ') || 'None',
          onPress: () => router.push('/onboarding/allergies'),
        },
        {
          icon: 'trending-up',
          title: 'Health Goals',
          subtitle: (prefs.goals || []).join(', ') || 'Not set',
          onPress: () => router.push('/onboarding/goals'),
        },
      ],
    },
    {
      title: 'App Settings',
      items: [
        {
          icon: 'notifications',
          title: 'Push Notifications',
          subtitle: notifications ? 'Enabled' : 'Disabled',
          toggle: true,
          value: notifications,
          onToggle: setNotifications,
        },
        {
          icon: 'moon',
          title: 'Dark Mode',
          subtitle: darkMode ? 'On' : 'Off',
          toggle: true,
          value: darkMode,
          onToggle: setDarkMode,
        },
        {
          icon: 'language',
          title: 'Language',
          subtitle: 'English',
          onPress: () => {},
        },
        {
          icon: 'speed',
          title: 'Units',
          subtitle: prefs.unitSystem || 'Metric',
          onPress: () => {},
        },
      ],
    },
    {
      title: 'Account & Privacy',
      items: [
        {
          icon: 'lock',
          title: 'Private Account',
          subtitle: privateAccount ? 'Private' : 'Public',
          toggle: true,
          value: privateAccount,
          onToggle: setPrivateAccount,
        },
        {
          icon: 'person',
          title: 'Edit Profile',
          onPress: () => {},
        },
        {
          icon: 'security',
          title: 'Privacy Settings',
          onPress: () => {},
        },
        {
          icon: 'key',
          title: 'Change Password',
          onPress: () => {},
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: 'home',
          title: 'Household Size',
          subtitle: `${prefs.householdSize || 1} ${prefs.householdSize === 1 ? 'person' : 'people'}`,
          onPress: () => router.push('/onboarding/household'),
        },
        {
          icon: 'payments',
          title: 'Weekly Budget',
          subtitle: `KES ${prefs.weeklyBudgetKES || 0}`,
          onPress: () => router.push('/onboarding/budget'),
        },
        {
          icon: 'play-circle',
          title: 'Auto-play Videos',
          subtitle: autoPlay ? 'On' : 'Off',
          toggle: true,
          value: autoPlay,
          onToggle: setAutoPlay,
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: 'help-circle',
          title: 'Help Center',
          onPress: () => {},
        },
        {
          icon: 'mail',
          title: 'Contact Us',
          onPress: () => {},
        },
        {
          icon: 'star',
          title: 'Rate App',
          onPress: () => {},
        },
        {
          icon: 'info-circle',
          title: 'About',
          onPress: () => {},
        },
      ],
    },
    // Add sign out section for authenticated users
    ...(user ? [{
      title: 'Account',
      items: [
        {
          icon: 'exit-to-app',
          title: 'Sign Out',
          onPress: async () => {
            try {
              await signOut();
              router.replace('/onboarding/start');
            } catch (error) {
              console.error('Sign out error:', error);
            }
          },
        },
      ],
    }] : [{
      title: 'Account',
      items: [
        {
          icon: 'account-plus',
          title: 'Sign In / Create Account',
          onPress: () => router.push('/auth/signin'),
        },
      ],
    }]),
  ];

  const achievementBadges = [
    { id: '1', name: 'First Recipe', icon: 'trophy', color: '#FFD700' },
    { id: '2', name: 'Week Streak', icon: 'fire', color: '#FF6B6B' },
    { id: '3', name: 'Master Chef', icon: 'chef-hat', color: '#4ECDC4' },
    { id: '4', name: 'Explorer', icon: 'compass', color: '#95E77E' },
  ];

  const renderSettingItem = (item: any) => {
    if (item.toggle) {
      return (
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <MaterialIcons name={item.icon} size={24} color={Colors.text.secondary} />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>{item.title}</Text>
              {item.subtitle && (
                <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
              )}
            </View>
          </View>
          <Switch
            value={item.value}
            onValueChange={item.onToggle}
            trackColor={{ false: Colors.gray[300], true: Colors.primary }}
            thumbColor={item.value ? Colors.white : Colors.gray[100]}
          />
        </View>
      );
    }

    return (
      <TouchableOpacity style={styles.settingItem} onPress={item.onPress}>
        <View style={styles.settingLeft}>
          <MaterialIcons name={item.icon} size={24} color={Colors.text.secondary} />
          <View style={styles.settingText}>
            <Text style={styles.settingTitle}>{item.title}</Text>
            {item.subtitle && (
              <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
            )}
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={Colors.gray[400]} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header: replace with glass back button only */}
        <View style={styles.header}>
          <GlassmorphicBackButton />
        </View>

        {/* Profile Setup Banner */}
        <ProfileSetupBanner />

        {/* User Info Section */}
        <View style={styles.userSection}>
          <View style={styles.userInfo}>
            <View style={styles.avatarContainer}>
              {userData.avatar ? (
                <Image source={{ uri: userData.avatar }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person" size={40} color={Colors.white} />
                </View>
              )}
              <TouchableOpacity style={styles.editAvatarButton}>
                <Ionicons name="camera" size={16} color={Colors.white} />
              </TouchableOpacity>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{userData.name}</Text>
              <Text style={styles.userEmail}>{userData.email}</Text>
              <Text style={styles.userJoinDate}>{userData.joinDate}</Text>
              <View style={styles.userLevel}>
                <MaterialCommunityIcons name="chef-hat" size={16} color={Colors.primary} />
                <Text style={styles.userLevelText}>{userData.level}</Text>
                <Text style={styles.userPoints}>• {userData.points} pts</Text>
              </View>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <TouchableOpacity style={styles.statItem}>
              <Text style={styles.statNumber}>{userData.recipesCount}</Text>
              <Text style={styles.statLabel}>Recipes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statItem}>
              <Text style={styles.statNumber}>{userData.savedCount}</Text>
              <Text style={styles.statLabel}>Saved</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statItem}>
              <Text style={styles.statNumber}>{userData.followersCount}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statItem}>
              <Text style={styles.statNumber}>{userData.followingCount}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickActionItem} onPress={() => router.push('/saved-recipes')}>
            <Ionicons name="bookmark" size={24} color={Colors.primary} />
            <Text style={styles.quickActionText}>Saved Recipes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionItem} onPress={() => router.push('/my-recipes')}>
            <Ionicons name="restaurant" size={24} color={Colors.primary} />
            <Text style={styles.quickActionText}>My Recipes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionItem} onPress={() => router.push('/history')}>
            <Ionicons name="time" size={24} color={Colors.primary} />
            <Text style={styles.quickActionText}>History</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionItem} onPress={() => router.push('/achievements')}>
            <Ionicons name="trophy" size={24} color={Colors.primary} />
            <Text style={styles.quickActionText}>Achievements</Text>
          </TouchableOpacity>
        </View>

        {/* Achievement Badges */}
        <View style={styles.achievementSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Achievements</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.badgesContainer}
          >
            {achievementBadges.map((badge) => (
              <View key={badge.id} style={styles.badgeItem}>
                <View style={[styles.badgeIcon, { backgroundColor: badge.color }]}>
                  <MaterialCommunityIcons name={badge.icon} size={24} color={Colors.white} />
                </View>
                <Text style={styles.badgeName}>{badge.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Settings Sections */}
        {settingsSections.map((section, index) => (
          <View key={index} style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.settingsCard}>
              {section.items.map((item, itemIndex) => (
                <React.Fragment key={itemIndex}>
                  {renderSettingItem(item)}
                  {itemIndex < section.items.length - 1 && <View style={styles.divider} />}
                </React.Fragment>
              ))}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton}>
          <MaterialIcons name="logout" size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacing} />
      </ScrollView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  userJoinDate: {
    fontSize: 12,
    color: Colors.text.tertiary,
    marginBottom: 8,
  },
  userLevel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userLevelText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  userPoints: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  quickActionItem: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    gap: 8,
  },
  quickActionText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.text.primary,
    textAlign: 'center',
  },
  achievementSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  badgesContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  badgeItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  badgeIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeName: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  settingsSection: {
    marginBottom: 24,
  },
  settingsCard: {
    marginHorizontal: 20,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    color: Colors.text.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: 52,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginVertical: 20,
    padding: 16,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.error,
  },
  bottomSpacing: {
    height: 40,
  },
});

