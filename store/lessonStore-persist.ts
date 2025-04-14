import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

// --- Types ---
type VoteType = 'up' | 'down';

type Lesson = {
  id: string;
  title: string;
  anecdote: string;
  approved: boolean;
  votes: {
    [userId: string]: VoteType;
  };
};

type LessonStore = {
  lessons: Lesson[];
  hydrated: boolean;
  getAllLessons: () => Lesson[];
  getApprovedLessons: () => Lesson[];
  getUserSubmittedLessons: () => Lesson[];
  addLesson: (lesson: Lesson, options?: { approved?: boolean }) => void;
  updateLessonText: (id: string, newTitle: string, markApproved?: boolean) => void;
  deleteLesson: (id: string) => void;
  approveLesson: (id: string) => void;
  voteLesson: (lessonId: string, userId: string, voteType: VoteType | null) => void;
  hydrateLessons: () => Promise<void>;
};

const LESSONS_KEY = 'truths_lessons';

export const useLessons = create<LessonStore>((set, get) => ({
  lessons: [],
  hydrated: false,

  getAllLessons: () => get().lessons,

  getApprovedLessons: () => get().lessons.filter((l) => l.approved),

  getUserSubmittedLessons: () => get().lessons.filter((l) => !l.approved),

  hydrateLessons: async () => {
    const raw = await AsyncStorage.getItem(LESSONS_KEY);
    if (raw) {
      set({ lessons: JSON.parse(raw), hydrated: true });
    } else {
      set({ hydrated: true });
    }
  },

  persistLessons: async (lessons: Lesson[]) => {
    await AsyncStorage.setItem(LESSONS_KEY, JSON.stringify(lessons));
  },

  addLesson: (newTruth, options = {}) => {
    const lesson = {
      ...newTruth,
      approved: options.approved ?? false,
      votes: {},
    };
    set((state) => {
      const lessons = [lesson, ...state.lessons];
      get().persistLessons(lessons);
      return { lessons };
    });
  },

  updateLessonText: (id, newTitle, markApproved = false) => {
    set((state) => {
      const lessons = state.lessons.map((l) =>
        l.id === id
          ? { ...l, title: newTitle, approved: markApproved ? true : l.approved }
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
        l.id === id ? { ...l, approved: true } : l
      );
      get().persistLessons(lessons);
      return { lessons };
    });
  },

  voteLesson: (lessonId, userId, voteType) => {
    set((state) => {
      const lessons = state.lessons.map((l) => {
        if (l.id !== lessonId) return l;
        const votes = { ...l.votes };
        if (voteType) {
          votes[userId] = voteType;
        } else {
          delete votes[userId];
        }
        return { ...l, votes };
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
