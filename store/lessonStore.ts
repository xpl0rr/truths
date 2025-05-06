import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

type VoteType = 'up' | 'down';

import type { Lesson } from '../src/models/Lesson';
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
    }),
    {
      name: 'lessons-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);