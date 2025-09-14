import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { theme, useTheme } from '../theme';
import * as Haptics from 'expo-haptics';

export default function ProfileSetupBanner() {
  const { palette } = useTheme();
  const router = useRouter();
  const { user, isOnboardingComplete } = useAuth();

  if (!user || isOnboardingComplete) {
    return null;
  }

  const handleSetupProfile = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/onboarding/diet');
  };

  return (
    <TouchableOpacity
      style={[styles.banner, { backgroundColor: palette.primary + '15', borderColor: palette.primary + '30' }]}
      onPress={handleSetupProfile}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: palette.primary }]}>
          <MaterialCommunityIcons name="account-cog" size={20} color="#FFFFFF" />
        </View>
        
        <View style={styles.textContent}>
          <Text style={[styles.title, { color: palette.text }]}>
            Complete Your Profile
          </Text>
          <Text style={[styles.subtitle, { color: palette.subtext }]}>
            Set up your preferences to get personalized recipe recommendations
          </Text>
        </View>
        
        <MaterialCommunityIcons 
          name="chevron-right" 
          size={20} 
          color={palette.primary} 
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderRadius: 16,
    borderWidth: 1,
    padding: theme.space.lg,
    marginHorizontal: theme.space.lg,
    marginBottom: theme.space.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.space.md,
  },
  textContent: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 18,
  },
});