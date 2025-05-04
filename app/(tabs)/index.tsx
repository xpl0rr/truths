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
import { useLessons } from '../../store/lessonStore-persist';
import type { Lesson } from '../../src/models/Lesson';
import { SafeAreaView } from 'react-native-safe-area-context';
import AddTruthModal from '../components/AddTruthModal';
import { useRouter } from 'expo-router';
import FullScreenLesson from '../../components/FullScreenLesson';
import LessonCard from '../../components/LessonCard';

export default function TruthsScreen() {
  const { getApprovedLessons, voteLesson, addLesson } = useLessons();
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const userId = 'user123'; // Replace with actual user id logic if available
  const userName = 'Jane Doe'; // Replace with actual user name logic if available

  // Only show approved truths
  const approvedLessons = getApprovedLessons()
    .filter(l => typeof l.lesson === 'string' && l.lesson.trim().length > 0 && l.isApproved === true)
    .slice()
    .sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));

  const handleVote = (lessonId: string, userId: string, voteType: 'up' | 'down' | null) => {
    voteLesson(lessonId, userId, voteType);
  };

  const handleOpenLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
  };

  const handleAddNew = (input: { lesson: string; anecdote: string }) => {
    const newId = Date.now().toString();
    addLesson({
      id: newId,
      lesson: input.lesson,
      anecdote: input.anecdote,
      upvotes: 0,
      downvotes: 0,
      voters: {},
      createdAt: new Date(),
      userId,
      userName,
      isUserSubmitted: true,
      isApproved: false,
      approvalThreshold: 10,
      comments: [],
    });
    setShowAddModal(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {selectedLesson ? (
        <FullScreenLesson
          lesson={selectedLesson}
          onClose={() => setSelectedLesson(null)}
          userId={userId}
          userName={userName}
          isAdmin={false}
        />
      ) : (
        <>
          <View style={{alignItems: 'center'}}>
            <Text style={textStyles.body}>It Is Known</Text>
          </View>
          <TouchableOpacity onPress={() => setShowAddModal(true)}>
            <Text style={textStyles.button}>+ Add Your Truth</Text>
          </TouchableOpacity>
          <ScrollView contentContainerStyle={styles.container}>
            {approvedLessons.length === 0 ? (
              <Text style={textStyles.body}>No truths yet.</Text>
            ) : (
              approvedLessons.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  userId={userId}
                  onVote={handleVote}
                  onSelect={handleOpenLesson}
                />
              ))
            )}
          </ScrollView>
          <AddTruthModal
            visible={showAddModal}
            onClose={() => setShowAddModal(false)}
            onSubmit={(input: { lesson: string; anecdote: string }) => {
              if (!input.lesson || !input.lesson.trim()) {
                alert('Lesson is required!');
                return;
              }
              handleAddNew(input);
            }}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { paddingHorizontal: 16, paddingBottom: 32 },
  title: {
    fontSize: 14,
    fontWeight: '400',
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
    fontWeight: '400',
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
    fontWeight: '400',
  },
  delete: {
    color: '#ff3b30',
    fontSize: 13,
    fontWeight: '500',
  },
});