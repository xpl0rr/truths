import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Lesson, sampleLessons } from '../models/Lesson';

interface LessonContextType {
  lessons: Lesson[];
  addLesson: (lesson: string, anecdote: string) => void;
  voteLesson: (lessonId: string, userId: string, voteType: 'up' | 'down' | null) => void;
}

const LessonContext = createContext<LessonContextType | undefined>(undefined);

interface LessonProviderProps {
  children: ReactNode;
  initialLessons?: Lesson[];
}

export function LessonProvider({ 
  children, 
  initialLessons = sampleLessons 
}: LessonProviderProps) {
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons);

  const addLesson = (lesson: string, anecdote: string) => {
    const newLesson: Lesson = {
      id: Date.now().toString(),
      lesson,
      anecdote,
      upvotes: 0,
      downvotes: 0,
      voters: {},
      createdAt: new Date(),
    };

    setLessons(prevLessons => [newLesson, ...prevLessons]);
  };

  const voteLesson = (lessonId: string, userId: string, voteType: 'up' | 'down' | null) => {
    setLessons(prevLessons => 
      prevLessons.map(lesson => {
        if (lesson.id !== lessonId) return lesson;
        
        // Get the previous vote (if any)
        const prevVote = lesson.voters[userId];
        
        // Create a new voters object
        const newVoters = { ...lesson.voters, [userId]: voteType };
        
        // Calculate new vote counts
        let { upvotes, downvotes } = lesson;
        
        // Remove previous vote if existed
        if (prevVote === 'up') upvotes--;
        if (prevVote === 'down') downvotes--;
        
        // Add new vote if not null
        if (voteType === 'up') upvotes++;
        if (voteType === 'down') downvotes++;
        
        return {
          ...lesson,
          upvotes,
          downvotes,
          voters: newVoters
        };
      })
    );
  };

  const value = {
    lessons,
    addLesson,
    voteLesson
  };

  return (
    <LessonContext.Provider value={value}>
      {children}
    </LessonContext.Provider>
  );
}

export function useLessons() {
  const context = useContext(LessonContext);
  if (context === undefined) {
    throw new Error('useLessons must be used within a LessonProvider');
  }
  return context;
} 