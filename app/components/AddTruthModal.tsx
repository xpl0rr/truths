import React, { useState, useEffect } from 'react';
import {
  Modal,
  SafeAreaView,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import textStyles from '../styles/textStyles';

interface AddTruthModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit?: (input: { lesson: string; anecdote: string }) => void;
}

export default function AddTruthModal({ visible, onClose, onSubmit }: AddTruthModalProps) {
  const [lesson, setLesson] = useState('');
  const [anecdote, setAnecdote] = useState('');

  useEffect(() => {
    if (!visible) {
      setLesson('');
      setAnecdote('');
    }
  }, [visible]);

  const handleSave = () => {
    if (!lesson.trim()) return;
    onSubmit?.({ lesson: lesson.trim(), anecdote: anecdote.trim() });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.inputs}>
            <TextInput
              style={styles.titleInput}
              value={lesson}
              onChangeText={setLesson}
              placeholder="Wisdom title (required)"
              placeholderTextColor="#aaa"
              multiline
              numberOfLines={2}
            />
            <ScrollView style={styles.anecdoteContainer}>
              <TextInput
                style={styles.anecdoteInput}
                value={anecdote}
                onChangeText={setAnecdote}
                placeholder="Anecdote (optional)"
                placeholderTextColor="#aaa"
                multiline
                textAlignVertical="top"
              />
            </ScrollView>
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle-outline" size={36} color="#777" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} disabled={!lesson.trim()}>
              <Ionicons
                name="checkmark-circle-outline"
                size={36}
                color={lesson.trim() ? '#007aff' : '#ccc'}
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  inputs: { flex: 1, padding: 16 },
  titleInput: {
    height: 64,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 18,
    backgroundColor: '#fafafa',
  },
  anecdoteContainer: { flex: 1 },
  anecdoteInput: {
    flex: 1,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fafafa',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
});
