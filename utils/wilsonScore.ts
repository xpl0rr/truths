/**
 * Calculate Wilson score for ranking items with upvotes/downvotes
 * This provides a lower bound confidence score that's more reliable than simple upvote percentage
 * Especially useful for items with few votes
 * 
 * @param upvotes - Number of upvotes
 * @param downvotes - Number of downvotes
 * @param confidence - Confidence interval (default: 0.95 for 95% confidence)
 * @returns Wilson score as a number between 0 and 1
 */
export function calculateWilsonScore(upvotes: number, downvotes: number, confidence = 0.95): number {
  const n = upvotes + downvotes;
  
  // Handle edge cases
  if (n === 0) return 0;
  if (upvotes === 0) return 0;
  if (downvotes === 0) return 1;
  
  // Calculate Wilson score
  const z = 1.96; // z-score for 95% confidence
  const p = upvotes / n;
  
  const numerator = p + z * z / (2 * n) - z * Math.sqrt((p * (1 - p) + z * z / (4 * n)) / n);
  const denominator = 1 + z * z / n;
  
  return numerator / denominator;
}
