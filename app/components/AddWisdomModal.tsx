import React, { useState, useEffect } from 'react';
import {
  Modal,
  SafeAreaView,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

interface AddWisdomModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit?: (input: { lesson: string; anecdote: string }) => void;
}

export default function AddWisdomModal({ visible, onClose, onSubmit }: AddWisdomModalProps) {
  const [lesson, setLesson] = useState('');
  const [anecdote, setAnecdote] = useState('');
  const [titleHeight, setTitleHeight] = useState<number | undefined>(undefined);

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
        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }} // KASV content can grow
          keyboardShouldPersistTaps="handled"
          enableOnAndroid={true}
          extraHeight={75} // Added for potential layout calculation issues
          extraScrollHeight={Platform.OS === 'ios' ? 50 : 0}
          enableAutomaticScroll={true}
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contentWrapper}> {/* Wrapper for all content with padding and flex */} 
            <TextInput
              style={[styles.titleInput, titleHeight ? { height: titleHeight } : {}]}
              value={lesson}
              onChangeText={setLesson}
              placeholder="Wisdom title (required)"
              placeholderTextColor="#aaa"
              multiline
              onContentSizeChange={(e) => setTitleHeight(e.nativeEvent.contentSize.height)}
            />
            <TextInput
              style={styles.anecdoteInput} // This style should have flex:1
              value={anecdote}
              onChangeText={setAnecdote}
              placeholder="Anecdote (optional)"
              placeholderTextColor="#aaa"
              multiline
              textAlignVertical="top"
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity onPress={onClose} style={styles.buttonStyleDebug}>
                <Text style={styles.buttonTextDebug}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave} disabled={!lesson.trim()} style={styles.buttonStyleDebug}>
                <Text style={styles.buttonTextDebug}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  contentWrapper: { // New style for the main content view inside KASV
    flex: 1,
    padding: 16,
  },

  titleInput: {
    // height: 64, // Removed fixed height for dynamic sizing
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16, // Match anecdote/standard text
    fontWeight: 'normal',
    color: '#333',
    backgroundColor: '#fafafa',
  },
  // anecdoteContainer: { /* flex: 1 removed */ }, // Style removed as component is removed
  anecdoteInput: {
    flex: 1, // Allow anecdote to fill available space
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fafafa',
    minHeight: 100, // Keep for a decent initial size
    // maxHeight: 200, // Removed to allow full expansion, ScrollView handles overflow
    textAlignVertical: 'top', // Ensure text starts from the top
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  buttonStyleDebug: { // Temporary button style
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  buttonTextDebug: { // Temporary button text style
    fontSize: 16,
    color: '#333',
  },
});
