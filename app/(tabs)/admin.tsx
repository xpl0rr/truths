import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ToastAndroid,
  Platform,
  Alert,
} from 'react-native';
import textStyles from '../styles/textStyles';
import { useLessons, useHydrateLessons } from '@/store/lessonStore-persist';
import { SafeAreaView } from 'react-native-safe-area-context';
import AddTruthModal from '../components/AddTruthModal';
import { useRouter } from 'expo-router';
import FullScreenEditLessonMain from '../components/FullScreenEditLessonMain';
import type { Lesson } from '../../src/models/Lesson';
import AsyncStorage from '@react-native-async-storage/async-storage';

function DebugLessons() {
  useEffect(() => {
    async function debugPrintLessons() {
      const raw = await AsyncStorage.getItem('truths_lessons');
      if (!raw) {
        console.log('No lessons found in storage.');
      } else {
        try {
          const lessons = JSON.parse(raw);
          console.log('Lessons in storage:', lessons);
        } catch (e) {
          console.log('Could not parse lessons:', raw);
        }
      }
    }
    debugPrintLessons();
  }, []);
  return null;
}

export default function AdminScreen() {
  // Debug: show AsyncStorage contents in console
  DebugLessons();
  const hydrated = useHydrateLessons();
  if (!hydrated) return null;
  // All hooks, handlers, and filtering logic above

  const {
    getAllLessons,
    approveLesson,
    updateLessonText,
    deleteLesson,
    addLesson,
  } = useLessons();

  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const allLessons = getAllLessons();
  const unapprovedLessons = allLessons.filter((l) => !l.isApproved);

  const startEditing = (lessonObj: Lesson) => {
    setEditingLesson(lessonObj);
  };

  const handleSaveEdit = (lesson: string, anecdote: string) => {
  if (editingLesson) {
    updateLessonText(editingLesson.id, lesson, editingLesson.isApproved, anecdote);
    setEditingLesson(null);
  }
};

const handleCloseEdit = () => {
  setEditingLesson(null);
};

  const notifySuccess = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert(message);
    }
  };



  const handleAddNew = (input: { lesson: string; anecdote: string }) => {
  console.log('[Admin handleAddNew] received:', input);
    const newId = Date.now().toString();
    addLesson({ lesson: input.lesson, anecdote: input.anecdote, id: newId, isUserSubmitted: true }, { isApproved: true });
    notifySuccess('Truth added and promoted to main page');
    setShowAddModal(false);
    router.push({ pathname: '/', params: { scrollTo: newId } });
  };

  const filtered =
    searchQuery.trim().length === 0
      ? allLessons.filter(
          (l) => typeof l.lesson === 'string' && l.lesson.trim().length > 0
        )
      : allLessons.filter(
          (l) =>
            typeof l.lesson === 'string' &&
            l.lesson.trim().length > 0 &&
            l.lesson.toLowerCase().includes(searchQuery.toLowerCase())
        );
  const visibleLessons = filtered;

  // --- All rendering logic is now inside the function ---
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.lesson}>Admin</Text>

        <View style={{ position: 'relative', justifyContent: 'center' }}>
          <TextInput
            style={[styles.search, { paddingRight: 36, height: 44 }]}
            placeholder="Search truths..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={{ position: 'absolute', right: 12, top: 0, height: 44, justifyContent: 'center', alignItems: 'center' }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={{ fontSize: 22, color: '#999', lineHeight: 24 }}>×</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity onPress={() => setShowAddModal(true)}>
          <Text style={styles.addButton}>+ Add Your Truth</Text>
        </TouchableOpacity>

        {filtered.length === 0 && searchQuery.length > 0 ? (
          <Text style={styles.empty}>No matches found.</Text>
        ) : filtered.length === 0 ? (
          <Text style={styles.empty}>No unapproved truths.</Text>
        ) : (
           visibleLessons.map((lesson) => (
            <TouchableOpacity
              key={lesson.id}
              style={styles.card}
              onPress={() => startEditing(lesson)}
              activeOpacity={0.85}
            >
              <Text style={styles.text}>{lesson.lesson}</Text>
            </TouchableOpacity>
          ))
        )} 
      </ScrollView>

      <AddTruthModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={(input: { lesson: string; anecdote: string }) => {
          console.log('[AddTruthModal onSubmit] received:', input);
          if (!input.lesson || !input.lesson.trim()) {
            alert('Lesson is required!');
            return;
          }
          handleAddNew(input);
        }}
      />
      {editingLesson && (
        <FullScreenEditLessonMain
          visible={!!editingLesson}
          lesson={editingLesson}
          onSave={handleSaveEdit}
          onClose={handleCloseEdit}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { paddingHorizontal: 16, paddingBottom: 32 },
  lesson: {
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