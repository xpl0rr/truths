import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, TouchableWithoutFeedback, Keyboard, SafeAreaView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import textStyles from '../styles/textStyles';
import type { Lesson } from '../../src/models/Lesson';

interface Props {
  visible: boolean;
  lesson: Lesson;
  onSave: (lesson: string, anecdote: string) => void;
  onClose: () => void;
}

export default function FullScreenEditLessonMain({ visible, lesson, onSave, onClose }: Props) {
  const [lessonText, setLessonText] = useState(lesson.lesson || '');
  const [anecdote, setAnecdote] = useState(lesson.anecdote || '');
  // Sync local state when the lesson prop changes
  useEffect(() => {
    setLessonText(lesson.lesson || '');
    setAnecdote(lesson.anecdote || '');
  }, [lesson]);
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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <SafeAreaView style={[styles.fullScreenContainer, { paddingTop: insets.top }]}>
          <KeyboardAwareScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }} // Restored
            keyboardShouldPersistTaps="handled"
            enableOnAndroid={true}
            extraScrollHeight={Platform.OS === 'ios' ? 50 : 0} // Moderate extra scroll height
            enableAutomaticScroll={true}
            showsVerticalScrollIndicator={true} // For debugging
            keyboardDismissMode="on-drag" // Changed to 'on-drag'
            automaticallyAdjustContentInsets={false} // iOS only: prevent conflict with SafeAreaView
          >
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
              style={[textStyles.body, styles.anecdoteInput]} // Ensure styles.anecdoteInput has NO flex:1 and NO maxHeight
              value={anecdote}
              onChangeText={setAnecdote}
              placeholder="The anecdote is not optional --- EDITING BANNER HERE --- "
              placeholderTextColor="#aaa"
              multiline
              textAlignVertical="top"
              returnKeyType="done"
              blurOnSubmit={true} // Should work
              onSubmitEditing={Keyboard.dismiss} // Explicit dismiss on submit
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
          </KeyboardAwareScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    // paddingTop: 64, // Removed, will use insets.top dynamically
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
    // flex: 1, // Removed; let content and minHeight dictate size
    // Ensure NO maxHeight here
    marginBottom: 6,
    backgroundColor: '#fafafa',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ececec',
    minHeight: 80,
    // maxHeight: 300, // Removed to allow TextInput to grow and rely on outer ScrollView
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
