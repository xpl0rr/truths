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
import AddTruthModal from '@/components/AddTruthModal';

export default function AdminScreen() {
  const {
    getAllLessons,
    approveLesson,
    updateLessonText,
    deleteLesson,
    addLesson,
  } = useLessons();

  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const unapprovedLessons = getAllLessons().filter((l) => !l.approved);

  const startEditing = (lessonId: string, currentText: string) => {
    setEditingId(lessonId);
    setEditedText(currentText);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditedText('');
  };

  const handleSaveEdit = (lessonId: string) => {
    updateLessonText(lessonId, editedText.trim(), true); // ✅ auto-approve
    cancelEditing();
  };

  const handleAddNew = (lesson: { title: string; anecdote: string }) => {
    addLesson(lesson, { approved: true }); // ✅ auto-approve
    setShowAddModal(false);
  };

  const filtered = unapprovedLessons.filter((l) =>
    l.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Admin</Text>

        <TextInput
          style={styles.search}
          placeholder="Search truths..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <TouchableOpacity onPress={() => setShowAddModal(true)}>
          <Text style={styles.addButton}>+ Add Your Truth</Text>
        </TouchableOpacity>

        {filtered.length === 0 ? (
          <Text style={styles.empty}>No unapproved truths found.</Text>
        ) : (
          filtered.map((lesson) => (
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
                  <Text style={styles.text}>{lesson.title}</Text>
                  <View style={styles.row}>
                    <TouchableOpacity onPress={() => startEditing(lesson.id, lesson.title)}>
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

      <AddTruthModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddNew}
      />
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
  input: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    marginBottom: 8,
    color: '#000',
  },
  addButton: {
    color: '#007aff',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 20,
    textAlign: 'center',
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