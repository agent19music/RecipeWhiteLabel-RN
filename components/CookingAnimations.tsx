import { Colors } from '@/constants/Colors';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

type AnimationType = 'chopping' | 'steaming' | 'mixing' | 'frying' | 'baking' | 'simmering';

interface CookingAnimationsProps {
  type?: AnimationType;
  message?: string;
  duration?: number;
}

export default function CookingAnimations({ 
  type = 'chopping', 
  message = 'Cooking up something delicious...',
  duration = 300
}: CookingAnimationsProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const steamAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initial fade and slide in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Start continuous animations based on type
    startContinuousAnimation();
  }, [type]);

  const startContinuousAnimation = () => {
    switch (type) {
      case 'chopping':
        startChoppingAnimation();
        break;
      case 'steaming':
        startSteamingAnimation();
        break;
      case 'mixing':
        startMixingAnimation();
        break;
      case 'frying':
        startFryingAnimation();
        break;
      case 'baking':
        startBakingAnimation();
        break;
      case 'simmering':
        startSimmeringAnimation();
        break;
    }
  };

  const startChoppingAnimation = () => {
    const chopSequence = () => {
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -10,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.delay(300),
      ]).start(() => chopSequence());
    };
    chopSequence();
  };

  const startSteamingAnimation = () => {
    const steamSequence = () => {
      Animated.sequence([
        Animated.timing(steamAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(steamAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start(() => steamSequence());
    };
    steamSequence();
  };

  const startMixingAnimation = () => {
    const mixSequence = () => {
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }).start(() => {
        rotateAnim.setValue(0);
        mixSequence();
      });
    };
    mixSequence();
  };

  const startFryingAnimation = () => {
    const frySequence = () => {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(200),
      ]).start(() => frySequence());
    };
    frySequence();
  };

  const startBakingAnimation = () => {
    const bakeSequence = () => {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => bakeSequence());
    };
    bakeSequence();
  };

  const startSimmeringAnimation = () => {
    const simmerSequence = () => {
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -2,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 2,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => simmerSequence());
    };
    simmerSequence();
  };

  const getIcon = () => {
    const rotateInterpolate = rotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    const steamOpacity = steamAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.3, 0.8, 0.1],
    });

    const steamTranslateY = steamAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -30],
    });

    switch (type) {
      case 'chopping':
        return (
          <Animated.View 
            style={[
              styles.iconContainer,
              { transform: [{ translateY: bounceAnim }] }
            ]}
          >
            <MaterialCommunityIcons 
              name="knife" 
              size={80} 
              color={Colors.primary}
            />
          </Animated.View>
        );

      case 'steaming':
        return (
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons 
              name="pot-steam" 
              size={80} 
              color={Colors.primary}
            />
            {/* Steam effects */}
            {[...Array(3)].map((_, i) => (
              <Animated.View
                key={i}
                style={[
                  styles.steamParticle,
                  {
                    left: 20 + i * 15,
                    opacity: steamOpacity,
                    transform: [
                      { translateY: steamTranslateY },
                      { scale: steamAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.5, 1.5],
                      })}
                    ],
                  },
                ]}
              >
                <Ionicons name="ellipse" size={8} color={Colors.gray[400]} />
              </Animated.View>
            ))}
          </View>
        );

      case 'mixing':
        return (
          <Animated.View 
            style={[
              styles.iconContainer,
              { transform: [{ rotate: rotateInterpolate }] }
            ]}
          >
            <MaterialCommunityIcons 
              name="spoon" 
              size={80} 
              color={Colors.primary}
            />
          </Animated.View>
        );

      case 'frying':
        return (
          <Animated.View 
            style={[
              styles.iconContainer,
              { transform: [{ scale: scaleAnim }] }
            ]}
          >
            <MaterialCommunityIcons 
              name="frying-pan" 
              size={80} 
              color={Colors.primary}
            />
          </Animated.View>
        );

      case 'baking':
        return (
          <Animated.View 
            style={[
              styles.iconContainer,
              { transform: [{ scale: scaleAnim }] }
            ]}
          >
            <MaterialCommunityIcons 
              name="oven" 
              size={80} 
              color={Colors.primary}
            />
          </Animated.View>
        );

      case 'simmering':
        return (
          <Animated.View 
            style={[
              styles.iconContainer,
              { transform: [{ translateY: bounceAnim }] }
            ]}
          >
            <MaterialCommunityIcons 
              name="pot" 
              size={80} 
              color={Colors.primary}
            />
          </Animated.View>
        );

      default:
        return (
          <MaterialCommunityIcons 
            name="chef-hat" 
            size={80} 
            color={Colors.primary}
          />
        );
    }
  };

  const getActionText = () => {
    switch (type) {
      case 'chopping':
        return 'Chopping ingredients...';
      case 'steaming':
        return 'Steaming to perfection...';
      case 'mixing':
        return 'Mixing flavors...';
      case 'frying':
        return 'Frying to golden brown...';
      case 'baking':
        return 'Baking with love...';
      case 'simmering':
        return 'Simmering slowly...';
      default:
        return 'Cooking with care...';
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.animationContainer}>
        {getIcon()}
      </View>
      
      <Text style={styles.actionText}>{getActionText()}</Text>
      <Text style={styles.message}>{message}</Text>
      
      {/* Progress dots */}
      <View style={styles.dotsContainer}>
        {[...Array(3)].map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.dot,
              {
                opacity: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 1],
                }),
                transform: [{
                  scale: scaleAnim.interpolate({
                    inputRange: [1, 1.1],
                    outputRange: [1, 1.2],
                  })
                }],
              },
            ]}
          />
        ))}
      </View>
    </Animated.View>
  );
}

// Animation sequence component for multiple steps
interface CookingSequenceProps {
  steps: AnimationType[];
  messages?: string[];
  stepDuration?: number;
  onComplete?: () => void;
}

export function CookingSequence({ 
  steps, 
  messages = [], 
  stepDuration = 3000,
  onComplete 
}: CookingSequenceProps) {
  const [currentStep, setCurrentStep] = React.useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentStep < steps.length - 1) {
        // Fade out current, fade in next
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
        
        setTimeout(() => {
          setCurrentStep(prev => prev + 1);
        }, 300);
      } else if (onComplete) {
        onComplete();
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [currentStep, steps.length]);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <CookingAnimations
        type={steps[currentStep]}
        message={messages[currentStep] || `Step ${currentStep + 1} of ${steps.length}`}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 40,
  },
  animationContainer: {
    position: 'relative',
    marginBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
    height: 120,
    width: 120,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  steamParticle: {
    position: 'absolute',
    top: -20,
  },
  actionText: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
});
