import { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Lesson } from '../models/Lesson';
import { sampleLessons } from '../models/Lesson';

const LESSONS_KEY = 'truths_lessons';

const initialLessons: Lesson[] = sampleLessons;

export function useLessons() {
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate lessons from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(LESSONS_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          // Convert createdAt back to Date if needed
          setLessons(parsed.map((l: any) => ({
            ...l,
            createdAt: l.createdAt ? new Date(l.createdAt) : new Date(),
          })));
        }
      } catch (e) {
        console.warn('Failed to load lessons:', e);
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  // Persist lessons to AsyncStorage after every change
  useEffect(() => {
    if (hydrated) {
      AsyncStorage.setItem(LESSONS_KEY, JSON.stringify(lessons));
    }
  }, [lessons, hydrated]);

  // All your lesson functions (same as before)
  const getAllLessons = () => lessons;
  const getApprovedLessons = () => lessons.filter((l) => l.isApproved);

  const approveLesson = (id: string) => {
    setLessons((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, isApproved: true } : l
      )
    );
  };

  const voteLesson = (
    lessonId: string,
    userId: string,
    voteType: 'up' | 'down' | null
  ) => {
    setLessons((prevLessons) =>
      prevLessons.map((lesson) => {
        if (lesson.id !== lessonId) return lesson;
        const newVoters = { ...lesson.voters };
        let upvotes = lesson.upvotes;
        let downvotes = lesson.downvotes;
        if (newVoters[userId] === 'up') upvotes--;
        if (newVoters[userId] === 'down') downvotes--;
        if (voteType === null) {
          delete newVoters[userId];
        } else {
          newVoters[userId] = voteType;
          if (voteType === 'up') upvotes++;
          if (voteType === 'down') downvotes++;
        }
        return {
          ...lesson,
          voters: newVoters,
          upvotes,
          downvotes,
        };
      })
    );
  };

  const addLesson = (lesson: Lesson) => {
    setLessons((prev) => [...prev, lesson]);
  };

  const updateLessonText = (id: string, lesson: string, isApproved: boolean, anecdote: string) => {
    setLessons((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, lesson, anecdote, isApproved } : l
      )
    );
  };

  return {
    getAllLessons,
    getApprovedLessons,
    approveLesson,
    voteLesson,
    addLesson,
    updateLessonText,
    hydrated, // Optionally export this if you want to show a loading spinner
  };
}