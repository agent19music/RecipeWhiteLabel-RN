import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User, AuthChangeEvent } from '@supabase/supabase-js';
import { Alert, Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { makeRedirectUri } from 'expo-auth-session';
import { supabase } from '../lib/supabase';
import { UserProfile, UserPreferences } from '../types/database';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  updatePreferences: (preferences: UserPreferences) => Promise<void>;
  handleAuthCallback: (url: string) => Promise<void>;
  isOnboardingComplete: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  // Check if onboarding is complete based on user preferences
  const isOnboardingComplete = React.useMemo(() => {
    if (!profile?.preferences) return false;
    
    const prefs = profile.preferences as UserPreferences;
    return !!(
      prefs.diets?.length > 0 &&
      prefs.goals?.length > 0 &&
      prefs.household_size &&
      prefs.weekly_budget_kes &&
      prefs.cooking_skill_level
    );
  }, [profile?.preferences]);

  // Fetch user profile from database
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Profile fetch error:', err);
      return null;
    }
  };

  // Update user profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in');

    try {
      setError(null);
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      throw err;
    }
  };

  // Update user preferences
  const updatePreferences = async (preferences: UserPreferences) => {
    if (!user) throw new Error('No user logged in');

    try {
      setError(null);
      const { data, error } = await supabase
        .from('profiles')
        .update({ 
          preferences,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
    } catch (err: any) {
      setError(err.message || 'Failed to update preferences');
      throw err;
    }
  };

  // Google Sign In
  const signInWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);

      // Complete auth session for web browser
      WebBrowser.maybeCompleteAuthSession();
      
      // For mobile apps, we don't pass a redirectTo parameter
      // Supabase will use its default callback URL which is configured in Google Console
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          skipBrowserRedirect: true, // Important for React Native
        },
      });

      if (error) throw error;

      if (data?.url) {
        // Create redirect URI for the auth session
        const redirectUrl = makeRedirectUri({
          scheme: 'roycorecipe',
          path: 'auth',
        });
        
        console.log('Auth URL:', data.url);
        console.log('Redirect URL:', redirectUrl);
        
        // Open the OAuth URL in the browser
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          redirectUrl
        );

        if (result.type === 'success') {
          // Handle the redirect URL
          const { url } = result;
          await handleAuthCallback(url);
        } else {
          throw new Error('Authentication was cancelled or failed');
        }
      } else {
        throw new Error('No authentication URL received');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Handle OAuth callback
  const handleAuthCallback = async (url: string) => {
    try {
      console.log('Callback URL received:', url);
      
      // Parse the URL - tokens might be in hash or query params
      const urlObj = new URL(url);
      
      // First check hash parameters (common for OAuth implicit flow)
      let params = new URLSearchParams(urlObj.hash.substring(1));
      
      // If not in hash, check query parameters
      if (!params.has('access_token')) {
        params = urlObj.searchParams;
      }
      
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      const type = params.get('type');
      
      if (type === 'recovery') {
        // Handle password recovery
        return;
      }

      if (accessToken && refreshToken) {
        // Set the session with the tokens
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) throw error;
        console.log('Session set successfully:', data.session?.user?.email);
      } else {
        // If no tokens found, try to exchange the code
        const code = params.get('code');
        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
          console.log('Session exchanged successfully:', data.session?.user?.email);
        } else {
          throw new Error('No tokens or code found in callback URL');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to handle authentication callback');
      throw err;
    }
  };

  // Email Sign In
  const signInWithEmail = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      });

      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Email Sign Up
  const signUpWithEmail = async (email: string, password: string, fullName: string) => {
    try {
      setError(null);
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
        },
      });

      if (error) throw error;

      // Note: Profile will be created automatically via database trigger
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Reset Password
  const resetPassword = async (email: string) => {
    try {
      setError(null);
      setLoading(true);

      const { error } = await supabase.auth.resetPasswordForEmail(
        email.toLowerCase().trim(),
        {
          redirectTo: process.env.EXPO_PUBLIC_SUPABASE_REDIRECT_URL || 'royco://auth/reset-password',
        }
      );

      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign Out
  const signOut = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear local state
      setSession(null);
      setUser(null);
      setProfile(null);
    } catch (err: any) {
      setError(err.message || 'Failed to sign out');
      throw err;
    }
  };

  // Handle auth state changes
  useEffect(() => {
    let isMounted = true;

    const handleAuthChange = async (event: AuthChangeEvent, session: Session | null) => {
      if (!isMounted) return;

      console.log('Auth event:', event, session?.user?.id);

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // Fetch user profile
        const profileData = await fetchProfile(session.user.id);
        if (isMounted) {
          setProfile(profileData);
        }
      } else {
        if (isMounted) {
          setProfile(null);
        }
      }

      if (isMounted) {
        setLoading(false);
      }
    };

    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting initial session:', error);
        setError(error.message);
      }
      handleAuthChange('SIGNED_IN', session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    session,
    user,
    profile,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    resetPassword,
    updateProfile,
    updatePreferences,
    handleAuthCallback,
    isOnboardingComplete,
    error,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}