import React, { createContext, useContext, useMemo, useState } from 'react';
import { ColorSchemeName, useColorScheme } from 'react-native';
import { Colors, DarkColors } from '../constants/Colors';

export const theme = {
  radius: { sm: 12, md: 16, lg: 24, xl: 32 },
  space: { xs: 8, sm: 12, md: 16, lg: 24, xl: 32, xxl: 48 },
  font: { 
    h1: 32, 
    h2: 24, 
    h3: 20,
    body: 16, 
    small: 14,
    xs: 12 
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

