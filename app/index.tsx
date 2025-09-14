import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { useAppState } from '../context/AppState';
import { useTheme } from '../theme';

export default function Entry() {
  const { user, profile, loading, isOnboardingComplete } = useAuth();
  const { onboarded } = useAppState();
  const { palette } = useTheme();

  if (loading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: palette.bg 
      }}>
        <ActivityIndicator size="large" color={palette.primary} />
      </View>
    );
  }

  // Not authenticated - go to onboarding then auth
  if (!user) {
    // Use the existing AppState onboarding logic for guests
    if (!onboarded) return <Redirect href="/onboarding/start" />;
    return <Redirect href="/(tabs)" />;
  }

  // Authenticated but onboarding not complete - redirect to onboarding
  if (user && !isOnboardingComplete) {
    return <Redirect href="/onboarding/diet" />;
  }

  // Authenticated and onboarding complete - go to main app
  return <Redirect href="/(tabs)" />;
}

