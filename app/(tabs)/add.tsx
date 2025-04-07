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
  
  const handleAddLesson = (lesson: string, anecdote: string) => {
    addLesson(lesson, anecdote);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Navigate back to the lessons list
    setTimeout(() => {
      router.navigate('/(tabs)');
    }, 300);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.titleText}>Add New Lesson</ThemedText>
        </View>
        
        <ScrollView>
          <ThemedView style={styles.content}>
            <ThemedText style={styles.description}>
              What life lesson have you learned that could benefit others? Add a brief anecdote that illustrates this wisdom.
            </ThemedText>
            
            <AddLessonForm onSubmit={handleAddLesson} />
            
            <ThemedText style={styles.tips}>
              Tips:
            </ThemedText>
            <ThemedText style={styles.tipItem}>
              • Be concise and specific with your lesson
            </ThemedText>
            <ThemedText style={styles.tipItem}>
              • Use a personal story to illustrate your point
            </ThemedText>
            <ThemedText style={styles.tipItem}>
              • Focus on universal truths that others can apply
            </ThemedText>
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
  content: {
    padding: 4,
  },
  description: {
    marginBottom: 8,
    lineHeight: 16,
    fontSize: 12,
  },
  tips: {
    marginTop: 8,
    marginBottom: 4,
    fontWeight: 'normal',
    fontSize: 12,
  },
  tipItem: {
    marginBottom: 2,
    opacity: 0.8,
    fontSize: 12,
  },
}); 