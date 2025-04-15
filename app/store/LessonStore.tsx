import { useState } from 'react';

import type { Lesson } from '../models/Lesson';


const initialLessons: Lesson[] = [
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
  }
];

export function useLessons() {
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons);

  const getAllLessons = () => lessons;

  const approveLesson = (id: string) => {
    setLessons((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, isApproved: true } : l
      )
    );
  };

  const getApprovedLessons = () =>
    lessons.filter((l) => l.isApproved);

  return {
    getAllLessons,
    getApprovedLessons,
    approveLesson,
  };
}