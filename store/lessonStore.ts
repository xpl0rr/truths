import { create } from 'zustand';

type VoteType = 'up' | 'down';

import type { Lesson } from '../app/models/Lesson';



type LessonStore = {
  lessons: Lesson[];
  getAllLessons: () => Lesson[];
  getApprovedLessons: () => Lesson[];
  getUserSubmittedLessons: () => Lesson[];
  addLesson: (lesson: Lesson, options?: { approved?: boolean }) => void;
  updateLessonText: (id: string, newTitle: string, markApproved?: boolean) => void;
  deleteLesson: (id: string) => void;
  approveLesson: (id: string) => void;
  voteLesson: (lessonId: string, userId: string, voteType: VoteType | null) => void;
};

export const useLessons = create<LessonStore>((set, get) => ({
  lessons: [
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
  ],

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
}));