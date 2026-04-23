/*
  Bottom sheet for the create post UI on the forum.

  Current implementation builds a frontend only ForumPost object and passes it
  up to the parent screen. Backend integration will replace that flow with
  a real create post API request
*/

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ForumCategory, ForumPost } from '@/types/forum';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

type CreatePostModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (post: ForumPost) => void;
};

// Current post categories used by the create post UI.
// This can be replaced with backend categories when that integration happens
const categories: ForumCategory[] = ['General', 'Events', 'Safety', 'Question'];

export function CreatePostModal({
  visible,
  onClose,
  onSubmit,
}: CreatePostModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<ForumCategory>('General');
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);

  const borderColor = useThemeColor(
    { light: '#d1d5db', dark: '#374151' },
    'text'
  );
  const mutedBg = useThemeColor(
    { light: '#f9fafb', dark: '#1f2937' },
    'background'
  );
  const accentColor = useThemeColor(
    { light: '#0a7ea4', dark: '#4FC3F7' },
    'tint'
  );
  const mutedTextColor = useThemeColor(
    { light: '#6b7280', dark: '#9ca3af' },
    'text'
  );
  const modalBg = useThemeColor(
    { light: '#ffffff', dark: '#11181C' },
    'background'
  );

  const resetForm = () => {
    setTitle('');
    setContent('');
    setCategory('General');
    setImageUri(undefined);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const pickFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        'Permission needed',
        'Please allow photo library access to choose an image.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      quality: 0.8,
      mediaTypes: ['images'],
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        'Permission needed',
        'Please allow camera access to take a photo.'
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 0.8,
      mediaTypes: ['images'],
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent) {
      Alert.alert(
        'Missing information',
        'Please enter both a title and post content.'
      );
      return;
    }

    const newPost: ForumPost = {
      id: Date.now().toString(),
      author: 'Resident User',
      title: trimmedTitle,
      content: trimmedContent,
      category,
      createdAt: 'Just now',
      imageUri,
      upvotes: 0,
      downvotes: 0,
      userVote: null,
    };

    onSubmit(newPost);
    resetForm();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ThemedView style={[styles.modalCard, { backgroundColor: modalBg }]}>
            <ThemedText type="subtitle">Create Post</ThemedText>
            <ThemedText style={[styles.helperText, { color: mutedTextColor }]}>
              Share an update, event, question, or safety concern with the
              community.
            </ThemedText>

            <ThemedText style={styles.label}>Category</ThemedText>
            <View style={styles.categoryRow}>
              {categories.map((item) => {
                const isSelected = category === item;

                return (
                  <Pressable
                    key={item}
                    style={[
                      styles.categoryOption,
                      {
                        borderColor: isSelected ? accentColor : borderColor,
                        backgroundColor: isSelected ? accentColor : 'transparent',
                      },
                    ]}
                    onPress={() => setCategory(item)}
                  >
                    <ThemedText
                      style={[
                        styles.categoryOptionText,
                        isSelected && styles.categoryOptionTextSelected,
                      ]}
                    >
                      {item}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </View>

            <ThemedText style={styles.label}>Title</ThemedText>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Enter post title"
              placeholderTextColor={mutedTextColor}
              style={[
                styles.input,
                {
                  borderColor,
                  backgroundColor: mutedBg,
                  color: Platform.OS === 'android' ? '#000000' : undefined,
                },
              ]}
              maxLength={80}
            />

            <ThemedText style={styles.label}>Post</ThemedText>
            <TextInput
              value={content}
              onChangeText={setContent}
              placeholder="What would you like to share?"
              placeholderTextColor={mutedTextColor}
              style={[
                styles.input,
                styles.textArea,
                {
                  borderColor,
                  backgroundColor: mutedBg,
                  color: Platform.OS === 'android' ? '#000000' : undefined,
                },
              ]}
              multiline
              textAlignVertical="top"
              maxLength={300}
            />

            <ThemedText style={styles.label}>Photo (optional)</ThemedText>
            <View style={styles.photoActions}>
              <Pressable
                style={[styles.photoButton, { borderColor }]}
                onPress={pickFromGallery}
              >
                <ThemedText style={[styles.photoButtonText, { color: accentColor }]}>
                  Choose from Gallery
                </ThemedText>
              </Pressable>

              <Pressable
                style={[styles.photoButton, { borderColor }]}
                onPress={takePhoto}
              >
                <ThemedText style={[styles.photoButtonText, { color: accentColor }]}>
                  Take Photo
                </ThemedText>
              </Pressable>
            </View>

            {imageUri ? (
              <View style={styles.previewWrapper}>
                <Image source={{ uri: imageUri }} style={styles.previewImage} />
                <Pressable
                  style={[styles.removeImageButton, { borderColor }]}
                  onPress={() => setImageUri(undefined)}
                >
                  <ThemedText style={[styles.removeImageText, { color: accentColor }]}>
                    Remove Photo
                  </ThemedText>
                </Pressable>
              </View>
            ) : null}

            <View style={styles.actions}>
              <Pressable
                style={[styles.actionButton, styles.cancelButton, { borderColor }]}
                onPress={handleClose}
              >
                <ThemedText style={styles.cancelText}>Cancel</ThemedText>
              </Pressable>

              <Pressable
                style={[styles.actionButton, { backgroundColor: accentColor }]}
                onPress={handleSubmit}
              >
                <ThemedText style={styles.submitText}>Post</ThemedText>
              </Pressable>
            </View>
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  modalCard: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 18,
    paddingBottom: 28,
  },
  helperText: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
    marginBottom: 6,
  },
  label: {
    marginTop: 14,
    marginBottom: 8,
    fontWeight: '700',
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryOption: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  categoryOptionText: {
    fontSize: 13,
  },
  categoryOptionTextSelected: {
    color: '#ffffff',
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
  },
  textArea: {
    minHeight: 110,
  },
  photoActions: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  photoButton: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  photoButtonText: {
    fontWeight: '600',
  },
  previewWrapper: {
    marginTop: 12,
    gap: 10,
  },
  previewImage: {
    width: '100%',
    height: 180,
    borderRadius: 14,
  },
  removeImageButton: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  removeImageText: {
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 18,
  },
  actionButton: {
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  cancelButton: {
    borderWidth: 1,
  },
  cancelText: {
    fontWeight: '700',
  },
  submitText: {
    color: '#ffffff',
    fontWeight: '700',
  },
});