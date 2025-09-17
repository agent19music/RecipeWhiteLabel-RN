import { Colors } from '@/constants/Colors';
import { PantryItem } from '@/data/types';
import { analyzeGroceryImage } from '@/lib/openai';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    Image,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface PantryCameraModalProps {
  visible: boolean;
  onClose: () => void;
  onDetectedItems: (items: PantryItem[]) => void;
}



export default function PantryCameraModal({ 
  visible, 
  onClose, 
  onDetectedItems 
}: PantryCameraModalProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedItems, setDetectedItems] = useState<PantryItem[]>([]);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 1,
          useNativeDriver: true,
          damping: 15,
          stiffness: 150,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          damping: 15,
          stiffness: 150,
        }),
      ]).start();
    } else {
      slideAnim.setValue(0);
      scaleAnim.setValue(0.95);
      setSelectedImage(null);
      setDetectedItems([]);
      setIsAnalyzing(false);
    }
  }, [visible, slideAnim, scaleAnim]);

  const generateItemId = () => `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
      Alert.alert(
        'Permissions Required',
        'Camera and photo library permissions are required to scan items.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const takePhoto = async () => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        analyzeImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const pickFromLibrary = async () => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        analyzeImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Library error:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const analyzeImage = async (imageUri: string) => {
    if (!imageUri) return;

    setIsAnalyzing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      // Convert image to base64
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]);
        };
        reader.readAsDataURL(blob);
      });

      // Analyze with OpenAI Vision
      const result = await analyzeGroceryImage(base64);

      if (result.success && result.items.length > 0) {
        const pantryItems: PantryItem[] = result.items.map(item => {
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + (item.expiryEstimate || 7));
          
          return {
            id: generateItemId(),
            title: item.name,
            name: item.name,
            quantity: item.quantity || 1,
            unit: item.unit || 'pieces',
            category: item.category,
            expiryDate: expiryDate.toISOString().split('T')[0],
            expiresOn: expiryDate.toISOString().split('T')[0],
          };
        });

        setDetectedItems(pantryItems);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        
        // Show confidence level
        if (result.totalConfidence > 0.8) {
          Alert.alert(
            'Great Detection!',
            `Found ${result.items.length} grocery items with high confidence`,
            [{ text: 'OK' }]
          );
        }
      } else {
        throw new Error(result.message || 'No grocery items detected');
      }
    } catch (error) {
      console.error('AI Analysis error:', error);
      
      // Fallback to mock data for demo purposes
      const mockItems: PantryItem[] = [
        { id: generateItemId(), title: 'Tomatoes', qty: 4, unit: 'pcs', expiresOn: '2025-09-10' },
        { id: generateItemId(), title: 'Milk', qty: 1, unit: 'L', expiresOn: '2025-09-05' },
        { id: generateItemId(), title: 'Bread', qty: 1, unit: 'loaf', expiresOn: '2025-09-08' },
      ];
      
      setDetectedItems(mockItems);
      
      Alert.alert(
        'AI Analysis',
        'Using demo data. In production, this would analyze your image using OpenAI Vision API.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const removeDetectedItem = (id: string) => {
    setDetectedItems(prev => prev.filter(item => item.id !== id));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const confirmItems = () => {
    if (detectedItems.length === 0) {
      Alert.alert('No items', 'No items detected to add.');
      return;
    }

    onDetectedItems(detectedItems);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const retakePhoto = () => {
    setSelectedImage(null);
    setDetectedItems([]);
    setIsAnalyzing(false);
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <BlurView intensity={20} style={styles.overlay}>
        <TouchableOpacity 
          style={styles.backdrop} 
          activeOpacity={1}
          onPress={onClose}
        />
        
        <Animated.View 
          style={[
            styles.modalContainer,
            {
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [600, 0],
                  }),
                },
                { scale: scaleAnim },
              ],
            },
          ]}
        >
          <SafeAreaView style={styles.modalContent} edges={['bottom']}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.dragHandle} />
              <View style={styles.headerContent}>
                <Text style={styles.title}>AI Scanner</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color={Colors.text.secondary} />
                </TouchableOpacity>
              </View>
              <Text style={styles.subtitle}>
                Scan receipts, shopping lists, or food items
              </Text>
            </View>

            {!selectedImage ? (
              // Camera Options
              <View style={styles.cameraOptions}>
                <View style={styles.instructionsContainer}>
                  <Ionicons name="camera" size={64} color={Colors.primary} />
                  <Text style={styles.instructionsTitle}>Scan Your Items</Text>
                  <Text style={styles.instructionsText}>
                    Take a photo of your receipt, shopping list, or food items to automatically detect and add them to your pantry.
                  </Text>
                </View>

                <View style={styles.optionButtons}>
                  <TouchableOpacity style={styles.optionButton} onPress={takePhoto}>
                    <View style={styles.optionIcon}>
                      <Ionicons name="camera" size={32} color={Colors.white} />
                    </View>
                    <Text style={styles.optionTitle}>Take Photo</Text>
                    <Text style={styles.optionDescription}>
                      Capture receipt or items
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.optionButton} onPress={pickFromLibrary}>
                    <View style={[styles.optionIcon, styles.secondaryIcon]}>
                      <Ionicons name="images" size={32} color={Colors.primary} />
                    </View>
                    <Text style={styles.optionTitle}>Choose from Gallery</Text>
                    <Text style={styles.optionDescription}>
                      Select existing image
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              // Analysis Results
              <View style={styles.analysisContainer}>
                <View style={styles.imagePreview}>
                  <Image source={{ uri: selectedImage }} style={styles.previewImage} />
                  <TouchableOpacity style={styles.retakeButton} onPress={retakePhoto}>
                    <Ionicons name="camera-reverse" size={20} color={Colors.white} />
                  </TouchableOpacity>
                </View>

                {isAnalyzing ? (
                  <View style={styles.analyzingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={styles.analyzingText}>Analyzing image...</Text>
                    <Text style={styles.analyzingSubtext}>
                      AI is detecting items in your photo
                    </Text>
                  </View>
                ) : detectedItems.length > 0 ? (
                  <View style={styles.resultsContainer}>
                    <Text style={styles.resultsTitle}>
                      Detected Items ({detectedItems.length})
                    </Text>
                    <Text style={styles.resultsSubtitle}>
                      Tap items to remove them before adding to pantry
                    </Text>
                    
                    <View style={styles.detectedItems}>
                      {detectedItems.map((item) => (
                        <TouchableOpacity
                          key={item.id}
                          style={styles.detectedItem}
                          onPress={() => removeDetectedItem(item.id)}
                        >
                          <View style={styles.itemInfo}>
                            <Text style={styles.itemTitle}>{item.title}</Text>
                            <Text style={styles.itemDetails}>
                              {item.qty} {item.unit}
                              {item.expiresOn && ` • Expires: ${new Date(item.expiresOn).toLocaleDateString()}`}
                            </Text>
                          </View>
                          <Ionicons name="close-circle" size={20} color="#EF4444" />
                        </TouchableOpacity>
                      ))}
                    </View>

                    <TouchableOpacity style={styles.confirmButton} onPress={confirmItems}>
                      <Text style={styles.confirmButtonText}>
                        Add {detectedItems.length} Items to Pantry
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.noResultsContainer}>
                    <Ionicons name="search" size={48} color={Colors.text.secondary} />
                    <Text style={styles.noResultsText}>No Items Detected</Text>
                    <Text style={styles.noResultsSubtext}>
                      Try taking another photo with better lighting
                    </Text>
                  </View>
                )}
              </View>
            )}
          </SafeAreaView>
        </Animated.View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdrop: {
    flex: 1,
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
  },
  modalContent: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  dragHandle: {
    width: 36,
    height: 4,
    backgroundColor: Colors.text.secondary + '40',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  closeButton: {
    padding: 4,
  },
  cameraOptions: {
    flex: 1,
    paddingHorizontal: 20,
  },
  instructionsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  instructionsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
  optionButtons: {
    gap: 16,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  optionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryIcon: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    flex: 1,
  },
  optionDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    flex: 1,
    marginTop: 4,
  },
  analysisContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  imagePreview: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  previewImage: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.surface,
  },
  retakeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    padding: 8,
  },
  analyzingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  analyzingText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginTop: 16,
  },
  analyzingSubtext: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 8,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  resultsSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 16,
  },
  detectedItems: {
    gap: 8,
    marginBottom: 20,
  },
  detectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  itemDetails: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  confirmButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginTop: 16,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 8,
    textAlign: 'center',
  },
});
