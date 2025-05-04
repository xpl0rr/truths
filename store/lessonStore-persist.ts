import { create } from 'zustand';
import { MMKV } from 'react-native-mmkv';
import { useEffect } from 'react';

// Use MMKV for faster, more reliable on-device persistence
const storage = new MMKV();

// --- Types ---
type VoteType = 'up' | 'down';

import type { Lesson } from '../src/models/Lesson';

// Seeded default truths for first launch
const DEFAULT_LESSONS: Lesson[] = [
  {
    id: '1',
    lesson: 'You decide when you are disappointed.',
    anecdote: 'Expectations are silent contracts. You can tear them up anytime.',
    upvotes: 0,
    downvotes: 0,
    voters: {},
    createdAt: new Date(),
    userId: 'admin',
    userName: 'Admin',
    isUserSubmitted: false,
    isApproved: true,
    approvalThreshold: 10,
    comments: [],
  },
  {
    id: '2',
    lesson: 'You can’t fight every battle.',
    anecdote: 'Pick your wars. A wise general knows when to stay silent.',
    upvotes: 0,
    downvotes: 0,
    voters: {},
    createdAt: new Date(),
    userId: 'admin',
    userName: 'Admin',
    isUserSubmitted: false,
    isApproved: false,
    approvalThreshold: 10,
    comments: [],
  },
];

type LessonStore = {
  lessons: Lesson[];
  hydrated: boolean;
  getAllLessons: () => Lesson[];
  getApprovedLessons: () => Lesson[];
  getUserSubmittedLessons: () => Lesson[];
  addLesson: (lesson: Partial<Lesson> & { lesson: string; anecdote: string; id: string }, options?: { isApproved?: boolean }) => void;
  updateLessonText: (id: string, newTitle: string, markApproved?: boolean, newAnecdote?: string) => void;
  deleteLesson: (id: string) => void;
  approveLesson: (id: string) => void;
  voteLesson: (lessonId: string, userId: string, voteType: VoteType | null) => void;
  hydrateLessons: () => Promise<void>;
  persistLessons: (lessons: Lesson[]) => Promise<void>;
};

const LESSONS_KEY = 'truths_lessons';

export const useLessons = create<LessonStore>((set, get) => ({
  lessons: [],
  hydrated: false,

  getAllLessons: () => get().lessons,

  getApprovedLessons: () => get().lessons.filter((l) => l.isApproved),

  getUserSubmittedLessons: () => get().lessons.filter((l) => !l.isApproved),

  hydrateLessons: async () => {
    console.debug('[hydrateLessons] called');
    const raw = storage.getString(LESSONS_KEY);
    if (raw) {
      console.debug('[hydrateLessons] loaded from storage:', raw);
      let lessons = JSON.parse(raw);
      // Remove or fix malformed lessons
      lessons = lessons.filter((l: any) => typeof l.lesson === 'string' && l.lesson.trim().length > 0);
      set({ lessons, hydrated: true });
      console.debug('[hydrateLessons] lessons set to:', lessons);
    } else {
      // Seed default lessons on first run
      set({ lessons: DEFAULT_LESSONS, hydrated: true });
      // Persist seeded defaults
      storage.set(LESSONS_KEY, JSON.stringify(DEFAULT_LESSONS));
      console.debug('[hydrateLessons] seeded default lessons:', DEFAULT_LESSONS);
    }
  },

  persistLessons: async (lessons: Lesson[]) => {
    console.debug('[persistLessons] saving to MMKV:', lessons);
    storage.set(LESSONS_KEY, JSON.stringify(lessons));
  },

  addLesson: (newTruth, options = {}) => {
    let lessonText = typeof newTruth.lesson === 'string' && newTruth.lesson.trim().length > 0 ? newTruth.lesson.trim() : null;
    if (!lessonText) {
      console.error('[addLesson] Tried to add lesson with missing or empty lesson text:', newTruth);
      lessonText = 'Untitled Lesson';
    }
    const lesson: Lesson = {
      ...newTruth,
      lesson: lessonText,
      upvotes: 0,
      downvotes: 0,
      voters: {},
      createdAt: new Date(),
      userId: newTruth.userId || 'admin',
      userName: newTruth.userName || 'Admin',
      isUserSubmitted: !!newTruth.isUserSubmitted,
      isApproved: options.isApproved ?? false,
      approvalThreshold: 10,
      comments: [],
    };
    set((state) => {
      const lessons = [lesson, ...state.lessons];
      get().persistLessons(lessons);
      return { lessons };
    });
  },

  updateLessonText: (id: string, newLesson: string, markApproved = false, newAnecdote?: string) => {
    set((state) => {
      const lessons = state.lessons.map((l) =>
        l.id === id
          ? {
            ...l,
            lesson: newLesson,
            anecdote: newAnecdote !== undefined ? newAnecdote : l.anecdote,
            isApproved: markApproved ? true : l.isApproved,
          }
          : l
      );
      get().persistLessons(lessons);
      return { lessons };
    });
  },

  deleteLesson: (id) => {
    set((state) => {
      const lessons = state.lessons.filter((l) => l.id !== id);
      get().persistLessons(lessons);
      return { lessons };
    });
  },

  approveLesson: (id) => {
    set((state) => {
      const lessons = state.lessons.map((l) =>
        l.id === id ? { ...l, isApproved: true } : l
      );
      get().persistLessons(lessons);
      return { lessons };
    });
  },

  voteLesson: (lessonId, userId, voteType) => {
    set((state) => {
      const lessons = state.lessons.map((l) => {
        if (l.id !== lessonId) return l;
        const voters = { ...l.voters };
        if (voteType) {
          voters[userId] = voteType;
        } else {
          delete voters[userId];
        }
        return { ...l, voters };
      });
      get().persistLessons(lessons);
      return { lessons };
    });
  },
}));

// --- Hydration hook ---
export function useHydrateLessons() {
  const hydrateLessons = useLessons((s) => s.hydrateLessons);
  const hydrated = useLessons((s) => s.hydrated);
  useEffect(() => {
    if (!hydrated) {
      hydrateLessons();
    }
  }, [hydrated, hydrateLessons]);
  return hydrated;
}
