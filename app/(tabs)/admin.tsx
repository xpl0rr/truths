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
import textStyles from '../../styles/textStyles';
import { useLessons } from '../../store/lessonStore-persist';
import { SafeAreaView } from 'react-native-safe-area-context';
import AddTruthModal from '../../components/AddTruthModal';
import { useRouter } from 'expo-router';
import FullScreenEditLessonMain from '../../components/FullScreenEditLessonMain';
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

  const {
    getAllLessons,
    approveLesson,
    updateLessonText,
    addLesson,
  } = useLessons();

  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const allLessons = getAllLessons();
  // Show only unapproved truths by default
  const visibleLessons = searchQuery.trim().length === 0
    ? allLessons.filter(
      (l) => typeof l.lesson === 'string' && l.lesson.trim().length > 0 && !l.isApproved
    )
    : allLessons.filter(
      (l) => typeof l.lesson === 'string' && l.lesson.trim().length > 0 && l.lesson.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
    addLesson({
      lesson: input.lesson,
      anecdote: input.anecdote,
      id: newId,
      isUserSubmitted: true,
      isApproved: true,
      upvotes: 0,
      downvotes: 0,
      voters: {},
      createdAt: new Date(),
      userId: 'admin',
      userName: 'Admin',
      approvalThreshold: 10,
      comments: [],
    });
    notifySuccess('Truth added and promoted to main page');
    setShowAddModal(false);
    router.push('/');
  };

  const filtered =
    searchQuery.trim().length === 0
      ? visibleLessons
      : visibleLessons.filter((l) =>
        l.lesson.toLowerCase().includes(searchQuery.toLowerCase())
      );

  // --- All rendering logic is now inside the function ---
  return (
    <SafeAreaView style={[styles.safe, { flex: 1, position: 'relative' }]}> 
      <View style={{ flex: 1, paddingBottom: 24 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={{ alignItems: 'center' }}>
            <Text style={textStyles.title}>Admin</Text>
          </View>

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

          {filtered.length === 0 && searchQuery.length > 0 ? (
            <Text style={textStyles.body}>No matches found.</Text>
          ) : filtered.length === 0 ? (
            <Text style={textStyles.body}>No truths yet.</Text>
          ) : (
            filtered.map((lesson) => (
              <View key={lesson.id} style={styles.card}>
                <TouchableOpacity
                  onPress={() => startEditing(lesson)}
                  activeOpacity={0.85}
                >
                  <Text style={{ fontSize: 16, fontWeight: '400', color: '#222' }}>{lesson.lesson}</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', marginTop: 8, justifyContent: 'flex-end' }}>
                  {!lesson.isApproved && (
                    <TouchableOpacity
                      style={[styles.button, { backgroundColor: '#4caf50', marginRight: 8 }]}
                      onPress={() => approveLesson(lesson.id)}
                    >
                      <Text style={textStyles.button}>Approve</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>
      <TouchableOpacity
        style={{
          marginTop: 12,
          marginBottom: 16,
          alignSelf: 'center',
          backgroundColor: '#eaeaea',
          borderRadius: 8,
          paddingVertical: 8,
          paddingHorizontal: 18,
        }}
        onPress={() => setShowAddModal(true)}
      >
        <Text style={{ fontSize: 16, fontWeight: '400', color: '#222' }}>+ Add Your Truth</Text>
      </TouchableOpacity>
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
  button: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
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
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 14,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
});
