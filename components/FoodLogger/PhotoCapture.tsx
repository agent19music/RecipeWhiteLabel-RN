import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/Colors';

// Camera will be null on web, handled gracefully in the component
let Camera: any = null;

const { width } = Dimensions.get('window');

interface PhotoCaptureProps {
  photo: string | null;
  onPhotoCapture: (photo: string) => void;
}

export default function PhotoCapture({ photo, onPhotoCapture }: PhotoCaptureProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef<any>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web' && Camera) {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      } else {
        setHasPermission(false);
      }
    })();
  }, []);

  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleTakePhoto = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    animatePress();

    if (hasPermission && Platform.OS !== 'web') {
      setShowCamera(true);
    } else {
      // Fall back to image picker for web or if camera permission denied
      pickImage();
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      if (Platform.OS !== 'web') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      onPhotoCapture(result.assets[0].uri);
    }
  };

  const capturePhoto = async () => {
    if (cameraRef.current) {
      setIsProcessing(true);
      if (Platform.OS !== 'web') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }
      
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        
        if (Platform.OS !== 'web') {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        onPhotoCapture(photo.uri);
        setShowCamera(false);
      } catch (error) {
        console.error('Error capturing photo:', error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleRetake = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPhotoCapture('');
  };

  if (showCamera && Camera && Platform.OS !== 'web') {
    return (
      <View style={styles.cameraContainer}>
        <Camera 
          ref={cameraRef}
          style={styles.camera} 
          type={'back' as any}
          ratio="4:3"
        >
          <View style={styles.cameraOverlay}>
            <TouchableOpacity
              style={styles.closeCamera}
              onPress={() => setShowCamera(false)}
            >
              <Ionicons name="close" size={32} color={Colors.white} />
            </TouchableOpacity>
            
            <View style={styles.cameraGuide}>
              <View style={styles.guideCorner} />
              <View style={[styles.guideCorner, styles.guideCornerTR]} />
              <View style={[styles.guideCorner, styles.guideCornerBL]} />
              <View style={[styles.guideCorner, styles.guideCornerBR]} />
            </View>
            
            <Text style={styles.cameraHint}>Point camera at your meal</Text>
            
            <View style={styles.cameraControls}>
              <TouchableOpacity
                style={styles.captureButton}
                onPress={capturePhoto}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <ActivityIndicator color={Colors.primary} />
                ) : (
                  <View style={styles.captureButtonInner} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Camera>
      </View>
    );
  }

  if (photo) {
    return (
      <View style={styles.previewContainer}>
        <Image source={{ uri: photo }} style={styles.preview} />
        <View style={styles.previewOverlay}>
          <View style={styles.previewInfo}>
            <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
            <Text style={styles.previewText}>Photo captured</Text>
          </View>
          <TouchableOpacity
            style={styles.retakeButton}
            onPress={handleRetake}
          >
            <Ionicons name="refresh-outline" size={16} color={Colors.primary} />
            <Text style={styles.retakeText}>Retake</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={styles.captureContainer}
        onPress={handleTakePhoto}
        activeOpacity={0.9}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="camera-outline" size={32} color={Colors.primary} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.captureTitle}>Add Photo</Text>
          <Text style={styles.captureHint}>Take a photo of your meal</Text>
        </View>
        <View style={styles.arrow}>
          <Ionicons name="chevron-forward" size={16} color={Colors.text.tertiary} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  captureContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: Colors.primaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  captureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  captureHint: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  arrow: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraContainer: {
    width: width - 40,
    height: (width - 40) * 4/3,
    borderRadius: 16,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  closeCamera: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  cameraGuide: {
    position: 'absolute',
    top: '25%',
    left: '10%',
    right: '10%',
    bottom: '25%',
  },
  guideCorner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: Colors.white,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  guideCornerTR: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderRightWidth: 3,
  },
  guideCornerBL: {
    bottom: 0,
    left: 0,
    borderTopWidth: 0,
    borderBottomWidth: 3,
  },
  guideCornerBR: {
    bottom: 0,
    right: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  cameraHint: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    color: Colors.white,
    fontSize: 16,
    fontWeight: '500',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  cameraControls: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  captureButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
  },
  previewContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  preview: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.surface,
  },
  previewOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  previewText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  retakeText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
});