import { Colors } from '@/constants/Colors';
import { PantryItem } from '@/data/types';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PantryCameraModal from './PantryCameraModal';

interface PantryAddModalProps {
  visible: boolean;
  onClose: () => void;
  onAddItems: (items: PantryItem[]) => void;
}

export default function PantryAddModal({ visible, onClose, onAddItems }: PantryAddModalProps) {
  const [currentItem, setCurrentItem] = useState({
    title: '',
    qty: '',
    unit: 'pcs',
    expiresOn: '',
  });
  const [addedItems, setAddedItems] = useState<PantryItem[]>([]);
  const [showCamera, setShowCamera] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const titleInputRef = useRef<TextInput>(null);

  const units = ['pcs', 'g', 'kg', 'ml', 'L', 'cups', 'tbsp', 'tsp', 'bunches', 'cans', 'jars', 'bottles'];

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        damping: 15,
        stiffness: 150,
      }).start();
      // Auto-focus on title input after modal animation
      setTimeout(() => titleInputRef.current?.focus(), 300);
    } else {
      slideAnim.setValue(0);
      setCurrentItem({ title: '', qty: '', unit: 'pcs', expiresOn: '' });
      setAddedItems([]);
    }
  }, [visible, slideAnim]);

  const generateItemId = () => `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const addCurrentItem = () => {
    if (!currentItem.title.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      titleInputRef.current?.focus();
      return;
    }

    const newItem: PantryItem = {
      id: generateItemId(),
      title: currentItem.title.trim(),
      qty: currentItem.qty ? parseFloat(currentItem.qty) : 1,
      unit: currentItem.unit,
      expiresOn: currentItem.expiresOn || undefined,
    };

    setAddedItems(prev => [...prev, newItem]);
    setCurrentItem({ title: '', qty: '', unit: 'pcs', expiresOn: '' });
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Auto-focus for next item
    setTimeout(() => titleInputRef.current?.focus(), 100);
  };

  const removeAddedItem = (id: string) => {
    setAddedItems(prev => prev.filter(item => item.id !== id));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleSave = () => {
    if (addedItems.length === 0) {
      Alert.alert('No items added', 'Add at least one item to save.');
      return;
    }

    onAddItems(addedItems);
    onClose();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleCameraResults = (detectedItems: PantryItem[]) => {
    setAddedItems(prev => [...prev, ...detectedItems]);
    setShowCamera(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  if (!visible) return null;

  return (
    <>
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
                transform: [{
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [600, 0],
                  }),
                }],
              },
            ]}
          >
            <SafeAreaView style={styles.modalContent} edges={['bottom']}>
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
              >
                {/* Header */}
                <View style={styles.header}>
                  <View style={styles.dragHandle} />
                  <View style={styles.headerContent}>
                    <Text style={styles.title}>Add to Pantry</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                      <Ionicons name="close" size={24} color={Colors.text.secondary} />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.primaryAction]}
                    onPress={() => titleInputRef.current?.focus()}
                  >
                    <Ionicons name="create-outline" size={20} color={Colors.white} />
                    <Text style={styles.actionButtonText}>Manual Entry</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.actionButton, styles.secondaryAction]}
                    onPress={() => setShowCamera(true)}
                  >
                    <Ionicons name="camera-outline" size={20} color={Colors.primary} />
                    <Text style={[styles.actionButtonText, { color: Colors.primary }]}>AI Scanner</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView 
                  style={styles.scrollContent}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                >
                  {/* Manual Entry Form */}
                  <View style={styles.form}>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Item Name</Text>
                      <TextInput
                        ref={titleInputRef}
                        style={styles.textInput}
                        placeholder="e.g., Tomatoes, Milk, Rice..."
                        placeholderTextColor={Colors.text.secondary}
                        value={currentItem.title}
                        onChangeText={(text) => setCurrentItem(prev => ({ ...prev, title: text }))}
                        onSubmitEditing={addCurrentItem}
                        returnKeyType="done"
                        autoCapitalize="words"
                      />
                    </View>

                    <View style={styles.row}>
                      <View style={[styles.inputGroup, styles.flex1]}>
                        <Text style={styles.label}>Quantity</Text>
                        <TextInput
                          style={styles.textInput}
                          placeholder="1"
                          placeholderTextColor={Colors.text.secondary}
                          value={currentItem.qty}
                          onChangeText={(text) => setCurrentItem(prev => ({ ...prev, qty: text }))}
                          keyboardType="numeric"
                        />
                      </View>

                      <View style={[styles.inputGroup, styles.flex1]}>
                        <Text style={styles.label}>Unit</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                          <View style={styles.unitSelector}>
                            {units.map((unit) => (
                              <TouchableOpacity
                                key={unit}
                                style={[
                                  styles.unitChip,
                                  currentItem.unit === unit && styles.unitChipActive,
                                ]}
                                onPress={() => {
                                  setCurrentItem(prev => ({ ...prev, unit }));
                                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                }}
                              >
                                <Text style={[
                                  styles.unitChipText,
                                  currentItem.unit === unit && styles.unitChipTextActive,
                                ]}>
                                  {unit}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        </ScrollView>
                      </View>
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Expiry Date (Optional)</Text>
                      <TextInput
                        style={styles.textInput}
                        placeholder="YYYY-MM-DD"
                        placeholderTextColor={Colors.text.secondary}
                        value={currentItem.expiresOn}
                        onChangeText={(text) => setCurrentItem(prev => ({ ...prev, expiresOn: text }))}
                      />
                    </View>

                    <TouchableOpacity style={styles.addButton} onPress={addCurrentItem}>
                      <Ionicons name="add-circle" size={24} color={Colors.white} />
                      <Text style={styles.addButtonText}>Add Item</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Added Items List */}
                  {addedItems.length > 0 && (
                    <View style={styles.addedItems}>
                      <Text style={styles.sectionTitle}>Items to Add ({addedItems.length})</Text>
                      {addedItems.map((item) => (
                        <View key={item.id} style={styles.addedItem}>
                          <View style={styles.itemInfo}>
                            <Text style={styles.itemTitle}>{item.title}</Text>
                            <Text style={styles.itemDetails}>
                              {item.qty} {item.unit}
                              {item.expiresOn && ` • Expires: ${formatDate(item.expiresOn)}`}
                            </Text>
                          </View>
                          <TouchableOpacity
                            onPress={() => removeAddedItem(item.id)}
                            style={styles.removeButton}
                          >
                            <Ionicons name="trash-outline" size={16} color="#EF4444" />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  )}
                </ScrollView>

                {/* Bottom Actions */}
                <View style={styles.bottomActions}>
                  <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.saveButton, addedItems.length === 0 && styles.saveButtonDisabled]} 
                    onPress={handleSave}
                    disabled={addedItems.length === 0}
                  >
                    <Text style={[styles.saveButtonText, addedItems.length === 0 && styles.saveButtonTextDisabled]}>
                      Save {addedItems.length > 0 && `(${addedItems.length})`}
                    </Text>
                  </TouchableOpacity>
                </View>
              </KeyboardAvoidingView>
            </SafeAreaView>
          </Animated.View>
        </BlurView>
      </Modal>

      <PantryCameraModal
        visible={showCamera}
        onClose={() => setShowCamera(false)}
        onDetectedItems={handleCameraResults}
      />
    </>
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
    maxHeight: '90%',
  },
  modalContent: {
    flex: 1,
  },
  keyboardView: {
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
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  closeButton: {
    padding: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  primaryAction: {
    backgroundColor: Colors.primary,
  },
  secondaryAction: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  form: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: Colors.text.primary,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  unitSelector: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  unitChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  unitChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  unitChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  unitChipTextActive: {
    color: Colors.white,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  addedItems: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  addedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
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
  removeButton: {
    padding: 8,
  },
  bottomActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: Colors.surface,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  saveButton: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  saveButtonDisabled: {
    backgroundColor: Colors.surface,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  saveButtonTextDisabled: {
    color: Colors.text.secondary,
  },
});
