import { router } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function Login() {
  const insets = useSafeAreaInsets();

  // Local state for form inputs
  // These values should be sent to authentication API.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Replace this with real authentication logic
  // On success, navigate to main app
  // On failure, show error message
  const handleLogin = () => {
    router.replace('/(tabs)/map');
  };

  // Navigates to signup screen.
  const handleCreateAccount = () => {
    router.push('/signup');
  };

  return (
    <ThemedView style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: insets.top + 24,
              paddingBottom: Math.max(insets.bottom + 24, 24),
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header / Branding Section */}
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Image
                source={require('@/assets/images/logo.png')}
                style={styles.logo}
                resizeMode="cover"
              />
            </View>

            <ThemedText type="title" style={styles.title}>
              SmartCity
            </ThemedText>

            <ThemedText style={styles.subtitle}>
              Stay connected with your city, community, and local updates.
            </ThemedText>
          </View>

          {/* Login Form Card */}
          <View style={styles.card}>
            <ThemedText style={styles.sectionTitle}>Welcome Back</ThemedText>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Email</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#8E8E93"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Password</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#8E8E93"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Login Button */}
            <Pressable style={styles.primaryButton} onPress={handleLogin}>
              <ThemedText style={styles.primaryButtonText}>Login</ThemedText>
            </Pressable>

            {/* Create Account Button */}
            <Pressable
              style={styles.secondaryButton}
              onPress={handleCreateAccount}
            >
              <ThemedText style={styles.secondaryButtonText}>
                Create account
              </ThemedText>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    gap: 24,
  },
  header: {
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#11181C',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    overflow: 'hidden',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 20,
    paddingHorizontal: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    gap: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#11181C',
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#11181C',
    opacity: 0.85,
  },
  input: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: '#DCDCE1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#FAFAFA',
    color: '#11181C',
    fontSize: 15,
  },
  primaryButton: {
    minHeight: 50,
    borderRadius: 14,
    backgroundColor: '#0A7EA4',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryButton: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#0A7EA4',
    backgroundColor: 'rgba(10, 126, 164, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#0A7EA4',
    fontSize: 15,
    fontWeight: '600',
  },
});