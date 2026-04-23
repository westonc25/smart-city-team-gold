import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfilePostHistory } from '@/components/profile/ProfilePostHistory';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import {
  mockUserPosts,
  mockUserProfile,
  ProfileFormData,
} from '@/data/profileMockData';
import { useNotifications } from '@/context/NotificationContext';

export default function ProfileScreen() {
  const { permissionGranted, requestPermission } = useNotifications();
  const insets = useSafeAreaInsets();

  const [isLoading, setIsLoading] = useState(true);

  // Frontend only local state for profile management.
  // Backend team can replace this with fetched user profile data
  const [formData, setFormData] = useState<ProfileFormData>(mockUserProfile);

  // Stores the last saved profile state so Save/Cancel works
  // Backend integration can update this after a successful profile save request
  const [savedData, setSavedData] = useState<ProfileFormData>(mockUserProfile);

  // Frontend placeholder for authenticated user's post history.
  // Replace with real backend fetched post history later.
  const [userPosts] = useState(mockUserPosts);

  useEffect(() => {
    // Simulated loading state
    // Replace with actual profile fetch request when backend is ready.
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 900);

    return () => clearTimeout(timer);
  }, []);

  const hasUnsavedChanges = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(savedData);
  }, [formData, savedData]);

  const handleFieldChange = <K extends keyof ProfileFormData>(
    field: K,
    value: ProfileFormData[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleChangePhoto = () => {
    // Replace this placeholder with image picker & upload functionality.
    // This should eventually update the user's stored profile image.
    Alert.alert(
      'Profile Picture',
      'Profile picture upload will be connected when backend/media support is ready.'
    );
  };

  const handleSaveProfile = () => {
    // Replace this local save simulation with a real one
    setSavedData(formData);

    Alert.alert(
      'Profile Updated',
      'Your profile changes have been saved locally for now.'
    );
  };

  const handleCancelChanges = () => {
    setFormData(savedData);
  };

  const handleChangePassword = () => {
    // Replace this placeholder with backend logic
    Alert.alert(
      'Password Update',
      'Password update flow will be connected to backend authentication later.'
    );
  };

  if (isLoading) {
    return (
      <ThemedView style={[styles.loadingContainer, { paddingTop: insets.top }]}>
        <LoadingSpinner size="large" />
        <ThemedText style={styles.loadingText}>Loading profile...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: insets.top + 12,
              paddingBottom: Math.max(insets.bottom + 32, 32),
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <ProfileHeader onChangePhoto={handleChangePhoto} />

          <View style={styles.sectionCard}>
            <ThemedText style={styles.sectionTitle}>Account Information</ThemedText>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Name</ThemedText>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => handleFieldChange('name', text)}
                placeholder="Enter your name"
                placeholderTextColor="#8E8E93"
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Email</ThemedText>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(text) => handleFieldChange('email', text)}
                placeholder="Enter your email"
                placeholderTextColor="#8E8E93"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.sectionCard}>
            <ThemedText style={styles.sectionTitle}>Security</ThemedText>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Password</ThemedText>
              <TextInput
                style={styles.input}
                value={formData.password}
                onChangeText={(text) => handleFieldChange('password', text)}
                placeholder="Enter your password"
                placeholderTextColor="#8E8E93"
                secureTextEntry
              />
            </View>

            <Pressable style={styles.secondaryButton} onPress={handleChangePassword}>
              <ThemedText style={styles.secondaryButtonText}>
                Update Password
              </ThemedText>
            </Pressable>
          </View>

          <View style={styles.sectionCard}>
            <ThemedText style={styles.sectionTitle}>Preferences</ThemedText>

            <View style={styles.preferenceRow}>
              <View style={styles.preferenceTextContainer}>
                <ThemedText style={styles.preferenceTitle}>Notifications</ThemedText>
                <ThemedText style={styles.preferenceSubtitle}>
                  {permissionGranted
                    ? 'Notifications are enabled. You will receive community alerts.'
                    : 'Enable notifications to receive community alerts and replies.'}
                </ThemedText>
              </View>

              <Switch
                value={permissionGranted}
                onValueChange={async (value) => {
                  if (value) {
                    // Request OS permission — dialog appears on first tap
                    await requestPermission();
                  } else {
                    // Can't revoke system permission programmatically; guide user
                    Alert.alert(
                      'Disable Notifications',
                      'To turn off notifications, go to your device Settings and disable them for Smart City.',
                      [{ text: 'OK' }]
                    );
                  }
                }}
                trackColor={{ false: '#D1D1D6', true: '#7CC6DA' }}
                thumbColor={permissionGranted ? '#0A7EA4' : '#F4F4F5'}
              />
            </View>
          </View>

          <View style={styles.actionRow}>
            <Pressable
              style={[
                styles.primaryButton,
                !hasUnsavedChanges && styles.primaryButtonDisabled,
              ]}
              onPress={handleSaveProfile}
              disabled={!hasUnsavedChanges}
            >
              <ThemedText style={styles.primaryButtonText}>Save Changes</ThemedText>
            </Pressable>

            <Pressable
              style={[
                styles.cancelButton,
                !hasUnsavedChanges && styles.cancelButtonDisabled,
              ]}
              onPress={handleCancelChanges}
              disabled={!hasUnsavedChanges}
            >
              <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
            </Pressable>
          </View>

          <ProfilePostHistory posts={userPosts} />
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    opacity: 0.7,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 16,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    gap: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#11181C',
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.8,
    color: '#11181C',
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#DCDCE1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#FAFAFA',
    color: '#11181C',
    fontSize: 15,
  },
  preferenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  preferenceTextContainer: {
    flex: 1,
    gap: 4,
  },
  preferenceTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#11181C',
  },
  preferenceSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.65,
    color: '#11181C',
  },
  actionRow: {
    gap: 10,
  },
  primaryButton: {
    minHeight: 50,
    borderRadius: 14,
    backgroundColor: '#0A7EA4',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryButton: {
    minHeight: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#0A7EA4',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    backgroundColor: 'rgba(10, 126, 164, 0.05)',
    alignSelf: 'center',
  },
  secondaryButtonText: {
    color: '#0A7EA4',
    fontSize: 14,
    fontWeight: '600',
  },
  cancelButton: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D1D1D6',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  cancelButtonDisabled: {
    opacity: 0.5,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#11181C',
  },
});