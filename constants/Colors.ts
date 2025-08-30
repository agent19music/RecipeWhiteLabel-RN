/**
 * Basic color constants for Royco Recipe app
 * Using Royco brand colors (red, white, black)
 */

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
    text: '#171717',
    background: '#FFFFFF',
    tint: '#DC143C',
    icon: '#737373',
    tabIconDefault: '#737373',
    tabIconSelected: '#DC143C',
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

// Export for any legacy references
export const LightColors = Colors;
export const DarkColors = Colors;
export const getColors = () => Colors;
