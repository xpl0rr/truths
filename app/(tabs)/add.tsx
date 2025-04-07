import React from 'react';
import { StyleSheet, SafeAreaView, View, ScrollView } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { AddLessonForm } from '@/components/AddLessonForm';
import { useLessons } from '../store/LessonStore';

export default function AddLessonScreen() {
  const { addLesson } = useLessons();
  // Admin info
  const userId = 'admin1';
  const userName = 'Admin';

  const handleAddLesson = (lesson: string, anecdote: string) => {
    // Admin added lessons are automatically approved and not marked as user submitted
    const directlyApproved = true;
    const isUserSubmitted = false;

    addLesson(lesson, anecdote, userId, userName, directlyApproved, isUserSubmitted);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Navigate back to the main lessons tab
    setTimeout(() => {
      router.navigate('/(tabs)');
    }, 300);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.titleText}>Admin: Add New Lesson</ThemedText>
        </View>

        <ScrollView>
          <ThemedView style={styles.adminBanner}>
            <ThemedText style={styles.adminText}>
              Admin mode: Lessons added here appear directly on the main page
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.content}>
            <AddLessonForm onSubmit={handleAddLesson} adminMode={true} />
          </ThemedView>
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
  adminBanner: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 4,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(244, 67, 54, 0.3)',
  },
  adminText: {
    fontSize: 12,
    color: '#F44336',
    textAlign: 'center',
  },
  content: {
    padding: 4,
  },
}); 