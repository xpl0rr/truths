import { useState } from 'react';

type Lesson = {
  id: string;
  lesson: string;
  approved: boolean;
  votes: {
    [userId: string]: 'up' | 'down';
  };
};

const initialLessons: Lesson[] = [
  {
    id: '1',
    lesson: 'You decide when you are disappointed.',
    approved: true,
    votes: {}
  },
  {
    id: '2',
    lesson: 'You can’t fight every battle.',
    approved: false,
    votes: {}
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

  const updateLessonText = (id: string, newText: string) => {
    setLessons((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, lesson: newText } : l
      )
    );
  };

  const deleteLesson = (id: string) => {
    setLessons((prev) => prev.filter((l) => l.id !== id));
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
          votes: updatedVotes
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
    voteLesson
  };
}