import { Colors } from '@/constants/Colors';
import { Challenge } from '@/data/challenges';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import React, { useState, useRef } from 'react';
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
  Animated,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {useDialog} from '@/hooks/useDialog';


interface SubmissionModalProps {
  visible: boolean;
  campaign: Challenge | null;
  onClose: () => void;
  onSubmitSuccess: () => void;
}

enum FormStep {
  PHOTOS = 0,
  RECIPE_INFO = 1,
  INGREDIENTS = 2,
  INSTRUCTIONS = 3,
  ADDITIONAL_INFO = 4,
  REVIEW = 5,
}

const STEP_TITLES = [
  'Add Photos',
  'Recipe Details',
  'Ingredients',
  'Instructions',
  'Additional Info',
  'Review & Submit'
];

const TOTAL_STEPS = Object.keys(FormStep).length / 2; // Enum has both numeric and string keys

export default function SubmissionModal({
  visible,
  campaign,
  onClose,
  onSubmitSuccess,
}: SubmissionModalProps) {
  const insets = useSafeAreaInsets();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showErrorDialog, showSuccessDialog } = useDialog();
  
  // Multi-step form state
  const [currentStep, setCurrentStep] = useState<FormStep>(FormStep.PHOTOS);
  const progressAnimation = useRef(new Animated.Value(0)).current;
  
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
    setCurrentStep(FormStep.PHOTOS);
    Animated.timing(progressAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const updateProgress = (step: FormStep) => {
    const progress = (step / (TOTAL_STEPS - 1)) * 100;
    Animated.timing(progressAnimation, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const nextStep = () => {
    if (currentStep < FormStep.REVIEW) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      updateProgress(newStep);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const prevStep = () => {
    if (currentStep > FormStep.PHOTOS) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      updateProgress(newStep);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const canProceedFromStep = (step: FormStep): boolean => {
    switch (step) {
      case FormStep.PHOTOS:
        return images.length > 0;
      case FormStep.RECIPE_INFO:
        return title.trim() !== '' && description.trim() !== '';
      case FormStep.INGREDIENTS:
        return ingredients.trim() !== '';
      case FormStep.INSTRUCTIONS:
        return instructions.trim() !== '';
      case FormStep.ADDITIONAL_INFO:
        return true; // Optional fields
      case FormStep.REVIEW:
        return true;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case FormStep.PHOTOS:
        return renderPhotosStep();
      case FormStep.RECIPE_INFO:
        return renderRecipeInfoStep();
      case FormStep.INGREDIENTS:
        return renderIngredientsStep();
      case FormStep.INSTRUCTIONS:
        return renderInstructionsStep();
      case FormStep.ADDITIONAL_INFO:
        return renderAdditionalInfoStep();
      case FormStep.REVIEW:
        return renderReviewStep();
      default:
        return null;
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showErrorDialog('Permission Denied', 'Camera roll permissions are required.');
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

  const renderPhotosStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Show off your dish! 📸</Text>
        <Text style={styles.stepDescription}>
          Add photos of your finished recipe. Great photos make your entry stand out!
        </Text>
      </View>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.imagesContainer}
        contentContainerStyle={styles.imagesContentContainer}
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
      
      {images.length === 0 && (
        <View style={styles.emptyStateContainer}>
          <Ionicons name="camera-outline" size={48} color={Colors.text.tertiary} />
          <Text style={styles.emptyStateText}>No photos added yet</Text>
          <Text style={styles.emptyStateSubtext}>Tap "Add Photo" to get started</Text>
        </View>
      )}
    </View>
  );

  const renderRecipeInfoStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Tell us about your recipe ✨</Text>
        <Text style={styles.stepDescription}>
          Give your recipe a catchy name and describe what makes it special.
        </Text>
      </View>

      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>
          Recipe Title <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Grandma's Secret Pilau"
          placeholderTextColor={Colors.text.tertiary}
          value={title}
          onChangeText={setTitle}
          maxLength={100}
        />
        <Text style={styles.charCounter}>{title.length}/100</Text>
      </View>

      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>
          Description <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="What makes your recipe special? Share the story behind it..."
          placeholderTextColor={Colors.text.tertiary}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          maxLength={500}
        />
        <Text style={styles.charCounter}>{description.length}/500</Text>
      </View>
    </View>
  );

  const renderIngredientsStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>List your ingredients 🥄</Text>
        <Text style={styles.stepDescription}>
          List each ingredient on a new line with quantities. Be specific!
        </Text>
      </View>

      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>
          Ingredients <Text style={styles.required}>*</Text>
        </Text>
        <Text style={styles.inputHint}>
          💡 Tip: Include quantities (e.g., "2 cups rice", "1 tsp salt")
        </Text>
        <TextInput
          style={[styles.input, styles.textArea, styles.ingredientsInput]}
          placeholder="2 cups basmati rice&#10;1 kg beef, cubed&#10;2 large onions, sliced&#10;3 cloves garlic, minced&#10;..."
          placeholderTextColor={Colors.text.tertiary}
          value={ingredients}
          onChangeText={setIngredients}
          multiline
          numberOfLines={8}
        />
      </View>
    </View>
  );

  const renderInstructionsStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Cooking instructions 👨‍🍳</Text>
        <Text style={styles.stepDescription}>
          Step-by-step instructions. Make it easy for others to follow!
        </Text>
      </View>

      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>
          Cooking Steps <Text style={styles.required}>*</Text>
        </Text>
        <Text style={styles.inputHint}>
          💡 Tip: Number your steps and include timing details
        </Text>
        <TextInput
          style={[styles.input, styles.textArea, styles.instructionsInput]}
          placeholder="1. Heat oil in a large pot over medium heat&#10;2. Add onions and cook until golden (5 mins)&#10;3. Add beef and brown on all sides&#10;4. Add spices and cook for 2 minutes&#10;..."
          placeholderTextColor={Colors.text.tertiary}
          value={instructions}
          onChangeText={setInstructions}
          multiline
          numberOfLines={8}
        />
      </View>
    </View>
  );

  const renderAdditionalInfoStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Final details 📋</Text>
        <Text style={styles.stepDescription}>
          Optional information to help others plan their cooking.
        </Text>
      </View>

      <View style={styles.row}>
        <View style={[styles.inputSection, { flex: 1 }]}>
          <Text style={styles.inputLabel}>Cooking Time</Text>
          <Text style={styles.inputHint}>Total minutes</Text>
          <TextInput
            style={styles.input}
            placeholder="60"
            placeholderTextColor={Colors.text.tertiary}
            value={cookingTime}
            onChangeText={setCookingTime}
            keyboardType="number-pad"
          />
        </View>
        <View style={[styles.inputSection, { flex: 1 }]}>
          <Text style={styles.inputLabel}>Servings</Text>
          <Text style={styles.inputHint}>Number of people</Text>
          <TextInput
            style={styles.input}
            placeholder="4"
            placeholderTextColor={Colors.text.tertiary}
            value={servings}
            onChangeText={setServings}
            keyboardType="number-pad"
          />
        </View>
      </View>

      <View style={styles.optionalInfoCard}>
        <Ionicons name="information-circle" size={20} color={Colors.primary} />
        <Text style={styles.optionalInfoText}>
          These details are optional but help other cooks plan better!
        </Text>
      </View>
    </View>
  );

  const renderReviewStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Review your submission 🎯</Text>
        <Text style={styles.stepDescription}>
          Double-check everything looks good before submitting to the campaign.
        </Text>
      </View>

      <ScrollView style={styles.reviewContainer} showsVerticalScrollIndicator={false}>
        {/* Photos Review */}
        <View style={styles.reviewSection}>
          <Text style={styles.reviewSectionTitle}>Photos ({images.length})</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {images.map((uri, index) => (
              <Image key={index} source={{ uri }} style={styles.reviewImage} />
            ))}
          </ScrollView>
        </View>

        {/* Recipe Info Review */}
        <View style={styles.reviewSection}>
          <Text style={styles.reviewSectionTitle}>Recipe Details</Text>
          <View style={styles.reviewItem}>
            <Text style={styles.reviewLabel}>Title:</Text>
            <Text style={styles.reviewValue}>{title}</Text>
          </View>
          <View style={styles.reviewItem}>
            <Text style={styles.reviewLabel}>Description:</Text>
            <Text style={styles.reviewValue}>{description}</Text>
          </View>
        </View>

        {/* Ingredients Review */}
        <View style={styles.reviewSection}>
          <Text style={styles.reviewSectionTitle}>Ingredients</Text>
          {ingredients.split('\n').filter(i => i.trim()).map((ingredient, index) => (
            <View key={index} style={styles.reviewListItem}>
              <Text style={styles.reviewBullet}>•</Text>
              <Text style={styles.reviewListText}>{ingredient}</Text>
            </View>
          ))}
        </View>

        {/* Instructions Review */}
        <View style={styles.reviewSection}>
          <Text style={styles.reviewSectionTitle}>Instructions</Text>
          {instructions.split('\n').filter(i => i.trim()).map((instruction, index) => (
            <View key={index} style={styles.reviewListItem}>
              <Text style={styles.reviewStepNumber}>{index + 1}</Text>
              <Text style={styles.reviewListText}>{instruction}</Text>
            </View>
          ))}
        </View>

        {/* Additional Info Review */}
        {(cookingTime || servings) && (
          <View style={styles.reviewSection}>
            <Text style={styles.reviewSectionTitle}>Additional Details</Text>
            {cookingTime && (
              <View style={styles.reviewItem}>
                <Text style={styles.reviewLabel}>Cooking Time:</Text>
                <Text style={styles.reviewValue}>{cookingTime} minutes</Text>
              </View>
            )}
            {servings && (
              <View style={styles.reviewItem}>
                <Text style={styles.reviewLabel}>Servings:</Text>
                <Text style={styles.reviewValue}>{servings} people</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );

  const validateForm = (): boolean => {
    if (!title.trim()) {
      showErrorDialog('Error', 'Please enter a recipe title');
      return false;
    }
    if (!description.trim()) {
      showErrorDialog('Error', 'Please enter a description');
      return false;
    }
    if (!ingredients.trim()) {
      showErrorDialog('Error', 'Please list the ingredients');
      return false;
    }
    if (!instructions.trim()) {
      showErrorDialog('Error', 'Please provide cooking instructions');
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
      showSuccessDialog(
        'Success! 🎉',
        'Your recipe has been submitted to the challenge. Good luck!',
      );

      resetForm();
      onSubmitSuccess();
      onClose();
  
   
    } catch (error) {
      console.error('Submission error:', error);
      showErrorDialog(
        'Submission Failed',
        'There was an error submitting your recipe. Please try again.',
      );
      resetForm();
      onSubmitSuccess();
      onClose();
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
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{STEP_TITLES[currentStep]}</Text>
            <Text style={styles.stepCounter}>Step {currentStep + 1} of {TOTAL_STEPS}</Text>
          </View>
          <TouchableOpacity
            onPress={currentStep === FormStep.REVIEW ? handleSubmit : nextStep}
            disabled={!canProceedFromStep(currentStep) || isSubmitting}
            style={[styles.actionButton, (!canProceedFromStep(currentStep) || isSubmitting) && styles.actionButtonDisabled]}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : (
              <Text style={[styles.actionButtonText, (!canProceedFromStep(currentStep) || isSubmitting) && styles.actionButtonTextDisabled]}>
                {currentStep === FormStep.REVIEW ? 'Submit' : 'Next'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <Animated.View 
              style={[
                styles.progressFill,
                {
                  width: progressAnimation.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                    extrapolate: 'clamp',
                  }),
                }
              ]} 
            />
          </View>
        </View>

        {/* Content */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Campaign Info - Only show on first step */}
          {currentStep === FormStep.PHOTOS && (
            <View style={styles.campaignInfo}>
              <Text style={styles.campaignName}>{campaign.name}</Text>
              <Text style={styles.campaignHint}>Share your best recipe to win!</Text>
            </View>
          )}

          {/* Step Content */}
          {renderStepContent()}

          {/* Bottom Navigation */}
          <View style={styles.bottomNavigation}>
            {currentStep > FormStep.PHOTOS && (
              <TouchableOpacity 
                style={styles.navButton}
                onPress={prevStep}
              >
                <Ionicons name="chevron-back" size={20} color={Colors.primary} />
                <Text style={styles.navButtonText}>Back</Text>
              </TouchableOpacity>
            )}
            
            <View style={styles.navSpacer} />
            
            {currentStep < FormStep.REVIEW && (
              <TouchableOpacity 
                style={[styles.navButton, styles.nextButton, !canProceedFromStep(currentStep) && styles.navButtonDisabled]}
                onPress={nextStep}
                disabled={!canProceedFromStep(currentStep)}
              >
                <Text style={[styles.navButtonText, styles.nextButtonText, !canProceedFromStep(currentStep) && styles.navButtonTextDisabled]}>
                  Next
                </Text>
                <Ionicons name="chevron-forward" size={20} color={!canProceedFromStep(currentStep) ? Colors.text.tertiary : Colors.white} />
              </TouchableOpacity>
            )}
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
  headerCenter: {
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  stepCounter: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  cancelButton: {
    fontSize: 17,
    color: Colors.text.secondary,
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: Colors.primary,
  },
  actionButtonDisabled: {
    backgroundColor: Colors.surface,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  actionButtonTextDisabled: {
    color: Colors.text.tertiary,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingBottom: 8,
    backgroundColor: Colors.white,
  },
  progressBackground: {
    height: 3,
    backgroundColor: Colors.surface,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
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
  stepContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  stepHeader: {
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: Colors.text.secondary,
    lineHeight: 22,
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  inputHint: {
    fontSize: 13,
    color: Colors.text.secondary,
    marginBottom: 8,
    fontStyle: 'italic',
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
  ingredientsInput: {
    minHeight: 160,
  },
  instructionsInput: {
    minHeight: 160,
  },
  charCounter: {
    fontSize: 12,
    color: Colors.text.tertiary,
    textAlign: 'right',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  optionalInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 12,
    borderRadius: 12,
    marginTop: 16,
  },
  optionalInfoText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 8,
    flex: 1,
  },
  imagesContainer: {
    marginVertical: 16,
  },
  imagesContentContainer: {
    paddingRight: 20,
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
  emptyStateContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    marginTop: 16,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.secondary,
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.text.tertiary,
    marginTop: 4,
  },
  bottomNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginTop: 20,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Colors.surface,
  },
  nextButton: {
    backgroundColor: Colors.primary,
  },
  navButtonDisabled: {
    backgroundColor: Colors.surface,
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  nextButtonText: {
    color: Colors.white,
  },
  navButtonTextDisabled: {
    color: Colors.text.tertiary,
  },
  navSpacer: {
    flex: 1,
  },
  reviewContainer: {
    flex: 1,
  },
  reviewSection: {
    marginBottom: 24,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  reviewSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  reviewItem: {
    marginBottom: 12,
  },
  reviewLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  reviewValue: {
    fontSize: 16,
    color: Colors.text.primary,
    lineHeight: 22,
  },
  reviewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: Colors.surface,
  },
  reviewListItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  reviewBullet: {
    fontSize: 16,
    color: Colors.primary,
    marginRight: 8,
    marginTop: 2,
  },
  reviewStepNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    width: 20,
    height: 20,
    textAlign: 'center',
    lineHeight: 20,
    marginRight: 8,
    marginTop: 1,
  },
  reviewListText: {
    fontSize: 15,
    color: Colors.text.primary,
    flex: 1,
    lineHeight: 20,
  },
});