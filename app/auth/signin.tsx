import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { theme, useTheme } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import * as Haptics from 'expo-haptics';
import Dialog from '@/components/Dialog';
import { useDialog } from '@/hooks/useDialog';


// Removed unused Dimensions variables

export default function SignInScreen() {
  const { palette } = useTheme();
  const router = useRouter();
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword, loading, error, } = useAuth();

  // Form state
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Forgot password modal
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const { dialog, showErrorDialog, showSuccessDialog, hideDialog } = useDialog();
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const formAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(formAnim, {
        toValue: 1,
        duration: 600,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      showErrorDialog('Error', error);
    }
  }, [error, showErrorDialog]);

  const handleGoogleSignIn = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await signInWithGoogle();
    } catch {
      // Error handled by context
    }
  };

  const handleEmailAuth = async () => {
    if (!email.trim() || !password.trim()) {
      showErrorDialog('Error', 'Please fill in all required fields');
      return;
    }

    if (isSignUp) {
      if (!fullName.trim()) {
        showErrorDialog('Error', 'Please enter your full name');
        return;
      }
      if (password !== confirmPassword) {
        showErrorDialog('Error', 'Passwords do not match');
        return;
      }
      if (password.length < 6) {
        showErrorDialog('Error', 'Password must be at least 6 characters');
        return;
      }
    }

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      if (isSignUp) {
        await signUpWithEmail(email, password, fullName);
        showSuccessDialog(
          'Success!',
          'Please check your email for a confirmation link.'
        );
      } else {
        await signInWithEmail(email, password);
      }
    } catch {
      // Error handled by context
    }
  };

  const toggleMode = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsSignUp(!isSignUp);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
    hideDialog();
  };

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace('/(tabs)');
  };

  const handleForgotPassword = async () => {
    if (!resetEmail.trim()) {
      showErrorDialog('Error', 'Please enter your email address');
      return;
    }

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await resetPassword(resetEmail);
      setShowForgotPassword(false);
      setResetEmail('');
      showSuccessDialog(
        'Reset Email Sent!',
        'Please check your email for password reset instructions.'
      );
    } catch {
      // Error handled by context
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: palette.bg }]} edges={['top', 'bottom']}>
      {/* Background Image */}
      <ImageBackground
        source={require('../../assets/images/splash.png')}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
        blurRadius={2}
      >
        {/* Dark overlay for better readability */}
        <View style={[styles.overlay, { backgroundColor: 'rgba(255	253	208)' }]} />
        {/* Theme overlay for consistency */}
        {/* <View style={[styles.overlay, { backgroundColor: palette.bg + '40' }]} /> */}
      </ImageBackground>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Animated.View
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim },
                ],
              },
            ]}
          >
            {/* App Icon */}
              <ImageBackground
                  source={require('../../assets/images/icon.png')}
                  style={styles.iconContainer}
                  imageStyle={{ borderRadius: 20 }}
              />

            {/* Title */}
            <Text style={[styles.title, { color: palette.text }]}>
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </Text>

            {/* Subtitle */}
            <Text style={[styles.subtitle, { color: palette.subtext }]}>
              {isSignUp 
                ? 'Join thousands of food lovers on their culinary journey' 
                : 'Sign in to access your personalized recipe collection'
              }
            </Text>
          </Animated.View>

          {/* Form */}
          <Animated.View
            style={[
              styles.form,
              { opacity: formAnim }
            ]}
          >
            {/* Google Sign In Button */}
            <TouchableOpacity
              style={[styles.googleButton, { borderColor: palette.border }]}
              onPress={handleGoogleSignIn}
              disabled={loading}
            >
              <View style={styles.googleButtonContent}>
                <MaterialCommunityIcons name="google" size={24} color="#DB4437" />
                <Text style={[styles.googleButtonText, { color: palette.text }]}>
                  {isSignUp ? 'Continue with Google' : 'Sign in with Google'}
                </Text>
              </View>
              {loading && (
                <ActivityIndicator size="small" color={palette.primary} />
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={[styles.dividerLine, { backgroundColor: palette.border }]} />
              <Text style={[styles.dividerText, { color: palette.subtext }]}>or</Text>
              <View style={[styles.dividerLine, { backgroundColor: palette.border }]} />
            </View>

            {/* Email Form */}
            <View style={styles.emailForm}>
              {/* Full Name Input (Sign Up Only) */}
              {isSignUp && (
                <View style={styles.inputContainer}>
                  <View style={[styles.inputWrapper, { backgroundColor: palette.card, borderColor: palette.border }]}>
                    <Ionicons name="person-outline" size={20} color={palette.subtext} />
                    <TextInput
                      style={[styles.input, { color: palette.text }]}
                      placeholder="Full Name"
                      placeholderTextColor={palette.subtext}
                      value={fullName}
                      onChangeText={setFullName}
                      autoComplete="name"
                      textContentType="name"
                    />
                  </View>
                </View>
              )}

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <View style={[styles.inputWrapper, { backgroundColor: palette.card, borderColor: palette.border }]}>
                  <Ionicons name="mail-outline" size={20} color={palette.subtext} />
                  <TextInput
                    style={[styles.input, { color: palette.text }]}
                    placeholder="Email Address"
                    placeholderTextColor={palette.subtext}
                    value={email}
                    onChangeText={setEmail}
                    autoComplete="email"
                    textContentType="emailAddress"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <View style={[styles.inputWrapper, { backgroundColor: palette.card, borderColor: palette.border }]}>
                  <Ionicons name="lock-closed-outline" size={20} color={palette.subtext} />
                  <TextInput
                    style={[styles.input, { color: palette.text }]}
                    placeholder="Password"
                    placeholderTextColor={palette.subtext}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoComplete={isSignUp ? "new-password" : "current-password"}
                    textContentType={isSignUp ? "newPassword" : "password"}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                  >
                    <Ionicons
                      name={showPassword ? "eye-outline" : "eye-off-outline"}
                      size={20}
                      color={palette.subtext}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Password Input (Sign Up Only) */}
              {isSignUp && (
                <View style={styles.inputContainer}>
                  <View style={[styles.inputWrapper, { backgroundColor: palette.card, borderColor: palette.border }]}>
                    <Ionicons name="lock-closed-outline" size={20} color={palette.subtext} />
                    <TextInput
                      style={[styles.input, { color: palette.text }]}
                      placeholder="Confirm Password"
                      placeholderTextColor={palette.subtext}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={!showConfirmPassword}
                      autoComplete="new-password"
                      textContentType="newPassword"
                    />
                    <TouchableOpacity
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={styles.eyeButton}
                    >
                      <Ionicons
                        name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                        size={20}
                        color={palette.subtext}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Forgot Password (Sign In Only) */}
              {!isSignUp && (
                <TouchableOpacity 
                  style={styles.forgotPassword}
                  onPress={() => setShowForgotPassword(true)}
                >
                  <Text style={[styles.forgotPasswordText, { color: palette.primary }]}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              )}

              {/* Submit Button */}
              <TouchableOpacity
                style={[styles.submitButton, { backgroundColor: palette.primary }]}
                onPress={handleEmailAuth}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.submitButtonText}>
                    {isSignUp ? 'Create Account' : 'Sign In'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Footer */}
          <Animated.View
            style={[
              styles.footer,
              { opacity: formAnim }
            ]}
          >
            {/* Toggle Mode */}
            <View style={styles.toggleContainer}>
              <Text style={[styles.toggleText, { color: palette.subtext }]}>
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              </Text>
              <TouchableOpacity onPress={toggleMode} style={styles.toggleButton}>
                <Text style={[styles.toggleButtonText, { color: palette.primary }]}>
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Skip Button */}
            <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
              <Text style={[styles.skipButtonText, { color: palette.subtext }]}>
                Continue as Guest
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Forgot Password Modal */}
      <Modal
        visible={showForgotPassword}
        transparent
        animationType="fade"
        onRequestClose={() => setShowForgotPassword(false)}
      >
        <View style={styles.modalOverlay}>
          <BlurView intensity={20} style={StyleSheet.absoluteFillObject} />
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalKeyboardView}
          >
            <View style={[styles.modalContainer, { backgroundColor: palette.card }]}>
              <Text style={[styles.modalTitle, { color: palette.text }]}>
                Reset Password
              </Text>
              <Text style={[styles.modalSubtitle, { color: palette.subtext }]}>
                Enter your email address and we&apos;ll send you instructions to reset your password.
              </Text>
              
              <View style={[styles.inputWrapper, { backgroundColor: palette.bg, borderColor: palette.border }]}>
                <Ionicons name="mail-outline" size={20} color={palette.subtext} />
                <TextInput
                  style={[styles.input, { color: palette.text }]}
                  placeholder="Email Address"
                  placeholderTextColor={palette.subtext}
                  value={resetEmail}
                  onChangeText={setResetEmail}
                  autoComplete="email"
                  textContentType="emailAddress"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton, { borderColor: palette.border }]}
                  onPress={() => {
                    setShowForgotPassword(false);
                    setResetEmail('');
                  }}
                >
                  <Text style={[styles.cancelButtonText, { color: palette.subtext }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.modalButton, styles.resetButton, { backgroundColor: palette.primary }]}
                  onPress={handleForgotPassword}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.resetButtonText}>
                      Send Reset Email
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
      <Dialog
        visible={dialog.visible}
        onClose={hideDialog}  
        title={dialog.title}
        message={dialog.message}
        icon={dialog.icon}
        actions={dialog.actions}
      />
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.space.xl,
    paddingVertical: theme.space.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.space.xxl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.space.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: theme.space.md,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
    opacity: 0.8,
    paddingHorizontal: theme.space.md,
  },
  form: {
    marginBottom: theme.space.xl,
  },
  googleButton: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.space.lg,
    marginBottom: theme.space.xl,
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: theme.space.md,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.space.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    paddingHorizontal: theme.space.md,
    fontSize: 14,
    fontWeight: '500',
  },
  emailForm: {
    gap: theme.space.lg,
  },
  inputContainer: {
    marginBottom: theme.space.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: theme.space.lg,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: theme.space.md,
  },
  eyeButton: {
    padding: theme.space.xs,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -theme.space.sm,
    marginBottom: theme.space.sm,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '600',
  },
  submitButton: {
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.space.md,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    gap: theme.space.lg,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 14,
  },
  toggleButton: {
    marginLeft: theme.space.xs,
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  skipButton: {
    paddingVertical: theme.space.sm,
  },
  skipButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalKeyboardView: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    width: '85%',
    maxWidth: 400,
    borderRadius: 24,
    padding: theme.space.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: theme.space.sm,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: theme.space.xl,
    textAlign: 'center',
    opacity: 0.8,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.space.xl,
    gap: theme.space.md,
  },
  modalButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    borderWidth: 1,
  },
  resetButton: {},
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
