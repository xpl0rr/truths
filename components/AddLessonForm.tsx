import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, Alert } from 'react-native';
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
      {!isFormVisible ? (
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: buttonColor }]}
          onPress={toggleForm}
          activeOpacity={0.8}>
          <ThemedText style={styles.addButtonText}>
            {adminMode ? 'Add Official Lesson' : 'Add New Lesson'}
          </ThemedText>
        </TouchableOpacity>
      ) : (
        <BlurView
          intensity={90}
          tint="light"
          style={styles.formContainer}>
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
        </BlurView>
      )}
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
  formContainer: {
    borderRadius: 8,
    padding: 8,
    gap: 8,
    width: '100%',
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
}); 