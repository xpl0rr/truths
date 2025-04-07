import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
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

  const handleSubmit = () => {
    if (lesson.trim() && anecdote.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onSubmit(lesson, anecdote);
      setLesson('');
      setAnecdote('');
      setIsFormVisible(false);
    } else {
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

  const buttonColor = adminMode ? '#F44336' : '#4A90E2';

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
            contextMenuHidden={false}
          />

          <TextInput
            placeholder="Tell a short anecdote about this lesson..."
            placeholderTextColor={placeholderColor}
            value={anecdote}
            onChangeText={setAnecdote}
            style={[styles.input, styles.textArea, { backgroundColor: inputBgColor, color: textColor }]}
            multiline
            maxLength={500}
            textAlignVertical="top"
            autoCapitalize="sentences"
            contextMenuHidden={false}
            editable={true}
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
    marginVertical: 8,
  },
  addButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
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
    minHeight: 80,
    textAlignVertical: 'top',
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