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
}

// Sample data for testing
export const sampleLessons: Lesson[] = [
  {
    id: '1',
    lesson: 'Patience is a virtue',
    anecdote: 'I once waited 3 hours for a bus in the rain, only to discover I was at the wrong stop. The experience taught me that rushing and impatience only leads to mistakes.',
    upvotes: 5,
    downvotes: 2,
    voters: {},
    createdAt: new Date('2023-01-15'),
    userId: 'admin1',
    userName: 'Admin',
    isUserSubmitted: false,
    isApproved: true,
    approvalThreshold: 10
  },
  {
    id: '2',
    lesson: 'Kindness costs nothing',
    anecdote: 'I saw a stranger pay for an elderly woman\'s groceries when her card was declined. The woman\'s tears of gratitude reminded me how powerful small acts of kindness can be.',
    upvotes: 10,
    downvotes: 0,
    voters: {},
    createdAt: new Date('2023-02-10'),
    userId: 'admin1',
    userName: 'Admin',
    isUserSubmitted: false,
    isApproved: true,
    approvalThreshold: 10
  },
  {
    id: '3',
    lesson: 'Never stop learning',
    anecdote: 'At 65, my grandfather started learning to code. Within a year, he built an app that helped his retirement community coordinate activities. It\'s never too late to learn something new.',
    upvotes: 7,
    downvotes: 1,
    voters: {},
    createdAt: new Date('2023-03-22'),
    userId: 'admin1',
    userName: 'Admin',
    isUserSubmitted: false,
    isApproved: true,
    approvalThreshold: 10
  },
  {
    id: '4',
    lesson: 'Forgiveness heals both sides',
    anecdote: 'After years of not speaking to my brother over a fight, I finally reached out. The weight that lifted from both of us showed me that forgiveness is more about your own healing than the other person.',
    upvotes: 8,
    downvotes: 2,
    voters: {},
    createdAt: new Date('2023-04-05'),
    userId: 'user123',
    userName: 'Jane',
    isUserSubmitted: true,
    isApproved: false,
    approvalThreshold: 10
  },
  {
    id: '5',
    lesson: 'Embrace failure as a teacher',
    anecdote: 'My first business failed spectacularly, losing me everything. But those lessons helped me build a successful second venture. I wouldn\'t have succeeded without first failing.',
    upvotes: 6,
    downvotes: 1,
    voters: {},
    createdAt: new Date('2023-05-10'),
    userId: 'user456',
    userName: 'Mark',
    isUserSubmitted: true,
    isApproved: false,
    approvalThreshold: 10
  }
]; 