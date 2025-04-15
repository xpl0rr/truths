import React, { useState } from 'react';
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
import type { Lesson } from '../models/Lesson';
import { SafeAreaView } from 'react-native-safe-area-context';
import AddTruthModal from '@/components/AddTruthModal';
import { useRouter } from 'expo-router';
import FullScreenEditLessonMain from '../components/FullScreenEditLessonMain';

export default function TruthsScreen() {
  const hydrated = useHydrateLessons();
  const { getApprovedLessons, updateLessonText } = useLessons();
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  if (!hydrated) return null;

  const approvedLessons = getApprovedLessons();

  const handleSave = (title: string, anecdote: string) => {
    if (selectedLesson) {
      updateLessonText(selectedLesson.id, title, selectedLesson.isApproved, anecdote);
      setSelectedLesson(null);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {selectedLesson ? (
        <FullScreenEditLessonMain
          visible={!!selectedLesson}
          lesson={selectedLesson}
          onSave={handleSave}
          onClose={() => setSelectedLesson(null)}
        />
      ) : (
        <>
          <View style={{alignItems: 'center'}}>
  <Text style={styles.title}>If Gramma Was Sun Tsu</Text>
</View>
          <ScrollView contentContainerStyle={styles.container}>
            {approvedLessons.length === 0 ? (
              <Text style={textStyles.body}>No truths yet.</Text>
            ) : (
              approvedLessons.map((lesson) => (
                <TouchableOpacity
                  key={lesson.id}
                  style={styles.card}
                  onPress={() => setSelectedLesson(lesson)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.text}>{lesson.lesson}</Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </>
      )}
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