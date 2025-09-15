import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';

export default function GlassmorphicBackButton() {
  const router = useRouter();

  return (
    <TouchableOpacity 
    style={styles.headerButton}
    onPress={() => router.back()}
  >
    <BlurView intensity={80} tint="dark" style={styles.blurButton}>
      <Ionicons name="arrow-back" size={24} color={Colors.white} />
    </BlurView>
  </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
 
  headerButtons: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  headerButton: {
    marginTop: 10,
  },

  blurButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
});