import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, Alert, ScrollView, KeyboardAvoidingView, Platform, Keyboard, Modal } from 'react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

import { ThemedText } from './ThemedText';
import { Colors } from '@/constants/Colors';

interface AddLessonFormProps {
  onSubmit: (lesson: string, anecdote: string) => void;
  adminMode?: boolean;
}

export function AddLessonForm({ onSubmit, adminMode = false }: AddLessonFormProps) {
  const [lesson, setLesson] = useState('');
  const [anecdote, setAnecdote] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);

  const validateInputs = () => {
    if (!lesson.trim()) {
      Alert.alert('Error', 'Please enter a lesson title');
      return false;
    }

    if (!anecdote.trim()) {
      Alert.alert('Error', 'Please enter an anecdote');
      return false;
    }

    if (anecdote.trim().length < 10) {
      Alert.alert('Error', 'Anecdote is too short (minimum 10 characters)');
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateInputs()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    try {
      // Log for debugging
      console.log('Submitting lesson:', lesson.trim());
      console.log('Anecdote content:', anecdote);
      console.log('Anecdote length:', anecdote.length);

      // Call the submit handler with the validated inputs
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onSubmit(lesson.trim(), anecdote);

      // Clear the form
      setLesson('');
      setAnecdote('');
      setIsFormVisible(false);
    } catch (error) {
      console.error('Error submitting lesson:', error);
      Alert.alert('Error', 'Failed to submit lesson. Please try again.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const toggleForm = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsFormVisible(!isFormVisible);
  };

  const inputBgColor = 'rgba(255, 255, 255, 0.7)';
  const placeholderColor = 'rgba(0, 0, 0, 0.5)';
  const textColor = '#000';

  const buttonColor = adminMode ? '#4CAF50' : '#4A90E2';

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: buttonColor }]}
        onPress={toggleForm}
        activeOpacity={0.8}>
        <ThemedText style={styles.addButtonText}>
          {adminMode ? 'Add Official Lesson' : 'Add New Lesson'}
        </ThemedText>
      </TouchableOpacity>

      <Modal
        visible={isFormVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={toggleForm}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => {
              Keyboard.dismiss();
            }}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.keyboardView}>
              <View style={styles.formWrapper}>
                <BlurView
                  intensity={90}
                  tint="light"
                  style={styles.formContainer}>
                  <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={true}
                    keyboardShouldPersistTaps="handled">
                    <ThemedText type="subtitle" style={styles.formTitle}>
                      {adminMode ? 'Add to Gramma Said' : 'Share Your Wisdom'}
                    </ThemedText>

                    <TextInput
                      placeholder="Life lesson (e.g. 'Patience is a virtue')"
                      placeholderTextColor={placeholderColor}
                      value={lesson}
                      onChangeText={setLesson}
                      style={[styles.input, { backgroundColor: inputBgColor, color: textColor }]}
                      maxLength={100}
                    />

                    <TextInput
                      placeholder="Tell a short anecdote about this lesson..."
                      placeholderTextColor={placeholderColor}
                      value={anecdote}
                      onChangeText={setAnecdote}
                      style={[styles.input, styles.textArea, { backgroundColor: inputBgColor, color: textColor }]}
                      multiline={true}
                      numberOfLines={8}
                      maxLength={1000}
                      textAlignVertical="top"
                    />

                    <View style={styles.buttonRow}>
                      <TouchableOpacity
                        style={[styles.button, styles.cancelButton]}
                        onPress={toggleForm}>
                        <ThemedText style={styles.buttonText}>Cancel</ThemedText>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.button, styles.submitButton, { backgroundColor: buttonColor }]}
                        onPress={handleSubmit}>
                        <ThemedText style={styles.submitButtonText}>Submit</ThemedText>
                      </TouchableOpacity>
                    </View>

                    {/* Add padding at bottom to ensure scrolling clears the keyboard */}
                    <View style={styles.bottomPadding} />
                  </ScrollView>
                </BlurView>
              </View>
            </KeyboardAvoidingView>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 0,
    padding: 0,
    width: '100%',
  },
  addButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 8,
    borderRadius: 0,
    alignItems: 'center',
    width: '100%',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'normal',
    fontSize: 14,
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  formWrapper: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
  },
  formContainer: {
    width: '100%',
    height: '100%',
  },
  scrollContent: {
    padding: 8,
    gap: 8,
  },
  formTitle: {
    textAlign: 'center',
    marginBottom: 4,
    fontWeight: 'normal',
  },
  input: {
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 14,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
    paddingTop: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  button: {
    flex: 1,
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(150, 150, 150, 0.2)',
  },
  submitButton: {
    backgroundColor: '#4A90E2',
  },
  buttonText: {
    fontWeight: 'normal',
  },
  submitButtonText: {
    fontWeight: 'normal',
    color: 'white',
  },
  bottomPadding: {
    height: 100, // Extra padding at bottom to ensure scroll clears keyboard
  },
  keyboardView: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 