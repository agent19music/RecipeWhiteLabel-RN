import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Redirect } from 'expo-router';
import * as Linking from 'expo-linking';
import { useAuth } from '../context/AuthContext';
import { useAppState } from '../context/AppState';
import { useTheme } from '../theme';

export default function Entry() {
  const { user, profile, loading, isOnboardingComplete, handleAuthCallback } = useAuth();
  const { onboarded } = useAppState();
  const { palette } = useTheme();

  // Handle deep links for OAuth callbacks
  useEffect(() => {
    const handleDeepLink = async (url: string) => {
      console.log('Deep link received:', url);
      if (url.includes('/auth') && (url.includes('access_token') || url.includes('error'))) {
        try {
          await handleAuthCallback(url);
        } catch (error) {
          console.error('Failed to handle auth callback:', error);
        }
      }
    };

    // Handle the initial URL if the app was opened via deep link
    const getInitialUrl = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        handleDeepLink(initialUrl);
      }
    };

    getInitialUrl();

    // Listen for deep links while the app is running
    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    return () => subscription?.remove();
  }, [handleAuthCallback]);

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

