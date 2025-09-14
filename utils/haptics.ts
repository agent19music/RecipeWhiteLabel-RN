import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

// Re-export types for convenience
export const ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle;
export const NotificationFeedbackType = Haptics.NotificationFeedbackType;

export const hapticImpact = async (style: Haptics.ImpactFeedbackStyle) => {
  if (Platform.OS !== 'web') {
    await Haptics.impactAsync(style);
  }
};

export const hapticNotification = async (type: Haptics.NotificationFeedbackType) => {
  if (Platform.OS !== 'web') {
    await Haptics.notificationAsync(type);
  }
};

export const hapticSelection = async () => {
  if (Platform.OS !== 'web') {
    await Haptics.selectionAsync();
  }
};
