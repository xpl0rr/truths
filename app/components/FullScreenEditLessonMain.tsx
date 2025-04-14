import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import textStyles from '../styles/textStyles';
import type { Lesson } from '@/store/lessonStore-persist';

interface Props {
  visible: boolean;
  lesson: Lesson;
  onSave: (title: string, anecdote: string) => void;
  onClose: () => void;
}

export default function FullScreenEditLessonMain({ visible, lesson, onSave, onClose }: Props) {
  const [title, setTitle] = useState(lesson.title || '');
  const [anecdote, setAnecdote] = useState(lesson.anecdote || '');

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={6}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.fullScreenContainer}>
            <TextInput
              style={[textStyles.title, styles.titleInput]}
              value={title}
              onChangeText={setTitle}
              placeholder="Title"
              placeholderTextColor="#aaa"
              returnKeyType="done"
              blurOnSubmit={true}
            />
            <TextInput
              style={[textStyles.body, styles.anecdoteInput]}
              value={anecdote}
              onChangeText={setAnecdote}
              placeholder="Anecdote"
              placeholderTextColor="#bbb"
              multiline
              textAlignVertical="top"
              returnKeyType="done"
              blurOnSubmit={true}
            />
            <View style={styles.buttonRowContainer}>
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.button} onPress={() => onSave(title, anecdote)}>
                  <Text style={textStyles.button}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.closeButton]} onPress={onClose}>
                  <Text style={textStyles.button}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 0,
  },
  titleInput: {
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  anecdoteInput: {
    flex: 1,
    marginBottom: 6,
    backgroundColor: '#fafafa',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ececec',
    minHeight: 80,
    maxHeight: 300,
  },
  buttonRowContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 6,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  button: {
    flex: 1,
    backgroundColor: '#222',
    paddingVertical: 16,
    marginHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: '#bbb',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
})
