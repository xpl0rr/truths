import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, SafeAreaView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import textStyles from '../styles/textStyles';
import type { Lesson } from '@/store/lessonStore-persist';

interface Props {
  visible: boolean;
  lesson: Lesson;
  onSave: (lesson: string, anecdote: string) => void;
  onClose: () => void;
}

export default function FullScreenEditLessonMain({ visible, lesson, onSave, onClose }: Props) {
  const [lessonText, setLessonText] = useState(lesson.lesson || '');
  const [anecdote, setAnecdote] = useState(lesson.anecdote || '');
  const insets = useSafeAreaInsets();
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  React.useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => setKeyboardOpen(true));
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setKeyboardOpen(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

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
        keyboardVerticalOffset={0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <SafeAreaView style={styles.fullScreenContainer}>
            <TextInput
              style={[styles.titleInput, { minHeight: 44 }]}
              value={lessonText}
              onChangeText={setLessonText}
              placeholder="Lesson title"
              placeholderTextColor="#aaa"
              autoFocus
              returnKeyType="next"
              multiline
              numberOfLines={2}
              textAlignVertical="top"
            />
            <TextInput
              style={[textStyles.body, styles.anecdoteInput]}
              value={anecdote}
              onChangeText={setAnecdote}
              placeholder="The anecdote is not optional"
              placeholderTextColor="#aaa"
              multiline
              textAlignVertical="top"
              returnKeyType="done"
              blurOnSubmit={true}
            />
            <View style={[styles.buttonRowContainer, { paddingBottom: keyboardOpen ? 0 : insets.bottom }]}> 
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.button} onPress={() => onSave(lessonText, anecdote)}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.closeButton]} onPress={onClose}>
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
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
    paddingTop: 64, // Increased padding to avoid camera island
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
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: 'transparent',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    height: 40,
    backgroundColor: '#222',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 0,
    paddingHorizontal: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  closeButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#bbb',
  },
  buttonText: {
    color: '#222',
    fontSize: 16,
    fontWeight: 'normal',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'normal',
  },
})
