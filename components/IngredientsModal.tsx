import { BlurView } from 'expo-blur';
import React, { useState } from 'react';
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { theme, useTheme } from '../theme';

interface IngredientsModalProps {
  visible: boolean;
  onClose: () => void;
  ingredients: string[];
  onRemove: (ingredient: string) => void;
  onAdd: (ingredient: string) => void;
}

export default function IngredientsModal({
  visible,
  onClose,
  ingredients,
  onRemove,
  onAdd,
}: IngredientsModalProps) {
  const { palette } = useTheme();
  const [newIngredient, setNewIngredient] = useState('');

  const handleAdd = () => {
    const value = newIngredient.trim().toLowerCase();
    if (!value) return;
    if (!ingredients.includes(value)) {
      onAdd(value);
    }
    setNewIngredient('');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <BlurView intensity={100} tint="light" style={{ flex: 1 }}>
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(255,255,255,0.95)',
          paddingTop: 60,
        }}>
          {/* Header */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: theme.space.lg,
            paddingBottom: theme.space.lg,
            borderBottomWidth: 0.5,
            borderBottomColor: palette.border + '40',
          }}>
            <View>
              <Text style={{
                fontSize: 32,
                fontWeight: '200',
                color: palette.text,
                letterSpacing: -1,
              }}>
                Ingredients
              </Text>
              <Text style={{
                fontSize: 13,
                color: palette.subtext,
                marginTop: 4,
                fontWeight: '400',
              }}>
                {ingredients.length} {ingredients.length === 1 ? 'item' : 'items'} captured
              </Text>
            </View>

            <TouchableOpacity
              onPress={onClose}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
              }}
            >
              <Text style={{
                fontSize: 17,
                color: palette.primary,
                fontWeight: '500',
              }}>
                Done
              </Text>
            </TouchableOpacity>
          </View>

          {/* Notebook Lines Background Effect */}
          <View style={{
            position: 'absolute',
            top: 120,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.03,
            pointerEvents: 'none',
          }}>
            {Array.from({ length: 20 }).map((_, i) => (
              <View
                key={i}
                style={{
                  height: 1,
                  backgroundColor: palette.text,
                  marginBottom: 31,
                }}
              />
            ))}
          </View>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          >
            <View style={{ paddingTop: theme.space.md }}>
              {/* Ingredient List Items */}
              {ingredients.map((ingredient, index) => (
                <TouchableOpacity
                  key={`ingredient-${index}`}
                  onPress={() => onRemove(ingredient)}
                  activeOpacity={0.7}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 14,
                    paddingHorizontal: theme.space.lg,
                    marginHorizontal: theme.space.md,
                    marginBottom: 8,
                    backgroundColor: palette.surface,
                    borderRadius: 12,
                    borderWidth: 0.5,
                    borderColor: palette.border + '30',
                  }}
                >
                  {/* Checkbox Style Circle */}
                  <View style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    borderWidth: 1.5,
                    borderColor: palette.primary,
                    marginRight: 14,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <View style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: palette.primary,
                    }}/>
                  </View>
                  
                  <Text style={{
                    flex: 1,
                    fontSize: 17,
                    color: palette.text,
                    fontWeight: '400',
                    letterSpacing: -0.2,
                    textTransform: 'capitalize',
                  }}>
                    {ingredient}
                  </Text>
                  
                  <Text style={{
                    fontSize: 12,
                    color: '#FF453A',
                    fontWeight: '500',
                    opacity: 0.7,
                  }}>
                    Remove
                  </Text>
                </TouchableOpacity>
              ))}

              {/* Add New Ingredient */}
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: theme.space.md,
                marginTop: theme.space.sm,
                paddingHorizontal: theme.space.lg,
                paddingVertical: 14,
                backgroundColor: '#F2F2F7',
                borderRadius: 12,
                borderWidth: 1,
                borderColor: palette.border + '20',
                borderStyle: 'dashed',
              }}>
                <View style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: palette.primary,
                  marginRight: 14,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Text style={{
                    color: '#fff',
                    fontSize: 14,
                    fontWeight: '600',
                    marginTop: -2,
                  }}>+</Text>
                </View>
                
                <TextInput
                  style={{
                    flex: 1,
                    fontSize: 17,
                    color: palette.text,
                    fontWeight: '400',
                    letterSpacing: -0.2,
                  }}
                  placeholder="Add ingredient..."
                  placeholderTextColor={palette.subtext + '80'}
                  value={newIngredient}
                  onChangeText={setNewIngredient}
                  onSubmitEditing={handleAdd}
                  returnKeyType="done"
                  autoCapitalize="words"
                />
                
                {newIngredient.trim() && (
                  <TouchableOpacity
                    onPress={handleAdd}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 6,
                      backgroundColor: palette.primary,
                      borderRadius: 14,
                    }}
                  >
                    <Text style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: '#fff',
                    }}>
                      Add
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Empty State */}
              {ingredients.length === 0 && (
                <View style={{
                  alignItems: 'center',
                  paddingTop: 60,
                  paddingHorizontal: 40,
                }}>
                  <Text style={{
                    fontSize: 15,
                    color: palette.subtext,
                    textAlign: 'center',
                    lineHeight: 22,
                    fontStyle: 'italic',
                  }}>
                    Your ingredients list is empty.
                    {"\n"}Start adding items above.
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </BlurView>
    </Modal>
  );
}


