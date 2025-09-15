import { Colors } from '@/constants/Colors';
import { LoadingIndicator } from '@rn-nui/loading-indicator';
import { BlurView } from 'expo-blur';
import LottieView from 'lottie-react-native';
import React from 'react';
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface LoadingSpinnerProps {
  visible?: boolean;
  text?: string;
  type?: 'default' | 'cooking' | 'minimal';
  size?: number | 'small' | 'large';
  overlay?: boolean;
  color?: string;
}

export default function LoadingSpinner({
  visible = true,
  text,
  type = 'default',
  size = 50,
  overlay = true,
  color = Colors.primary,
}: LoadingSpinnerProps) {
  if (!visible) return null;

  const renderLoader = () => {
    if (type === 'cooking') {
      return (
        <View style={styles.cookingContainer}>
          <LottieView
            source={{ uri: 'https://lottie.host/2d560100-4fe0-4b04-a229-b76da4dc239a/daeya5XLO3.lottie' }}
            autoPlay
            loop
            style={styles.lottie}
          />
          {text && (
            <Text style={styles.cookingText}>{text}</Text>
          )}
        </View>
      );
    }

    return (
      <View style={styles.defaultContainer}>
        <LoadingIndicator
          size={size}
          color={color}
          containerSize={type === 'minimal' ? undefined : 80}
          containerColor={type === 'minimal' ? undefined : Colors.surface}
        />
        {text && (
          <Text style={styles.text}>{text}</Text>
        )}
      </View>
    );
  };

  if (overlay) {
    return (
      <Modal
        transparent
        visible={visible}
        animationType="fade"
      >
        <BlurView
          intensity={20}
          tint="light"
          style={styles.overlay}
        >
          <View style={styles.modalContent}>
            {renderLoader()}
          </View>
        </BlurView>
      </Modal>
    );
  }

  return renderLoader();
}

// Minimal inline spinner for buttons and small areas
export function InlineSpinner({
  size = 'small',
  color = Colors.white,
}: {
  size?: number | 'small' | 'large';
  color?: string;
}) {
  return (
    <LoadingIndicator
      size={size}
      color={color}
      containerSize={undefined}
      containerColor={undefined}
    />
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  modalContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultContainer: {
    alignItems: 'center',
    gap: 16,
  },
  cookingContainer: {
    alignItems: 'center',
    gap: 20,
  },
  lottie: {
    width: 200,
    height: 200,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  cookingText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});