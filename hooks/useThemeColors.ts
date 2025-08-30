import { Colors } from '@/constants/Colors';

/**
 * Simplified hook to get colors - no theme switching
 * Returns static color values
 */
export function useThemeColors() {
  return {
    colors: Colors,
    isDark: false,
    colorScheme: 'light' as const,
  };
}

// Convenience hook for backwards compatibility
export function useColors() {
  return Colors;
}
