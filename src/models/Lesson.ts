export interface Comment {
  id: string;
  text: string;
  userId: string;
  userName: string;
  createdAt: Date;
  upvotes: number;
  downvotes: number;
  voters: Record<string, 'up' | 'down' | null>;
  isApproved: boolean;
}

export interface Lesson {
  id: string;
  lesson: string;
  anecdote: string;
  upvotes: number;
  downvotes: number;
  voters: Record<string, 'up' | 'down' | null>;
  createdAt: Date;
  userId: string;
  userName: string;
  isUserSubmitted: boolean;
  isApproved: boolean;
  approvalThreshold: number;
  comments?: Comment[];
}

// Empty array for lessons
export const emptyLessons: Lesson[] = []; 