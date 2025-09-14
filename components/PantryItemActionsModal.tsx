import { Colors } from '@/constants/Colors';
import { PantryItem } from '@/data/types';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef } from 'react';
import {
    Alert,
    Animated,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface PantryItemActionsModalProps {
  visible: boolean;
  item: PantryItem | null;
  onClose: () => void;
  onEdit: (item: PantryItem) => void;
  onDelete: (item: PantryItem) => void;
  onPin: (item: PantryItem) => void;
  onMarkLowStock: (item: PantryItem) => void;
}

export default function PantryItemActionsModal({
  visible,
  item,
  onClose,
  onEdit,
  onDelete,
  onPin,
  onMarkLowStock,
}: PantryItemActionsModalProps) {
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        damping: 15,
        stiffness: 150,
      }).start();
    } else {
      slideAnim.setValue(0);
    }
  }, [visible, slideAnim]);

  if (!visible || !item) return null;

  const handleDelete = () => {
    Alert.alert(
      'Delete Item',
      `Are you sure you want to remove "${item.title || item.name}" from your pantry?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            onDelete(item);
            onClose();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    onEdit(item);
    onClose();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePin = () => {
    onPin(item);
    onClose();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleMarkLowStock = () => {
    onMarkLowStock(item);
    onClose();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const getDaysUntilExpiry = () => {
    if (!item.expiresOn && !item.expiryDate) return null;
    const expiryDate = new Date(item.expiresOn || item.expiryDate!);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const actions = [
    {
      icon: 'create-outline',
      label: 'Edit Item',
      onPress: handleEdit,
      color: Colors.primary,
    },
    {
      icon: item.isPinned ? 'bookmark' : 'bookmark-outline',
      label: item.isPinned ? 'Unpin Item' : 'Pin Item',
      onPress: handlePin,
      color: Colors.primary,
    },
    {
      icon: item.isLowStock ? 'checkmark-circle' : 'alert-circle-outline',
      label: item.isLowStock ? 'Mark as Stocked' : 'Mark Low Stock',
      onPress: handleMarkLowStock,
      color: item.isLowStock ? '#10B981' : '#F59E0B',
    },
    {
      icon: 'trash-outline',
      label: 'Delete Item',
      onPress: handleDelete,
      color: '#EF4444',
    },
  ];

  const daysUntilExpiry = getDaysUntilExpiry();

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
              transform: [{
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [300, 0],
                }),
              }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.dragHandle} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemTitle}>{item.title || item.name}</Text>
              <Text style={styles.itemDetails}>
                {item.qty || item.quantity} {item.unit}
                {daysUntilExpiry !== null && (
                  <Text style={[
                    styles.expiryText,
                    { 
                      color: daysUntilExpiry <= 2 ? '#EF4444' : 
                             daysUntilExpiry <= 5 ? '#F59E0B' : '#10B981' 
                    }
                  ]}>
                    {' • '}
                    {daysUntilExpiry <= 0 ? 'Expired' : 
                     daysUntilExpiry === 1 ? '1 day left' : 
                     `${daysUntilExpiry} days left`}
                  </Text>
                )}
              </Text>
              {item.category && (
                <Text style={styles.itemCategory}>{item.category}</Text>
              )}
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            {actions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionItem}
                onPress={action.onPress}
                activeOpacity={0.7}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.color + '15' }]}>
                  <Ionicons name={action.icon as any} size={24} color={action.color} />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
                <Ionicons name="chevron-forward" size={20} color={Colors.text.secondary} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Cancel Button */}
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
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
    paddingBottom: 34, // Safe area bottom
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  dragHandle: {
    width: 36,
    height: 4,
    backgroundColor: Colors.text.secondary + '40',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  itemInfo: {
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  itemDetails: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  expiryText: {
    fontWeight: '600',
  },
  itemCategory: {
    fontSize: 14,
    color: Colors.text.secondary,
    opacity: 0.8,
    textTransform: 'capitalize',
  },
  actions: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 16,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  cancelButton: {
    marginHorizontal: 20,
    marginTop: 8,
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
});
