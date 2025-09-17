import { Colors } from '@/constants/Colors';
import { Challenge } from '@/data/challenges';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SubmissionModalProps {
  visible: boolean;
  campaign: Challenge | null;
  onClose: () => void;
  onSubmitSuccess: () => void;
}

export default function SubmissionModal({
  visible,
  campaign,
  onClose,
  onSubmitSuccess,
}: SubmissionModalProps) {
  const insets = useSafeAreaInsets();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [servings, setServings] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setIngredients('');
    setInstructions('');
    setCookingTime('');
    setServings('');
    setImages([]);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera roll permissions are required.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setImages([...images, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setImages(images.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a recipe title');
      return false;
    }
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return false;
    }
    if (!ingredients.trim()) {
      Alert.alert('Error', 'Please list the ingredients');
      return false;
    }
    if (!instructions.trim()) {
      Alert.alert('Error', 'Please provide cooking instructions');
      return false;
    }
    if (images.length === 0) {
      Alert.alert('Error', 'Please add at least one photo of your dish');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !campaign) return;

    setIsSubmitting(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('Authentication required');
      }

      // Check if user has a profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) {
        // Create profile if it doesn't exist
        const { data: newProfile, error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: user.id,
            email: user.email || '',
            full_name: user.user_metadata?.full_name || 'Chef',
            role: 'user',
            preferences: {},
          })
          .select()
          .single();

        if (profileError) throw profileError;
      }

      // First, join the campaign if not already joined
      const { error: joinError } = await supabase
        .from('campaign_participants')
        .upsert({
          campaign_id: campaign.id,
          user_id: profile?.id || user.id,
          status: 'active',
        }, {
          onConflict: 'campaign_id,user_id'
        });

      if (joinError) {
        console.error('Error joining campaign:', joinError);
      }

      // Upload images to storage
      const uploadedImageUrls: string[] = [];
      for (const imageUri of images) {
        try {
          const response = await fetch(imageUri);
          const blob = await response.blob();
          const fileName = `${campaign.id}/${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
          
          const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from('campaign_submissions')
            .upload(fileName, blob, {
              contentType: 'image/jpeg',
              upsert: false,
            });

          if (uploadError) {
            console.error('Image upload error:', uploadError);
            continue;
          }

          const { data: { publicUrl } } = supabase
            .storage
            .from('campaign_submissions')
            .getPublicUrl(fileName);

          uploadedImageUrls.push(publicUrl);
        } catch (error) {
          console.error('Error processing image:', error);
        }
      }

      // Create submission
      const submissionData = {
        campaign_id: campaign.id,
        user_id: profile?.id || user.id,
        title: title.trim(),
        description: description.trim(),
        content: {
          ingredients: ingredients.split('\n').filter(i => i.trim()),
          instructions: instructions.split('\n').filter(i => i.trim()),
          cooking_time: parseInt(cookingTime) || null,
          servings: parseInt(servings) || null,
        },
        images: uploadedImageUrls,
        status: 'submitted',
        submitted_at: new Date().toISOString(),
      };

      const { data: submission, error: submissionError } = await supabase
        .from('campaign_contributions')
        .insert(submissionData)
        .select()
        .single();

      if (submissionError) {
        throw submissionError;
      }

      // Update participant status
      await supabase
        .from('campaign_participants')
        .update({ 
          status: 'submitted',
          submission_count: 1,
          last_submission_date: new Date().toISOString()
        })
        .eq('campaign_id', campaign.id)
        .eq('user_id', profile?.id || user.id);

      // Success!
      Alert.alert(
        'Success! 🎉',
        'Your recipe has been submitted to the challenge. Good luck!',
        [
          {
            text: 'OK',
            onPress: () => {
              resetForm();
              onSubmitSuccess();
              onClose();
            },
          },
        ]
      );
    } catch (error) {
      console.error('Submission error:', error);
      Alert.alert(
        'Submission Failed',
        'There was an error submitting your recipe. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!campaign) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Submit Entry</Text>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : (
              <Text style={styles.submitButton}>Submit</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Campaign Info */}
          <View style={styles.campaignInfo}>
            <Text style={styles.campaignName}>{campaign.name}</Text>
            <Text style={styles.campaignHint}>Share your best recipe to win!</Text>
          </View>

          {/* Image Upload */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Photos <Text style={styles.required}>*</Text>
            </Text>
            <Text style={styles.sectionHint}>Add photos of your finished dish</Text>
            
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.imagesContainer}
            >
              {images.map((uri, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={{ uri }} style={styles.uploadedImage} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => removeImage(index)}
                  >
                    <Ionicons name="close-circle" size={24} color={Colors.white} />
                  </TouchableOpacity>
                </View>
              ))}
              
              {images.length < 5 && (
                <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
                  <Ionicons name="camera" size={32} color={Colors.text.secondary} />
                  <Text style={styles.addImageText}>Add Photo</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>

          {/* Recipe Title */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Recipe Title <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your recipe name"
              placeholderTextColor={Colors.text.tertiary}
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Description <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="What makes your recipe special?"
              placeholderTextColor={Colors.text.tertiary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              maxLength={500}
            />
          </View>

          {/* Ingredients */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Ingredients <Text style={styles.required}>*</Text>
            </Text>
            <Text style={styles.sectionHint}>List each ingredient on a new line</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="2 cups flour&#10;1 tsp salt&#10;3 eggs..."
              placeholderTextColor={Colors.text.tertiary}
              value={ingredients}
              onChangeText={setIngredients}
              multiline
              numberOfLines={5}
            />
          </View>

          {/* Instructions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Cooking Instructions <Text style={styles.required}>*</Text>
            </Text>
            <Text style={styles.sectionHint}>Step-by-step instructions</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="1. Preheat oven to 350°F&#10;2. Mix dry ingredients&#10;3. Add wet ingredients..."
              placeholderTextColor={Colors.text.tertiary}
              value={instructions}
              onChangeText={setInstructions}
              multiline
              numberOfLines={6}
            />
          </View>

          {/* Additional Info */}
          <View style={styles.row}>
            <View style={[styles.section, { flex: 1 }]}>
              <Text style={styles.sectionTitle}>Cooking Time</Text>
              <TextInput
                style={styles.input}
                placeholder="Minutes"
                placeholderTextColor={Colors.text.tertiary}
                value={cookingTime}
                onChangeText={setCookingTime}
                keyboardType="number-pad"
              />
            </View>
            <View style={[styles.section, { flex: 1 }]}>
              <Text style={styles.sectionTitle}>Servings</Text>
              <TextInput
                style={styles.input}
                placeholder="Number"
                placeholderTextColor={Colors.text.tertiary}
                value={servings}
                onChangeText={setServings}
                keyboardType="number-pad"
              />
            </View>
          </View>

          {/* Bottom Padding */}
          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  cancelButton: {
    fontSize: 17,
    color: Colors.text.secondary,
  },
  submitButton: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  campaignInfo: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: Colors.surface,
    marginBottom: 8,
  },
  campaignName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  campaignHint: {
    fontSize: 15,
    color: Colors.text.secondary,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  sectionHint: {
    fontSize: 13,
    color: Colors.text.secondary,
    marginBottom: 12,
  },
  required: {
    color: Colors.primary,
  },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text.primary,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  imagesContainer: {
    marginTop: 8,
  },
  imageWrapper: {
    marginRight: 12,
    position: 'relative',
  },
  uploadedImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: Colors.surface,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: Colors.error,
    borderRadius: 12,
  },
  addImageButton: {
    width: 120,
    height: 120,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surface,
  },
  addImageText: {
    fontSize: 13,
    color: Colors.text.secondary,
    marginTop: 4,
  },
});