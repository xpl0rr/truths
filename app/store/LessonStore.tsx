import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Lesson, sampleLessons } from '../models/Lesson';

interface LessonContextType {
  lessons: Lesson[];
  addLesson: (lesson: string, anecdote: string, userId: string, userName: string) => void;
  voteLesson: (lessonId: string, userId: string, voteType: 'up' | 'down' | null) => void;
  approveLesson: (lessonId: string) => void;
  getApprovedLessons: () => Lesson[];
  getUserSubmittedLessons: () => Lesson[];
  getUserLessons: (userId: string) => Lesson[];
  checkForApproval: () => void;
  setThreshold: (threshold: number) => void;
  currentThreshold: number;
  getSortedLessons: (lessonList: Lesson[]) => Lesson[];
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
  const [currentThreshold, setCurrentThreshold] = useState<number>(10);

  // Check for lessons that have reached the approval threshold
  const checkForApproval = () => {
    setLessons(prevLessons =>
      prevLessons.map(lesson => {
        if (lesson.isUserSubmitted && !lesson.isApproved && lesson.upvotes >= currentThreshold) {
          return { ...lesson, isApproved: true };
        }
        return lesson;
      })
    );
  };

  // Calculate vote ratio for sorting
  const getVoteRatio = (lesson: Lesson) => {
    // Avoid division by zero and give more weight to lessons with more votes
    const totalVotes = lesson.upvotes + lesson.downvotes;
    if (totalVotes === 0) return 0;

    // Simple ratio calculation with a minimal vote count to prevent single votes from dominating
    const ratio = lesson.upvotes / (totalVotes || 1);

    // Apply a weight factor based on total votes to favor lessons with more community engagement
    // This helps prevent a lesson with 1 upvote and 0 downvotes (100%) from outranking one with 50 upvotes and 5 downvotes (91%)
    const weight = Math.min(1, Math.log(totalVotes + 1) / Math.log(20)); // Logarithmic scaling

    return ratio * weight + (lesson.upvotes * 0.01); // Tiebreaker for equal ratios
  };

  // Sort lessons by vote ratio
  const getSortedLessons = (lessonList: Lesson[]) => {
    return [...lessonList].sort((a, b) => {
      return getVoteRatio(b) - getVoteRatio(a);
    });
  };

  // Run approval check whenever votes change
  useEffect(() => {
    checkForApproval();
  }, [lessons.map(l => l.upvotes).join(',')]);

  const addLesson = (lesson: string, anecdote: string, userId: string, userName: string) => {
    const newLesson: Lesson = {
      id: Date.now().toString(),
      lesson,
      anecdote,
      upvotes: 0,
      downvotes: 0,
      voters: {},
      createdAt: new Date(),
      userId,
      userName,
      isUserSubmitted: true,
      isApproved: false,
      approvalThreshold: currentThreshold
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

  const approveLesson = (lessonId: string) => {
    setLessons(prevLessons =>
      prevLessons.map(lesson =>
        lesson.id === lessonId
          ? { ...lesson, isApproved: true }
          : lesson
      )
    );
  };

  const getApprovedLessons = () => {
    const approved = lessons.filter(lesson => lesson.isApproved);
    return getSortedLessons(approved);
  };

  const getUserSubmittedLessons = () => {
    const userSubmitted = lessons.filter(lesson => lesson.isUserSubmitted && !lesson.isApproved);
    return getSortedLessons(userSubmitted);
  };

  const getUserLessons = (userId: string) => {
    const userLessons = lessons.filter(lesson => lesson.userId === userId);
    return getSortedLessons(userLessons);
  };

  const setThreshold = (threshold: number) => {
    setCurrentThreshold(threshold);
    // Update all non-approved lessons to have the new threshold
    setLessons(prevLessons =>
      prevLessons.map(lesson =>
        !lesson.isApproved
          ? { ...lesson, approvalThreshold: threshold }
          : lesson
      )
    );
  };

  const value = {
    lessons,
    addLesson,
    voteLesson,
    approveLesson,
    getApprovedLessons,
    getUserSubmittedLessons,
    getUserLessons,
    checkForApproval,
    setThreshold,
    currentThreshold,
    getSortedLessons
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