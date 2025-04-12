import { useState } from 'react';

type Lesson = {
  id: string;
  lesson: string;
  approved: boolean;
};

const initialLessons: Lesson[] = [
  {
    id: '1',
    lesson: 'You decide when you are disappointed.',
    approved: true,
  },
  {
    id: '2',
    lesson: 'You can’t fight every battle.',
    approved: false,
  }
];

export function useLessons() {
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons);

  const getAllLessons = () => lessons;

  const approveLesson = (id: string) => {
    setLessons((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, approved: true } : l
      )
    );
  };

  const getApprovedLessons = () =>
    lessons.filter((l) => l.approved);

  return {
    getAllLessons,
    getApprovedLessons,
    approveLesson,
  };
}