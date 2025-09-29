import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { ColorSchemeName, useColorScheme as useNativeColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, DarkColors } from '../constants/Colors';

// Theme preference types
export type ThemeMode = 'light' | 'dark' | 'system';
export type ColorScheme = 'light' | 'dark';

// Storage key for theme preference
const THEME_STORAGE_KEY = 'theme_preference';

export const theme = {
  radius: { sm: 12, md: 16, lg: 20, xl: 24, xxl: 32 },
  space: { xs: 8, sm: 12, md: 16, lg: 24, xl: 32, xxl: 48 },
  font: { 
    h1: 32, 
    h2: 24, 
    h3: 20,
    body: 16, 
    small: 14,
    xs: 12 
  },
  glass: {
    light: {
      blur: {
        light: 15,
        medium: 25,
        heavy: 40,
        max: 60
      },
      opacity: {
        light: 0.05,
        medium: 0.08,
        heavy: 0.12,
        overlay: 0.25
      },
      border: {
        light: 'rgba(0, 0, 0, 0.05)',
        medium: 'rgba(0, 0, 0, 0.08)',
        dark: 'rgba(0, 0, 0, 0.1)'
      },
      background: {
        light: 'rgba(255, 255, 255, 0.95)',
        medium: 'rgba(255, 255, 255, 0.98)',
        heavy: 'rgba(255, 255, 255, 1)',
        dark: 'rgba(248, 248, 248, 1)'
      },
      overlay: 'rgba(255, 255, 255, 0.9)'
    },
    dark: {
      blur: {
        light: 20,
        medium: 35,
        heavy: 55,
        max: 80
      },
      opacity: {
        light: 0.08,
        medium: 0.12,
        heavy: 0.18,
        overlay: 0.4
      },
      border: {
        light: 'rgba(255, 255, 255, 0.05)',
        medium: 'rgba(255, 255, 255, 0.08)',
        dark: 'rgba(255, 255, 255, 0.1)'
      },
      background: {
        light: 'rgba(22, 22, 22, 0.95)',
        medium: 'rgba(22, 22, 22, 0.98)',
        heavy: 'rgba(22, 22, 22, 1)',
        dark: 'rgba(26, 26, 26, 1)'
      },
      overlay: 'rgba(10, 10, 10, 0.9)'
    }
  },
  animation: {
    quick: 200,
    normal: 300,
    slow: 500
  },
  light: {
    bg: Colors.background,
    card: Colors.card,
    cardBg: Colors.surface,
    text: Colors.text.primary,
    subtext: Colors.text.secondary,
    primary: Colors.primary,
    primaryMuted: Colors.primaryMuted,
    border: Colors.border,
    accent: Colors.primary,
    surface: Colors.surface,
    success: Colors.success,
    warning: Colors.warning,
    error: Colors.error,
    info: Colors.info,
    inputBg: Colors.input.background,
    inputBorder: Colors.input.border,
    inputText: Colors.input.text,
    placeholder: Colors.input.placeholder
  },
  dark: {
    bg: DarkColors.background,
    card: DarkColors.card,
    cardBg: DarkColors.card,
    text: DarkColors.text.primary,
    subtext: DarkColors.text.secondary,
    primary: DarkColors.primary,
    primaryMuted: DarkColors.primaryMuted,
    border: DarkColors.border,
    accent: DarkColors.primary,
    surface: DarkColors.surface,
    success: DarkColors.success,
    warning: DarkColors.warning,
    error: DarkColors.error,
    info: DarkColors.info,
    inputBg: DarkColors.input.background,
    inputBorder: DarkColors.input.border,
    inputText: DarkColors.input.text,
    placeholder: DarkColors.input.placeholder
  }
} as const;

export type Palette = typeof theme.light;

// Enhanced theme context with more controls
interface ThemeContextValue {
  scheme: ColorScheme;
  mode: ThemeMode;
  palette: Palette;
  isDark: boolean;
  isLight: boolean;
  toggle: () => void;
  setMode: (mode: ThemeMode) => void;
  glassMorphism: typeof theme.glass.light | typeof theme.glass.dark;
}

const ThemeCtx = createContext<ThemeContextValue>({
  scheme: 'light',
  mode: 'system',
  palette: theme.light,
  isDark: false,
  isLight: true,
  toggle: () => {},
  setMode: () => {},
  glassMorphism: theme.glass.light
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useNativeColorScheme();
  const [mode, setMode] = useState<ThemeMode>('system');
  const [isInitialized, setIsInitialized] = useState(false);

  // Load saved theme preference on mount
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedMode && ['light', 'dark', 'system'].includes(savedMode)) {
          setMode(savedMode as ThemeMode);
        }
      } catch (error) {
        console.warn('Failed to load theme preference:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    loadThemePreference();
  }, []);

  // Save theme preference when changed
  useEffect(() => {
    if (isInitialized) {
      AsyncStorage.setItem(THEME_STORAGE_KEY, mode).catch(error => {
        console.warn('Failed to save theme preference:', error);
      });
    }
  }, [mode, isInitialized]);

  // Determine active scheme
  const scheme: ColorScheme = useMemo(() => {
    if (mode === 'system') {
      return systemScheme === 'dark' ? 'dark' : 'light';
    }
    return mode;
  }, [mode, systemScheme]);

  // Create theme value
  const value = useMemo((): ThemeContextValue => {
    const isDark = scheme === 'dark';
    const palette = isDark ? theme.dark : theme.light;
    const glassMorphism = isDark ? theme.glass.dark : theme.glass.light;

    const toggle = () => {
      setMode(prev => {
        if (prev === 'system') {
          return systemScheme === 'dark' ? 'light' : 'dark';
        }
        return prev === 'dark' ? 'light' : 'dark';
      });
    };

    return {
      scheme,
      mode,
      palette,
      isDark,
      isLight: !isDark,
      toggle,
      setMode,
      glassMorphism
    };
  }, [scheme, mode, systemScheme]);

  // Don't render until theme is initialized to prevent flashing
  if (!isInitialized) {
    return null;
  }

  return React.createElement(ThemeCtx.Provider, { value }, children);
};

export const useTheme = () => useContext(ThemeCtx);

// Hook for getting current color scheme (simplified)
export const useColorScheme = (): ColorScheme => {
  const { scheme } = useTheme();
  return scheme;
};

