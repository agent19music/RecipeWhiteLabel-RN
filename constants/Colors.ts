/**
 * Comprehensive color system for Royco Recipe app
 * Includes sophisticated light and dark themes with Royco branding
 */

// Light Theme Colors
export const Colors = {
  // Royco brand colors
  primary: '#DC143C',        // Crimson Red (Royco brand color)
  primaryLight: '#E85D75',   // Lighter red
  primaryDark: '#A01028',    // Darker red
  primaryMuted: '#FFE4E9',   // Very light red for backgrounds
  
  // Basic colors
  black: '#000000',
  white: '#FFFFFF',
  gray: '#737373',
  grayLight: '#E5E5E5',
  grayDark: '#525252',
  
  // Text colors
  textPrimary: '#171717',
  textSecondary: '#525252',
  textTertiary: '#737373',
  
  // Background colors
  background: '#FFFFFF',
  surface: '#F8F8F8',
  card: '#FFFFFF',
  
  // Other UI elements
  border: '#E5E5E5',
  divider: '#F0F0F0',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  
  // Tab bar colors
  tabBarBackground: '#FFFFFF',
  tabBarBorder: '#F5F5F5',
  tabIconDefault: '#737373',
  tabIconSelected: '#DC143C',
  
  // For backward compatibility with existing code
  light: {
    text: '#171717',
    background: '#FFFFFF',
    tint: '#DC143C',
    icon: '#737373',
    tabIconDefault: '#737373',
    tabIconSelected: '#DC143C',
  },
  dark: {
    text: '#E5E5E5',
    background: '#0A0A0A',
    tint: '#FF4C6A',
    icon: '#A1A1A1',
    tabIconDefault: '#A1A1A1',
    tabIconSelected: '#FF4C6A',
  },
  text: {
    primary: '#171717',
    secondary: '#525252',
    tertiary: '#737373',
    inverse: '#FFFFFF',
  },
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
  tabBar: {
    background: '#FFFFFF',
    border: '#F5F5F5',
    iconDefault: '#737373',
    iconSelected: '#DC143C',
    labelDefault: '#737373',
    labelSelected: '#DC143C',
  },
  input: {
    background: '#F8F8F8',
    border: '#E5E5E5',
    placeholder: '#A3A3A3',
    text: '#171717',
  },
  shadow: {
    light: 'rgba(0, 0, 0, 0.05)',
    medium: 'rgba(0, 0, 0, 0.1)',
    dark: 'rgba(0, 0, 0, 0.2)',
  },
  modalBackground: 'rgba(0, 0, 0, 0.5)',
  info: '#3B82F6',
};

// Sophisticated Dark Theme Colors
export const DarkColors = {
  // Royco brand colors (enhanced for dark mode)
  primary: '#FF4C6A',        // Brighter red for better contrast on dark backgrounds
  primaryLight: '#FF7A8A',   // Lighter variant
  primaryDark: '#E73C53',    // Darker variant  
  primaryMuted: '#2A1218',   // Dark red background
  
  // Basic colors
  black: '#FFFFFF',          // Inverted for dark mode
  white: '#000000',          // Inverted for dark mode
  gray: '#A1A1A1',
  grayLight: '#3A3A3A',
  grayDark: '#D4D4D4',
  
  // Text colors (optimized for dark backgrounds)
  textPrimary: '#F5F5F5',    // High contrast white
  textSecondary: '#B8B8B8',  // Medium contrast gray
  textTertiary: '#8A8A8A',   // Low contrast gray
  
  // Background colors (rich dark theme)
  background: '#0A0A0A',     // Deep black background
  surface: '#1A1A1A',       // Elevated surface color
  card: '#161616',          // Card background
  
  // Other UI elements
  border: '#2A2A2A',        // Subtle borders
  divider: '#1F1F1F',       // Subtle dividers
  success: '#22C55E',       // Brighter green for dark mode
  warning: '#FB923C',       // Brighter orange for dark mode
  error: '#F87171',         // Brighter red for dark mode
  
  // Tab bar colors
  tabBarBackground: '#1A1A1A',
  tabBarBorder: '#2A2A2A',
  tabIconDefault: '#8A8A8A',
  tabIconSelected: '#FF4C6A',
  
  // For backward compatibility
  light: {
    text: '#F5F5F5',
    background: '#0A0A0A',
    tint: '#FF4C6A',
    icon: '#A1A1A1',
    tabIconDefault: '#8A8A8A',
    tabIconSelected: '#FF4C6A',
  },
  dark: {
    text: '#F5F5F5',
    background: '#0A0A0A',
    tint: '#FF4C6A',
    icon: '#A1A1A1',
    tabIconDefault: '#8A8A8A',
    tabIconSelected: '#FF4C6A',
  },
  text: {
    primary: '#F5F5F5',
    secondary: '#B8B8B8',
    tertiary: '#8A8A8A',
    inverse: '#171717',
  },
  gray: {
    50: '#0F0F0F',
    100: '#1A1A1A',
    200: '#2A2A2A',
    300: '#3A3A3A',
    400: '#525252',
    500: '#737373',
    600: '#8A8A8A',
    700: '#A1A1A1',
    800: '#B8B8B8',
    900: '#E5E5E5',
  },
  tabBar: {
    background: '#1A1A1A',
    border: '#2A2A2A',
    iconDefault: '#8A8A8A',
    iconSelected: '#FF4C6A',
    labelDefault: '#8A8A8A',
    labelSelected: '#FF4C6A',
  },
  input: {
    background: '#1F1F1F',
    border: '#2A2A2A',
    placeholder: '#737373',
    text: '#F5F5F5',
  },
  shadow: {
    light: 'rgba(0, 0, 0, 0.3)',
    medium: 'rgba(0, 0, 0, 0.5)',
    dark: 'rgba(0, 0, 0, 0.8)',
  },
  modalBackground: 'rgba(0, 0, 0, 0.8)',
  info: '#60A5FA',
};

// Export for any legacy references
export const LightColors = Colors;
export const getColors = (scheme?: 'light' | 'dark') => scheme === 'dark' ? DarkColors : Colors;
