import React, { useState } from 'react';
import { StyleSheet, FlatList, SafeAreaView, View, Text } from 'react-native';
import LessonCard from '@/components/LessonCard';
import { useLessons } from '@/store/lessonStore';

export default function TruthsScreen() {
  const userId = 'user123';
  const userName = 'Jane Doe';
  const { voteLesson, getApprovedLessons } = useLessons();
  const [selectedLesson, setSelectedLesson] = useState(null);

  const approvedLessons = getApprovedLessons();

  const handleVote = (lessonId: string, userId: string, voteType: 'up' | 'down' | null) => {
    voteLesson(lessonId, userId, voteType);
  };

  const handleOpenLesson = (lesson: any) => {
    setSelectedLesson(lesson);
  };

  const handleCloseLesson = () => {
    setSelectedLesson(null);
  };

  const renderLessonCard = ({ item }: { item: any }) => (
    <LessonCard
      lesson={item}
      userId={userId}
      onVote={handleVote}
      onSelect={handleOpenLesson}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>If Gramma Were Sun Tzu</Text>
      {approvedLessons.length > 0 ? (
        <FlatList
          data={approvedLessons}
          renderItem={renderLessonCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No truths yet.</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: 12,
    color: '#111',
  },
  list: {
    paddingHorizontal: 12,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: '#666',
  },
});