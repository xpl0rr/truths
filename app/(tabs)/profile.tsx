import React from 'react';
import { StyleSheet, FlatList, SafeAreaView, View, ScrollView } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LessonCard } from '@/components/LessonCard';
import { useLessons } from '../store/LessonStore';

export default function ProfileScreen() {
  // In a real app, this would be the authenticated user's ID
  const userId = 'user123';
  const { lessons, voteLesson } = useLessons();
  
  // For this demo, we'll pretend the first lesson is from this user
  // In a real app, lessons would have a userId field to filter by
  const myLessons = lessons.filter((_, index) => index === 0);
  
  const handleVote = (lessonId: string, userId: string, voteType: 'up' | 'down' | null) => {
    voteLesson(lessonId, userId, voteType);
  };

  const renderLessonCard = ({ item }: { item: typeof lessons[0] }) => (
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
          <ThemedText type="title" style={styles.titleText}>My Lessons</ThemedText>
        </View>
        
        <ScrollView>
          <ThemedView style={styles.statsContainer}>
            <View style={styles.statItem}>
              <ThemedText type="subtitle" style={styles.statNumber}>
                {myLessons.length}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Lessons</ThemedText>
            </View>
            
            <View style={styles.statItem}>
              <ThemedText type="subtitle" style={styles.statNumber}>
                {myLessons.reduce((sum, lesson) => sum + lesson.upvotes, 0)}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Upvotes</ThemedText>
            </View>
            
            <View style={styles.statItem}>
              <ThemedText type="subtitle" style={styles.statNumber}>
                {myLessons.reduce((sum, lesson) => sum + Object.keys(lesson.voters).length, 0)}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Interactions</ThemedText>
            </View>
          </ThemedView>
          
          {myLessons.length > 0 ? (
            <FlatList
              data={myLessons}
              renderItem={renderLessonCard}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.lessonsList}
              scrollEnabled={false}
            />
          ) : (
            <ThemedView style={styles.emptyState}>
              <ThemedText style={styles.emptyStateText}>
                You haven't added any lessons yet. Tap the "Add New" tab to share your wisdom!
              </ThemedText>
            </ThemedView>
          )}
        </ScrollView>
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    marginHorizontal: 4,
    marginTop: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(150, 150, 150, 0.1)',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    marginBottom: 2,
    fontWeight: 'normal',
    fontSize: 14,
  },
  statLabel: {
    opacity: 0.7,
    fontSize: 12,
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