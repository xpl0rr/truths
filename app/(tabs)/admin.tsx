import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { useLessons } from '@/store/lessonStore';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AdminScreen() {
  const {
    getAllLessons,
    approveLesson,
    updateLessonText,
    deleteLesson,
    addLesson,
  } = useLessons();

  const allLessons = getAllLessons().filter((l) => !l.approved);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState('');
  const [newLesson, setNewLesson] = useState('');

  const startEditing = (lessonId: string, currentText: string) => {
    setEditingId(lessonId);
    setEditedText(currentText);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditedText('');
  };

  const handleSaveEdit = (lessonId: string) => {
    updateLessonText(lessonId, editedText.trim());
    cancelEditing();
  };

  const handleAddLesson = () => {
    if (newLesson.trim()) {
      addLesson(newLesson.trim());
      setNewLesson('');
    }
  };

  const filteredLessons = allLessons.filter((lesson) =>
    lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Admin — Manage All Truths</Text>

        <TextInput
          style={styles.search}
          placeholder="Search truths..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <View style={styles.addRow}>
          <TextInput
            value={newLesson}
            onChangeText={setNewLesson}
            placeholder="Add new truth"
            style={styles.input}
          />
          <TouchableOpacity onPress={handleAddLesson}>
            <Text style={styles.action}>Add</Text>
          </TouchableOpacity>
        </View>

        {filteredLessons.length === 0 ? (
          <Text style={styles.empty}>No matching truths found.</Text>
        ) : (
          filteredLessons.map((lesson) => (
            <View key={lesson.id} style={styles.card}>
              {editingId === lesson.id ? (
                <>
                  <TextInput
                    value={editedText}
                    onChangeText={setEditedText}
                    style={styles.input}
                    multiline
                  />
                  <View style={styles.row}>
                    <TouchableOpacity onPress={() => handleSaveEdit(lesson.id)}>
                      <Text style={styles.action}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={cancelEditing}>
                      <Text style={styles.action}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <>
                  <Text style={styles.text}>{lesson.lesson}</Text>
                  <View style={styles.row}>
                    <TouchableOpacity onPress={() => startEditing(lesson.id, lesson.lesson)}>
                      <Text style={styles.action}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => approveLesson(lesson.id)}>
                      <Text style={styles.action}>Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteLesson(lesson.id)}>
                      <Text style={styles.delete}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { paddingHorizontal: 16, paddingBottom: 32 },
  title: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 16,
    color: '#111',
  },
  search: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 8,
    fontSize: 14,
    marginBottom: 20,
    color: '#000',
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    flex: 1,
    color: '#000',
  },
  empty: {
    textAlign: 'center',
    fontSize: 14,
    color: '#777',
    marginTop: 40,
  },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
  },
  text: {
    fontSize: 14,
    marginBottom: 10,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 12,
  },
  action: {
    color: '#007aff',
    fontSize: 13,
    fontWeight: '500',
  },
  delete: {
    color: '#ff3b30',
    fontSize: 13,
    fontWeight: '500',
  },
});
