import React from 'react';
import { StyleSheet, FlatList, SafeAreaView, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LessonCard } from '@/components/LessonCard';
import { useLessons } from '../store/LessonStore';

export default function LessonsScreen() {
  // In a real app, we would get the userId from auth
  const userId = 'user123';
  const { voteLesson, getApprovedLessons } = useLessons();

  // Only show approved lessons in the main list
  const approvedLessons = getApprovedLessons();

  const handleVote = (lessonId: string, userId: string, voteType: 'up' | 'down' | null) => {
    voteLesson(lessonId, userId, voteType);
  };

  const renderLessonCard = ({ item }: { item: typeof approvedLessons[0] }) => (
    <LessonCard
      lesson={item}
      userId={userId}
      onVote={handleVote}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.titleText}>Things Gramma Told Me</ThemedText>
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
});
