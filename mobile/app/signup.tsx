import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
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

// Kept from Josh's code to validate email
const isStrictEmail = (email: string) => {
  if (!email) {
    return false;
  }

  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[A-Za-z]{2,}$/;

  if (!emailRegex.test(email)) {
    return false;
  }

  const [local, domain] = email.split('@');

  if (email.includes('..')) {
    return false;
  }

  if (local.startsWith('.') || local.endsWith('.')) {
    return false;
  }

  if (domain.startsWith('-') || domain.endsWith('-')) {
    return false;
  }

  return true;
};

export default function Signup() {
  const insets = useSafeAreaInsets();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = () => {
    if (!firstName.trim()) {
      Alert.alert('Missing First Name', 'Enter your first name');
      return;
    }

    if (!lastName.trim()) {
      Alert.alert('Missing Last Name', 'Enter your last name');
      return;
    }

    if (!isStrictEmail(email)) {
      Alert.alert('Invalid Email', 'Enter a valid email');
      return;
    }

    if (!password.trim()) {
      Alert.alert('Missing Password', 'Enter a password');
      return;
    }

    // Replace this with real account creation logic.
    // Send firstName, lastName, email, and password to backend.
    router.replace('/(tabs)/map');
  };

  const handleGoToLogin = () => {
    router.push('/login');
  };

  return (
    <ThemedView style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: insets.top + 24,
              paddingBottom: Math.max(insets.bottom + 32, 32),
            },
          ]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
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
              Create your account to start exploring your city and community.
            </ThemedText>
          </View>

          <View style={styles.card}>
            <ThemedText style={styles.sectionTitle}>Create Account</ThemedText>

            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfInput]}>
                <ThemedText style={styles.label}>First Name</ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="Enter first name"
                  placeholderTextColor="#8E8E93"
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                  autoCorrect={false}
                  returnKeyType="next"
                />
              </View>

              <View style={[styles.inputGroup, styles.halfInput]}>
                <ThemedText style={styles.label}>Last Name</ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="Enter last name"
                  placeholderTextColor="#8E8E93"
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize="words"
                  autoCorrect={false}
                  returnKeyType="next"
                />
              </View>
            </View>

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
                returnKeyType="next"
              />
            </View>

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
                returnKeyType="done"
              />
            </View>

            <Pressable style={styles.primaryButton} onPress={handleSignup}>
              <ThemedText style={styles.primaryButtonText}>
                Create Account
              </ThemedText>
            </Pressable>

            <Pressable style={styles.secondaryButton} onPress={handleGoToLogin}>
              <ThemedText style={styles.secondaryButtonText}>
                Back to Login
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
    borderColor: 'rgba(255, 215, 0, 0.35)',
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
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
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