import { Colors } from '@/constants/Colors';
import { RecipeStep } from '@/data/types';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import ModernButton from './ModernButton';

interface CookingStepperProps {
  steps: RecipeStep[];
  recipeId: string;
  recipeName: string;
}

export default function CookingStepper({ steps, recipeId, recipeName }: CookingStepperProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const handleStartCooking = () => {
    router.push(`/cook/${recipeId}`);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!steps || steps.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons name="chef-hat" size={48} color={Colors.gray[400]} />
        <Text style={styles.emptyText}>No cooking steps available</Text>
        <ModernButton
          title="Start Cooking"
          onPress={handleStartCooking}
          variant="primary"
          size="medium"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${((currentStep + 1) / steps.length) * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          Step {currentStep + 1} of {steps.length}
        </Text>
      </View>

      {/* Current Step */}
      <ScrollView style={styles.stepContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.stepHeader}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>{currentStep + 1}</Text>
          </View>
          <View style={styles.stepHeaderText}>
            {steps[currentStep].title && (
              <Text style={styles.stepTitle}>{steps[currentStep].title}</Text>
            )}
            {steps[currentStep].time && (
              <View style={styles.timeContainer}>
                <Ionicons name="time-outline" size={16} color={Colors.primary} />
                <Text style={styles.timeText}>{steps[currentStep].time} min</Text>
              </View>
            )}
          </View>
        </View>

        <Text style={styles.stepDescription}>{steps[currentStep].body}</Text>

        {/* Tips */}
        {steps[currentStep].tips && steps[currentStep].tips!.length > 0 && (
          <View style={styles.tipContainer}>
            <View style={styles.tipHeader}>
              <Ionicons name="bulb-outline" size={16} color={Colors.warning} />
              <Text style={styles.tipHeaderText}>Pro Tip</Text>
            </View>
            {steps[currentStep].tips!.map((tip, index) => (
              <Text key={index} style={styles.tipText}>• {tip}</Text>
            ))}
          </View>
        )}

        {/* Temperature indicator */}
        {steps[currentStep].temperature && (
          <View style={styles.temperatureContainer}>
            <Ionicons name="thermometer-outline" size={16} color={Colors.error} />
            <Text style={styles.temperatureText}>
              {steps[currentStep].temperature!.value}°{steps[currentStep].temperature!.unit}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[styles.navButton, currentStep === 0 && styles.navButtonDisabled]}
          onPress={prevStep}
          disabled={currentStep === 0}
        >
          <Ionicons 
            name="chevron-back" 
            size={20} 
            color={currentStep === 0 ? Colors.gray[400] : Colors.primary} 
          />
          <Text style={[
            styles.navButtonText, 
            currentStep === 0 && styles.navButtonTextDisabled
          ]}>
            Previous
          </Text>
        </TouchableOpacity>

        {currentStep === steps.length - 1 ? (
          <ModernButton
            title="Start Cooking"
            onPress={handleStartCooking}
            variant="primary"
            size="medium"
            icon={<MaterialCommunityIcons name="chef-hat" size={20} color={Colors.white} />}
          />
        ) : (
          <TouchableOpacity style={styles.navButton} onPress={nextStep}>
            <Text style={styles.navButtonText}>Next</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.primary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginVertical: 16,
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.gray[200],
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  stepContainer: {
    flex: 1,
    marginBottom: 20,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.white,
  },
  stepHeaderText: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  stepDescription: {
    fontSize: 16,
    color: Colors.text.secondary,
    lineHeight: 24,
    marginBottom: 16,
  },
  tipContainer: {
    backgroundColor: Colors.warning + '10',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  tipHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.warning,
  },
  tipText: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
    marginBottom: 4,
  },
  temperatureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.error + '10',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  temperatureText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.error,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Colors.surface,
  },
  navButtonDisabled: {
    backgroundColor: Colors.gray[100],
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.primary,
  },
  navButtonTextDisabled: {
    color: Colors.gray[400],
  },
});
