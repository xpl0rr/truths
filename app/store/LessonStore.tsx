import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Lesson, sampleLessons, Comment } from '../models/Lesson';

// Storage key for lessons
const STORAGE_KEY = 'gramma_lessons_v2';

interface LessonContextType {
  lessons: Lesson[];
  addLesson: (lesson: string, anecdote: string, userId: string, userName: string, isApproved?: boolean, isUserSubmitted?: boolean) => void;
  voteLesson: (lessonId: string, userId: string, voteType: 'up' | 'down' | null) => void;
  approveLesson: (lessonId: string) => void;
  getApprovedLessons: () => Lesson[];
  getUserSubmittedLessons: () => Lesson[];
  getUserLessons: (userId: string) => Lesson[];
  checkForApproval: () => void;
  setThreshold: (threshold: number) => void;
  currentThreshold: number;
  getSortedLessons: (lessonList: Lesson[]) => Lesson[];
  saveToStorage: () => Promise<boolean>;
  loadFromStorage: () => Promise<void>;
  clearStorage: () => Promise<boolean>;
  addComment: (lessonId: string, commentText: string, userId: string, userName: string) => void;
  getComments: (lessonId: string) => Comment[];
  deleteComment: (lessonId: string, commentId: string) => void;
}

const LessonContext = createContext<LessonContextType | undefined>(undefined);

interface LessonProviderProps {
  children: ReactNode;
  initialLessons?: Lesson[];
}

// Replace the saveLessonsToStorage and loadLessonsFromStorage helper functions with this:
const directSaveToStorage = async (data) => {
  try {
    const jsonValue = JSON.stringify(data);
    console.log(`[STORAGE] Directly saving ${data.length} lessons (${jsonValue.length} bytes)`);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    console.log('[STORAGE] ✅ Direct save completed');
    return true;
  } catch (e) {
    console.error('[STORAGE] ❌ Direct save failed:', e);
    return false;
  }
};

const directLoadFromStorage = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    if (!jsonValue) {
      console.log('[STORAGE] No data found with key:', STORAGE_KEY);
      return null;
    }

    const data = JSON.parse(jsonValue);
    console.log(`[STORAGE] ✅ Loaded ${data.length} lessons directly`);

    // Convert dates
    const formattedData = data.map(item => ({
      ...item,
      createdAt: new Date(item.createdAt)
    }));

    return formattedData;
  } catch (e) {
    console.error('[STORAGE] ❌ Direct load failed:', e);
    return null;
  }
};

export function LessonProvider({
  children,
  initialLessons = sampleLessons
}: LessonProviderProps) {
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons);
  const [currentThreshold, setCurrentThreshold] = useState<number>(10);
  const [isInitialized, setIsInitialized] = useState(false);

  // Replace the saveToStorage method in the LessonProvider component:
  const saveToStorage = async (): Promise<boolean> => {
    const result = await directSaveToStorage(lessons);
    return result;
  };

  // Replace the loadFromStorage method in the LessonProvider component:
  const loadFromStorage = async (): Promise<void> => {
    const data = await directLoadFromStorage();
    if (data && data.length > 0) {
      console.log(`[STORAGE] Setting ${data.length} lessons to state`);
      setLessons(data);
    } else {
      console.log('[STORAGE] Using initial data instead');
      setLessons(initialLessons);
      // Save initial data
      await directSaveToStorage(initialLessons);
    }
    setIsInitialized(true);
  };

  // Load lessons when component mounts
  useEffect(() => {
    loadFromStorage();
  }, []);

  // Save lessons whenever they change (but only after initialization)
  useEffect(() => {
    if (isInitialized) {
      saveToStorage();
    }
  }, [lessons, isInitialized]);

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

  // Advanced sorting score calculation using Wilson score interval
  const getSortScore = (lesson: Lesson) => {
    const upvotes = lesson.upvotes;
    const totalVotes = lesson.upvotes + lesson.downvotes;

    // If no votes, return 0
    if (totalVotes === 0) return 0;

    // For lessons with very few votes, apply a penalty
    // This ensures items need a minimum number of votes to rank highly
    if (totalVotes < 5) {
      const rawPercentage = upvotes / totalVotes;
      // Apply a significant penalty for lessons with only 1-4 votes
      return rawPercentage * (totalVotes / 10); // Will be at most 40% of the raw percentage
    }

    // For lessons with more votes, use Wilson score interval lower bound
    // This is a statistical approach that balances vote percentage with vote count
    const z = 1.96; // 95% confidence interval
    const phat = upvotes / totalVotes;

    // Wilson score calculation
    const numerator = phat + (z * z) / (2 * totalVotes) - z * Math.sqrt((phat * (1 - phat) + (z * z) / (4 * totalVotes)) / totalVotes);
    const denominator = 1 + (z * z) / totalVotes;

    return numerator / denominator;
  };

  // Sort lessons by score - higher scores should be first
  const getSortedLessons = (lessonList: Lesson[]) => {
    return [...lessonList].sort((a, b) => {
      // Get simple percentage for each lesson
      const scoreA = getSortScore(a);
      const scoreB = getSortScore(b);

      // Higher percentage first
      if (scoreB !== scoreA) {
        return scoreB - scoreA;
      }

      // If percentages are exactly the same, sort by total votes
      const votesA = a.upvotes + a.downvotes;
      const votesB = b.upvotes + b.downvotes;
      return votesB - votesA;
    });
  };

  // Run approval check whenever votes change
  useEffect(() => {
    if (isInitialized) {
      checkForApproval();
    }
  }, [lessons.map(l => l.upvotes).join(','), isInitialized]);

  const addLesson = (
    lesson: string,
    anecdote: string,
    userId: string,
    userName: string,
    isApproved = false,
    isUserSubmitted = true
  ) => {
    // Log for debugging
    console.log("🆕 Adding new lesson:");
    console.log("  Title:", lesson);
    console.log("  Anecdote length:", anecdote.length);
    console.log("  isApproved:", isApproved);
    console.log("  isUserSubmitted:", isUserSubmitted);

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
      isUserSubmitted,
      isApproved,
      approvalThreshold: currentThreshold
    };

    setLessons(prevLessons => {
      const updatedLessons = [newLesson, ...prevLessons];
      console.log(`Updated lessons array (${updatedLessons.length} items)`);

      // Immediately save to storage
      saveToStorage()
        .then(() => console.log("Saved lessons after adding new one"))
        .catch(err => console.error("Failed to save after adding lesson:", err));

      return updatedLessons;
    });
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

  // Add a new method in the value object of the LessonProvider:
  const clearStorage = async (): Promise<boolean> => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      console.log('[STORAGE] ✅ Storage cleared successfully');
      return true;
    } catch (e) {
      console.error('[STORAGE] ❌ Failed to clear storage:', e);
      return false;
    }
  };

  // Add a comment to a lesson
  const addComment = (lessonId: string, commentText: string, userId: string, userName: string) => {
    setLessons(prevLessons => {
      const updatedLessons = prevLessons.map(lesson => {
        if (lesson.id !== lessonId) return lesson;

        const newComment: Comment = {
          id: Date.now().toString(),
          text: commentText,
          userId,
          userName,
          createdAt: new Date()
        };

        // Initialize comments array if it doesn't exist
        const existingComments = lesson.comments || [];

        const updatedLesson = {
          ...lesson,
          comments: [newComment, ...existingComments]
        };

        return updatedLesson;
      });

      // Save to storage immediately
      const jsonValue = JSON.stringify(updatedLessons);
      AsyncStorage.setItem(STORAGE_KEY, jsonValue)
        .then(() => console.log("Comments saved to storage"))
        .catch(err => console.error("Error saving comments:", err));

      return updatedLessons;
    });
  };

  // Get all comments for a lesson
  const getComments = (lessonId: string): Comment[] => {
    const lesson = lessons.find(l => l.id === lessonId);
    return lesson?.comments || [];
  };

  // Delete a comment from a lesson
  const deleteComment = (lessonId: string, commentId: string) => {
    setLessons(prevLessons =>
      prevLessons.map(lesson => {
        if (lesson.id !== lessonId) return lesson;
        if (!lesson.comments) return lesson;

        return {
          ...lesson,
          comments: lesson.comments.filter(comment => comment.id !== commentId)
        };
      })
    );

    // Save to storage after deleting comment
    saveToStorage();
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
    getSortedLessons,
    saveToStorage,
    loadFromStorage,
    clearStorage,
    addComment,
    getComments,
    deleteComment
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