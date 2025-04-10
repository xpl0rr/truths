import React, { useState } from 'react';
import { StyleSheet, FlatList, SafeAreaView, View, TouchableOpacity, Text, ScrollView } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LessonCard } from '@/components/LessonCard';
import { useLessons } from '../store/LessonStore';
import { FullScreenLesson } from '@/components/FullScreenLesson';

export default function LessonsScreen() {
  // In a real app, we would get the userId from auth
  const userId = 'user123';
  const userName = 'Jane Doe'; // User name for comments
  const { voteLesson, getApprovedLessons } = useLessons();
  const [selectedLesson, setSelectedLesson] = useState(null);

  // Only show approved lessons in the main list
  const approvedLessons = getApprovedLessons();

  const handleVote = (lessonId: string, userId: string, voteType: 'up' | 'down' | null) => {
    voteLesson(lessonId, userId, voteType);
  };

  const handleOpenLesson = (lesson) => {
    console.log("Opening lesson:", lesson.lesson);
    console.log("Anecdote length:", lesson.anecdote.length);
    setSelectedLesson(lesson);
  };

  const handleCloseLesson = () => {
    setSelectedLesson(null);
  };

  const renderLessonCard = ({ item }: { item: typeof approvedLessons[0] }) => (
    <LessonCard
      lesson={item}
      userId={userId}
      onVote={handleVote}
      onSelect={handleOpenLesson}
    />
  );

  // Show full screen lesson if one is selected
  if (selectedLesson) {
    return (
      <FullScreenLesson
        lesson={selectedLesson}
        onClose={handleCloseLesson}
        userId={userId}
        userName="Jane Doe"
        isAdmin={false}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.titleText}>If Gramma was Sun Tzu</ThemedText>
        </View>

        {approvedLessons.length > 0 ? (
          <>
            <ThemedView style={styles.sortInfo}>
              <ThemedText style={styles.sortInfoText}>
                Sorted by community popularity
              </ThemedText>
            </ThemedView>
            <FlatList
              data={approvedLessons}
              renderItem={renderLessonCard}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.lessonsList}
            />
          </>
        ) : (
          <ThemedView style={styles.emptyState}>
            <ThemedText style={styles.emptyStateText}>
              No featured lessons yet.
            </ThemedText>
          </ThemedView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    paddingHorizontal: 4,
    paddingTop: 4,
    paddingBottom: 2,
    backgroundColor: '#A1CEDC',
    alignItems: 'center',
  },
  titleText: {
    fontWeight: 'normal',
    fontSize: 18,
  },
  sortInfo: {
    padding: 4,
    backgroundColor: 'rgba(0,0,0,0.03)',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  sortInfoText: {
    fontSize: 10,
    opacity: 0.6,
  },
  lessonsList: {
    padding: 4,
  },
  emptyState: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    textAlign: 'center',
    opacity: 0.7,
    fontSize: 12,
  },
  // Full screen styles
  fullScreenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#A1CEDC',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    marginLeft: 6,
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  fullScreenContent: {
    padding: 12,
  },
  fullScreenTitle: {
    fontSize: 20,
    marginBottom: 6,
  },
  fullScreenSubmitter: {
    marginBottom: 10,
    fontSize: 12,
    opacity: 0.7,
  },
  fullScreenAnecdoteContainer: {
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  fullScreenAnecdote: {
    fontSize: 14,
    lineHeight: 20,
  },
  debugText: {
    marginTop: 12,
    fontSize: 10,
    color: '#666',
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: 8,
    borderRadius: 4,
  }
});
