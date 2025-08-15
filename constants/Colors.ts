/**
 * Centralized color system for Royco Recipe app
 * Update these values to change colors across the entire app
 */

export const Colors = {
  // Primary brand colors
  primary: '#DC143C',        // Crimson Red (Royco brand color)
  primaryLight: '#E85D75',   // Lighter variant
  primaryDark: '#A01028',    // Darker variant
  primaryMuted: '#FFE4E9',   // Very light variant for backgrounds
  
  // Neutral colors
  black: '#000000',
  white: '#FFFFFF',
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  
  // Semantic colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // UI colors
  background: '#FFFFFF',
  surface: '#FAFAFA',
  card: '#FFFFFF',
  text: {
    primary: '#171717',
    secondary: '#525252',
    tertiary: '#737373',
    inverse: '#FFFFFF',
  },
  border: '#E5E5E5',
  divider: '#F5F5F5',
  
  // Tab bar specific
  tabBar: {
    background: '#FFFFFF',
    border: '#F5F5F5',
    iconDefault: '#737373',
    iconSelected: '#DC143C',
    labelDefault: '#737373',
    labelSelected: '#DC143C',
  },
  
  // Shadows
  shadow: {
    light: 'rgba(0, 0, 0, 0.05)',
    medium: 'rgba(0, 0, 0, 0.1)',
    dark: 'rgba(0, 0, 0, 0.2)',
  },
};

// Dark mode colors (for future implementation)
export const DarkColors = {
  ...Colors,
  background: '#000000',
  surface: '#171717',
  card: '#262626',
  text: {
    primary: '#FFFFFF',
    secondary: '#D4D4D4',
    tertiary: '#A3A3A3',
    inverse: '#000000',
  },
  border: '#404040',
  divider: '#262626',
  tabBar: {
    background: '#171717',
    border: '#262626',
    iconDefault: '#737373',
    iconSelected: '#DC143C',
    labelDefault: '#737373',
    labelSelected: '#DC143C',
  },
};

// Export a function to get colors based on theme
export const getColors = (isDark: boolean = false) => {
  return isDark ? DarkColors : Colors;
};

// Legacy support for existing code
export const LegacyColors = {
  light: {
    text: Colors.text.primary,
    background: Colors.background,
    tint: Colors.primary,
    icon: Colors.gray[500],
    tabIconDefault: Colors.tabBar.iconDefault,
    tabIconSelected: Colors.tabBar.iconSelected,
  },
  dark: {
    text: DarkColors.text.primary,
    background: DarkColors.background,
    tint: DarkColors.primary,
    icon: DarkColors.gray[500],
    tabIconDefault: DarkColors.tabBar.iconDefault,
    tabIconSelected: DarkColors.tabBar.iconSelected,
  },
};
