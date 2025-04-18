import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import textStyles from '../styles/textStyles';
import { useLessons } from '@/store/lessonStore-persist';

interface AddTruthModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit?: (input: { lesson: string; anecdote: string }) => void; // Correct type!
}

export default function AddTruthModal({ visible, onClose, onSubmit }: AddTruthModalProps) {
  const [lesson, setLesson] = useState(''); // already correct
  const [anecdote, setAnecdote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { addLesson } = useLessons();

  const handleSave = async () => {
    console.log('[AddTruthModal handleSave] submitting:', { lesson, anecdote });
    if (!lesson.trim()) return;
    setSubmitting(true);
    addLesson({
      id: Date.now().toString(),
      lesson: lesson.trim(),
      anecdote: anecdote.trim(),
      isUserSubmitted: true,
    });
    setLesson('');
    setAnecdote('');
    setSubmitting(false);
    if (onSubmit) onSubmit({ lesson: lesson.trim(), anecdote: anecdote.trim() });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <View style={styles.modalContent}>
              <Text style={textStyles.title}>Add a Truth</Text>
              <TextInput
                style={[textStyles.title, styles.input]}
                value={lesson}
                onChangeText={setLesson}
                placeholder="Truth (required)"
                placeholderTextColor="#aaa"
                returnKeyType="done"
                blurOnSubmit={true}
              />
              <TextInput
                style={[textStyles.body, styles.input, styles.anecdoteInput]}
                value={anecdote}
                onChangeText={setAnecdote}
                placeholder="Anecdote (optional)"
                placeholderTextColor="#bbb"
                multiline
                textAlignVertical="top"
                returnKeyType="done"
                blurOnSubmit={true}
              />
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, !lesson.trim() && styles.buttonDisabled]}
                  onPress={handleSave}
                  disabled={!lesson.trim() || submitting}
                >
                  <Text style={textStyles.button}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.closeButton]} onPress={onClose}>
                  <Text style={textStyles.button}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  anecdoteInput: {
    minHeight: 60,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    backgroundColor: '#007aff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  buttonDisabled: {
    backgroundColor: '#aaa',
  },
  closeButton: {
    backgroundColor: '#eee',
  },
});
