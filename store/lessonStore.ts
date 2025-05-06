import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

type VoteType = 'up' | 'down';

import type { Lesson, Comment } from '../src/models/Lesson';
import { sampleLessons } from '../src/models/Lesson';

type LessonStore = {
  lessons: Lesson[];
  getAllLessons: () => Lesson[];
  getApprovedLessons: () => Lesson[];
  getUserSubmittedLessons: () => Lesson[];
  addLesson: (lesson: Lesson, options?: { approved?: boolean }) => void;
  updateLessonText: (id: string, newTitle: string, markApproved?: boolean, newAnecdote?: string) => void;
  deleteLesson: (id: string) => void;
  approveLesson: (id: string) => void;
  voteLesson: (lessonId: string, userId: string, voteType: VoteType | null) => void;
  getComments: (lessonId: string) => Comment[];
  addComment: (lessonId: string, text: string, userId: string, userName: string) => void;
  deleteComment: (lessonId: string, commentId: string) => void;
};

export const useLessons = create<LessonStore>()(
  persist<LessonStore>(
    (set, get) => ({
      lessons: sampleLessons,

      getAllLessons: () => get().lessons,

      getApprovedLessons: () =>
        get().lessons.filter((l) => l.isApproved),

      getUserSubmittedLessons: () =>
        get().lessons.filter((l) => !l.isApproved),

      addLesson: (newTruth, options = {}) => {
        const lesson: Lesson = {
          ...newTruth,
          upvotes: 0,
          downvotes: 0,
          voters: {},
          createdAt: new Date(),
          userId: newTruth.userId || 'admin',
          userName: newTruth.userName || 'Admin',
          isUserSubmitted: !!newTruth.isUserSubmitted,
          isApproved: options.approved ?? false,
          approvalThreshold: 10,
          comments: [],
        };
        set((state) => ({
          lessons: [lesson, ...state.lessons],
        }));
      },

      updateLessonText: (id, newLesson, markApproved = false, newAnecdote?) => {
        set((state) => ({
          lessons: state.lessons.map((l) =>
            l.id === id ? { ...l, lesson: newLesson, isApproved: markApproved || l.isApproved, anecdote: newAnecdote || l.anecdote } : l
          ),
        }));
      },

      deleteLesson: (id) => {
        set((state) => ({
          lessons: state.lessons.filter((l) => l.id !== id),
        }));
      },

      approveLesson: (id) => {
        set((state) => ({
          lessons: state.lessons.map((l) =>
            l.id === id ? { ...l, isApproved: true } : l
          ),
        }));
      },

      voteLesson: (lessonId, userId, voteType) => {
        set((state) => ({
          lessons: state.lessons.map((l) => {
            if (l.id !== lessonId) return l;
            const updatedVoters = { ...l.voters };
            if (voteType === null) {
              delete updatedVoters[userId];
            } else {
              updatedVoters[userId] = voteType;
            }
            return { ...l, voters: updatedVoters };
          }),
        }));
      },

      getComments: (lessonId) => {
        const lesson = get().lessons.find((l) => l.id === lessonId);
        return lesson?.comments ?? [];
      },

      addComment: (lessonId, text, userId, userName) => {
        const newComment: Comment = { id: Date.now().toString(), text, userId, userName, createdAt: new Date() };
        set((state) => ({
          lessons: state.lessons.map((l) =>
            l.id === lessonId ? { ...l, comments: [...(l.comments ?? []), newComment] } : l
          ),
        }));
      },

      deleteComment: (lessonId, commentId) => {
        set((state) => ({
          lessons: state.lessons.map((l) =>
            l.id === lessonId
              ? { ...l, comments: l.comments?.filter((c) => c.id !== commentId) ?? [] }
              : l
          ),
        }));
      },
    }),
    {
      name: 'lessons-storage-v2',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);