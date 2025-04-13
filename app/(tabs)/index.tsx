import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  FlatList,
  SafeAreaView,
  View,
  Text,
} from 'react-native';
import LessonCard from '@/components/LessonCard';
import FullScreenLesson from '@/components/FullScreenLesson';
import { useLessons } from '@/store/lessonStore';
import { useLocalSearchParams } from 'expo-router';

export default function TruthsScreen() {
  const userId = 'user123';
  const userName = 'Jane Doe';
  const { getApprovedLessons, voteLesson } = useLessons();
  const [selectedLesson, setSelectedLesson] = useState(null);

  const flatListRef = useRef<FlatList>(null);
  const { scrollTo } = useLocalSearchParams();

  const approvedLessons = getApprovedLessons();

  const computeScore = (lesson) => {
    const upvotes = Object.values(lesson.votes || {}).filter((v) => v === 'up').length;
    const downvotes = Object.values(lesson.votes || {}).filter((v) => v === 'down').length;
    const total = upvotes + downvotes;
    return total === 0 ? 0 : (upvotes + 1) / (total + 2); // Laplace smoothing
  };

  const sortedLessons = approvedLessons
    .map((lesson) => ({
      ...lesson,
      score: computeScore(lesson),
    }))
    .sort((a, b) => b.score - a.score);

  const handleVote = (
    lessonId: string,
    userId: string,
    voteType: 'up' | 'down' | null
  ) => {
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

  useEffect(() => {
    if (scrollTo && flatListRef.current) {
      const index = sortedLessons.findIndex((l) => l.id === scrollTo);
      if (index !== -1) {
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({ index, animated: true });
        }, 300);
      }
    }
  }, [scrollTo, sortedLessons]);

  if (selectedLesson) {
    return (
      <FullScreenLesson
        lesson={selectedLesson}
        onClose={handleCloseLesson}
        userId={userId}
        userName={userName}
        isAdmin={false}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>If Gramma Was Sun Tzu</Text>
      {sortedLessons.length > 0 ? (
        <FlatList
          ref={flatListRef}
          data={sortedLessons}
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
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: 16,
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