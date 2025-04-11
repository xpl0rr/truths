import React, { useState, useRef } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, Alert, ScrollView, Text } from 'react-native';
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
  const anecdoteInputRef = useRef<TextInput>(null);

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

  if (!isFormVisible) {
    return (
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: buttonColor }]}
        onPress={toggleForm}
        activeOpacity={0.8}>
        <ThemedText style={styles.addButtonText}>
          {adminMode ? 'Add Official Lesson' : 'Add New Lesson'}
        </ThemedText>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <BlurView intensity={90} tint="light" style={styles.formContainer}>
        <View style={styles.formHeader}>
          <ThemedText type="subtitle" style={styles.formTitle}>
            {adminMode ? 'Add to Gramma Said' : 'Share Your Wisdom'}
          </ThemedText>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={toggleForm}
          >
            <ThemedText style={styles.closeButtonText}>✕</ThemedText>
          </TouchableOpacity>
        </View>

        <TextInput
          placeholder="Life lesson (e.g. 'Patience is a virtue')"
          placeholderTextColor={placeholderColor}
          value={lesson}
          onChangeText={setLesson}
          style={[styles.input, { backgroundColor: inputBgColor, color: textColor }]}
          maxLength={100}
          returnKeyType="next"
          onSubmitEditing={() => anecdoteInputRef.current?.focus()}
        />

        <TextInput
          ref={anecdoteInputRef}
          placeholder="Tell a short anecdote about this lesson..."
          placeholderTextColor={placeholderColor}
          value={anecdote}
          onChangeText={setAnecdote}
          style={[styles.textArea, { backgroundColor: inputBgColor, color: textColor }]}
          multiline={true}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 0,
    padding: 0,
    width: '100%',
  },
  addButton: {
    backgroundColor: '#FF0000',
    paddingVertical: 8,
    borderRadius: 0,
    alignItems: 'center',
    width: '100%',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  formContainer: {
    flex: 1,
    width: '100%',
    padding: 12,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    position: 'relative',
  },
  formTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    opacity: 0.7,
  },
  input: {
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  textArea: {
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    minHeight: 200,
    maxHeight: 400,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(150, 150, 150, 0.2)',
  },
  submitButton: {
    backgroundColor: '#FF0000',
  },
  buttonText: {
    fontWeight: 'bold',
  },
  submitButtonText: {
    fontWeight: 'bold',
    color: 'white',
  },
}); 