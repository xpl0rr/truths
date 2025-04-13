import { create } from 'zustand';

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
      title: 'You decide when you are disappointed.',
      anecdote: 'Expectations are silent contracts. You can tear them up anytime.',
      approved: true,
      votes: {},
    },
    {
      id: '2',
      title: 'You can’t fight every battle.',
      anecdote: 'Pick your wars. A wise general knows when to stay silent.',
      approved: false,
      votes: {},
    },
  ],

  getAllLessons: () => get().lessons,

  getApprovedLessons: () =>
    get().lessons.filter((l) => l.approved),

  getUserSubmittedLessons: () =>
    get().lessons.filter((l) => !l.approved),

  addLesson: (newTruth, options = {}) => {
    const lesson = {
      ...newTruth,
      approved: options.approved ?? false,
      votes: {},
    };
    console.log('💾 [Zustand] Adding lesson:', lesson);
    set((state) => ({
      lessons: [lesson, ...state.lessons],
    }));
  },

  updateLessonText: (id, newTitle, markApproved = false) => {
    set((state) => ({
      lessons: state.lessons.map((l) =>
        l.id === id ? { ...l, title: newTitle, approved: markApproved || l.approved } : l
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
        l.id === id ? { ...l, approved: true } : l
      ),
    }));
  },

  voteLesson: (lessonId, userId, voteType) => {
    set((state) => ({
      lessons: state.lessons.map((l) => {
        if (l.id !== lessonId) return l;
        const updatedVotes = { ...l.votes };
        if (voteType === null) {
          delete updatedVotes[userId];
        } else {
          updatedVotes[userId] = voteType;
        }
        return { ...l, votes: updatedVotes };
      }),
    }));
  },
}));