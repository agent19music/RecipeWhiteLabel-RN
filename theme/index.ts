import React, { createContext, useContext, useMemo, useState } from 'react';
import { ColorSchemeName, useColorScheme } from 'react-native';
import { Colors, DarkColors } from '../constants/Colors';

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
    blur: {
      light: 20,
      medium: 30,
      heavy: 50,
      max: 80
    },
    opacity: {
      light: 0.05,
      medium: 0.08,
      heavy: 0.12,
      overlay: 0.25
    },
    border: {
      light: 'rgba(255, 255, 255, 0.18)',
      medium: 'rgba(255, 255, 255, 0.25)',
      dark: 'rgba(0, 0, 0, 0.1)'
    },
    background: {
      light: 'rgba(255, 255, 255, 0.08)',
      medium: 'rgba(255, 255, 255, 0.12)',
      heavy: 'rgba(255, 255, 255, 0.18)',
      dark: 'rgba(0, 0, 0, 0.05)'
    },
    shadow: {
      light: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2
      },
      medium: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4
      },
      heavy: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 8
      }
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
    text: Colors.text.primary,
    subtext: Colors.text.secondary,
    primary: Colors.primary,
    primaryMuted: Colors.primaryMuted,
    border: Colors.border,
    accent: Colors.primary,
    surface: Colors.surface
  },
  dark: {
    bg: DarkColors.background,
    card: DarkColors.card,
    text: DarkColors.text.primary,
    subtext: DarkColors.text.secondary,
    primary: DarkColors.primary,
    primaryMuted: DarkColors.primaryMuted,
    border: DarkColors.border,
    accent: DarkColors.primary,
    surface: DarkColors.surface
  }
} as const;

export type Palette = typeof theme.light;

const ThemeCtx = createContext<{ scheme: ColorSchemeName; palette: Palette; toggle: () => void }>({ scheme: 'light', palette: theme.light, toggle: () => {} });

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const sys = useColorScheme();
  const [override, setOverride] = useState<ColorSchemeName | null>(null);
  const scheme: ColorSchemeName = override ?? sys ?? 'light';
  const palette = scheme === 'dark' ? theme.dark : theme.light;
  const value = useMemo(() => ({ scheme, palette, toggle: () => setOverride(prev => (prev === 'dark' ? 'light' : 'dark')) }), [scheme]);
  return React.createElement(ThemeCtx.Provider, { value }, children);
};

export const useTheme = () => useContext(ThemeCtx);

