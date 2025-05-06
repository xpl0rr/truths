import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';

import type { Lesson } from '../src/models/Lesson';

type Props = {
  visible: boolean;
  lesson: Lesson;
  onSave: (title: string, anecdote: string) => void;
  onClose: () => void;
};

export default function FullScreenEditLesson({
  visible,
  lesson,
  onSave,
  onClose,
}: Props) {
  const [title, setTitle] = useState(lesson.lesson || '');
  const [anecdote, setAnecdote] = useState(lesson.anecdote || '');

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <View style={styles.container}>
        <TextInput
          style={styles.title}
          value={title}
          onChangeText={setTitle}
          placeholder="Title"
        />
        <TextInput
          style={styles.anecdote}
          value={anecdote}
          onChangeText={setAnecdote}
          placeholder="Anecdote"
          multiline
        />
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={() => onSave(title, anecdote)}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.closeButton]} onPress={onClose}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    width: '100%',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
  },
  anecdote: {
    fontSize: 16,
    width: '100%',
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 12,
    marginBottom: 32,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    backgroundColor: '#333',
    padding: 14,
    borderRadius: 8,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: '#aaa',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
