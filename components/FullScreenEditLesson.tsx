import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Keyboard,
  SafeAreaView, // Added
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'; // Added

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
}: Props): JSX.Element {
  const [title, setTitle] = useState(lesson.lesson || '');
  const [anecdote, setAnecdote] = useState(lesson.anecdote || '');
  const [titleHeight, setTitleHeight] = useState<number | undefined>(undefined);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen" onRequestClose={onClose}>
      <SafeAreaView style={styles.safeAreaContainer}>
        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContentContainer} // Use a specific style for content
          keyboardShouldPersistTaps="handled"
          enableOnAndroid={true}
          extraScrollHeight={Platform.OS === 'ios' ? 50 : 0}
          enableAutomaticScroll={true}
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          {/* Original content starts here, but styles.container might need adjustment */}
          {/* We'll use a new inner container for padding if styles.container had flex properties */}
          <View style={styles.innerContainer}>
        <TextInput
          style={[styles.title, titleHeight ? { height: titleHeight } : {}]}
          value={title}
          onChangeText={setTitle}
          placeholder="Title"
          multiline
          onContentSizeChange={(e) => setTitleHeight(e.nativeEvent.contentSize.height)}
        />
        <TextInput
          style={styles.anecdote}
          value={anecdote}
          onChangeText={setAnecdote}
          placeholder="Anecdote"
          multiline
          returnKeyType="done"
          blurOnSubmit={true}
          onSubmitEditing={Keyboard.dismiss}
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
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: '#fff', // Or your modal's background color
  },
  scrollContentContainer: {
    flexGrow: 1, // Important for KASV to allow content to expand
    // justifyContent: 'center', // Remove if content should start at top
  },
  innerContainer: { // New container for original content padding and alignment
    padding: 24,
    flex: 1, // Re-add flex: 1 to allow inner content to expand
    // alignItems: 'center', // Keep if needed, or manage alignment within
    // justifyContent: 'center', // Remove if content should start at top
  },
  // Original styles.container might be redundant or need to be merged into innerContainer
  // container: {
  //   flex: 1,
  //   backgroundColor: '#fff',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   padding: 24,
  // },

  title: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#333',
    marginBottom: 16,
    width: '100%',
    // Height is now managed dynamically, so paddingVertical and lineHeight are removed to avoid conflicts.
  },
  anecdote: {
    flex: 1, // Allow anecdote to fill available space
    fontSize: 16,
    lineHeight: 24, // Match lesson view screen
    color: '#333', // Match lesson view screen
    width: '100%',
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
    backgroundColor: '#f5f5f5', // Standard background
    paddingVertical: 8,      // Standard padding
    paddingHorizontal: 12,   // Standard padding
    borderRadius: 8,         // Standard radius
    marginHorizontal: 8,
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: '#e0e0e0', // Slightly different gray for secondary action, or use #f5f5f5
  },
  buttonText: {
    color: '#000',          // Standard text color
    fontWeight: 'normal',    // Standard font weight
    fontSize: 16,
  },
});
