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
import { useLessons } from '@/store/lessonStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import AddTruthModal from '@/components/AddTruthModal';
import { useRouter } from 'expo-router';
import FullScreenLesson from '../../components/FullScreenLesson';

export default function TruthsScreen() {
  const { getApprovedLessons } = useLessons();
  const [selectedLesson, setSelectedLesson] = useState(null);

  const approvedLessons = getApprovedLessons();

  return (
    <SafeAreaView style={styles.safe}>
      {selectedLesson ? (
        <FullScreenLesson
          lesson={selectedLesson}
          onClose={() => setSelectedLesson(null)}
          userId={undefined}
          userName={undefined}
          isAdmin={undefined}
        />
      ) : (
        <>
          <Text style={styles.title}>If Gramma Was Sun Tsu</Text>
          <ScrollView contentContainerStyle={styles.container}>
            {approvedLessons.length === 0 ? (
              <Text style={styles.empty}>No truths yet.</Text>
            ) : (
              approvedLessons.map((lesson) => (
                <TouchableOpacity
                  key={lesson.id}
                  style={styles.card}
                  onPress={() => setSelectedLesson(lesson)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.text}>{lesson.lesson || lesson.title}</Text>
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