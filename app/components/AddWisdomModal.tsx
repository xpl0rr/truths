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
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import textStyles from '../styles/textStyles';

interface AddWisdomModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit?: (input: { lesson: string; anecdote: string }) => void;
}

export default function AddWisdomModal({ visible, onClose, onSubmit }: AddWisdomModalProps) {
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
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={30} // Adjusted to 30, may need further tuning
        >
          {/* This inner View is KAV's direct child and helps manage layout */}
          <ScrollView // NEW outer ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ /* flexGrow: 1 removed */ }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={{ padding: 16 }}> {/* Inner content wrapper, flex:1 removed, padding retained */}
            <TextInput
              style={styles.titleInput}
              value={lesson}
              onChangeText={setLesson}
              placeholder="Wisdom title (required)"
              placeholderTextColor="#aaa"
              multiline
              numberOfLines={2}
            />
            <TextInput
              style={styles.anecdoteInput} // This style has flex:1 and minHeight
              value={anecdote}
              onChangeText={setAnecdote}
              placeholder="Anecdote (optional)"
              placeholderTextColor="#aaa"
              multiline
              textAlignVertical="top"
            />
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
            </View> {/* Closes buttonRow */}
          </View> {/* Closes the View with style={{ padding: 16 }} */}
        </ScrollView> {/* Closing NEW outer ScrollView */}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  // inputs: { flex: 1, padding: 16 }, // Removed as its role is absorbed by KAV's inner view and ScrollView

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
  // anecdoteContainer: { /* flex: 1 removed */ }, // Style removed as component is removed
  anecdoteInput: {
    // flex: 1, // Removed: Let TextInput size naturally with content and minHeight
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fafafa',
    minHeight: 100, // Keep for a decent initial size
    maxHeight: 200, // Added to make the anecdote field scroll internally
    // textAlignVertical: 'top' is set on the component itself, which is good
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
});
