import { useState } from 'react';

type Lesson = {
  id: string;
  title: string;
  anecdote: string;
  approved: boolean;
  votes: {
    [userId: string]: 'up' | 'down';
  };
};

const initialLessons: Lesson[] = [
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
  }
];

export function useLessons() {
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons);

  const getAllLessons = () => lessons;

  const getApprovedLessons = () =>
    lessons.filter((l) => l.approved);

  const getUserSubmittedLessons = () =>
    lessons.filter((l) => !l.approved);

  const approveLesson = (id: string) => {
    setLessons((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, approved: true } : l
      )
    );
  };

  const updateLessonText = (id: string, newTitle: string) => {
    setLessons((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, title: newTitle } : l
      )
    );
  };

  const deleteLesson = (id: string) => {
    setLessons((prev) => prev.filter((l) => l.id !== id));
  };

  const addLesson = (newTruth: { title: string; anecdote: string }) => {
    setLessons((prev) => [
      {
        id: Date.now().toString(),
        title: newTruth.title,
        anecdote: newTruth.anecdote,
        approved: false,
        votes: {},
      },
      ...prev,
    ]);
  };

  const voteLesson = (
    lessonId: string,
    userId: string,
    voteType: 'up' | 'down' | null
  ) => {
    setLessons((prev) =>
      prev.map((lesson) => {
        if (lesson.id !== lessonId) return lesson;
        const updatedVotes = { ...lesson.votes };
        if (voteType === null) {
          delete updatedVotes[userId];
        } else {
          updatedVotes[userId] = voteType;
        }
        return {
          ...lesson,
          votes: updatedVotes,
        };
      })
    );
  };

  return {
    getAllLessons,
    getApprovedLessons,
    getUserSubmittedLessons,
    approveLesson,
    updateLessonText,
    deleteLesson,
    addLesson,
    voteLesson,
  };
}