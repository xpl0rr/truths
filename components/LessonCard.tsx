import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { AntDesign } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { Lesson } from '@/app/models/Lesson';
import { SimpleCollapsible } from './SimpleCollapsible';

interface LessonCardProps {
  lesson: Lesson;
  userId: string;
  onVote: (lessonId: string, userId: string, voteType: 'up' | 'down' | null) => void;
}

export function LessonCard({ lesson, userId, onVote }: LessonCardProps) {
  const [expanded, setExpanded] = useState(false);

  const userVote = lesson.voters[userId] || null;
  const isUpvoted = userVote === 'up';
  const isDownvoted = userVote === 'down';

  const handleVote = (voteType: 'up' | 'down', event: any) => {
    event.stopPropagation(); // Prevent expanding the card when voting
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // If user already voted this way, remove their vote
    const newVoteType = lesson.voters[userId] === voteType ? null : voteType;
    onVote(lesson.id, userId, newVoteType);
  };

  const toggleExpand = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpanded(!expanded);
  };

  // Calculate popularity percentage
  const totalVotes = lesson.upvotes + lesson.downvotes;
  const popularityPercentage = totalVotes === 0
    ? 0
    : Math.round((lesson.upvotes / totalVotes) * 100);

  // Determine color based on ratio
  const getRatioColor = () => {
    if (popularityPercentage >= 75) return '#4CAF50'; // Green
    if (popularityPercentage >= 50) return '#FFC107'; // Yellow
    return '#F44336'; // Red
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={toggleExpand}
      style={styles.cardWrapper}
    >
      <BlurView
        intensity={80}
        tint="light"
        style={styles.card}>
        <View style={styles.lessonContainer}>
          <View style={styles.lessonHeader}>
            <ThemedText type="subtitle" style={styles.lessonText}>
              {lesson.lesson}
            </ThemedText>
            <View style={styles.lessonMeta}>
              {lesson.isUserSubmitted && (
                <ThemedText style={styles.submittedBy}>
                  by {lesson.userName}
                </ThemedText>
              )}
              {totalVotes > 0 && (
                <View style={styles.ratingContainer}>
                  <View
                    style={[
                      styles.ratingBadge,
                      { backgroundColor: getRatioColor() }
                    ]}
                  >
                    <ThemedText style={styles.ratingText}>
                      {popularityPercentage}%
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.votesTotalText}>
                    ({totalVotes} vote{totalVotes !== 1 ? 's' : ''})
                  </ThemedText>
                </View>
              )}
            </View>
          </View>

          <View style={styles.votingContainer}>
            <TouchableOpacity
              onPress={(e) => handleVote('up', e)}
              style={[styles.voteButton, isUpvoted && styles.activeUpvote]}>
              <AntDesign
                name="caretup"
                size={14}
                color={isUpvoted ? '#fff' : '#000'}
              />
              <ThemedText style={[styles.voteCount, isUpvoted && styles.activeVoteText]}>
                {lesson.upvotes}
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={(e) => handleVote('down', e)}
              style={[styles.voteButton, isDownvoted && styles.activeDownvote]}>
              <AntDesign
                name="caretdown"
                size={14}
                color={isDownvoted ? '#fff' : '#000'}
              />
              <ThemedText style={[styles.voteCount, isDownvoted && styles.activeVoteText]}>
                {lesson.downvotes}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {!lesson.isApproved && lesson.isUserSubmitted && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBackground}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${popularityPercentage}%`,
                    backgroundColor: getRatioColor()
                  }
                ]}
              />
            </View>
            <ThemedText style={styles.progressText}>
              Community rating: {popularityPercentage}%
            </ThemedText>
          </View>
        )}

        <SimpleCollapsible collapsed={!expanded}>
          <ThemedView style={styles.anecdoteContainer}>
            <ThemedText style={styles.anecdoteText}>
              {lesson.anecdote}
            </ThemedText>
            {lesson.isApproved && lesson.isUserSubmitted && (
              <View style={styles.approvedBadge}>
                <ThemedText style={styles.approvedText}>FEATURED</ThemedText>
              </View>
            )}
          </ThemedView>
        </SimpleCollapsible>
      </BlurView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  card: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  lessonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  lessonHeader: {
    flex: 1,
    marginRight: 4,
  },
  lessonText: {
    fontWeight: 'normal',
  },
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  submittedBy: {
    fontSize: 10,
    opacity: 0.6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingBadge: {
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    marginRight: 3,
  },
  ratingText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  votesTotalText: {
    fontSize: 10,
    opacity: 0.6,
  },
  votingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  voteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 12,
    minWidth: 28,
  },
  activeUpvote: {
    backgroundColor: '#4CAF50',
  },
  activeDownvote: {
    backgroundColor: '#F44336',
  },
  activeVoteText: {
    color: '#fff',
  },
  voteCount: {
    fontSize: 12,
  },
  progressContainer: {
    paddingHorizontal: 8,
    paddingBottom: 4,
  },
  progressBackground: {
    height: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 10,
    textAlign: 'right',
    opacity: 0.7,
    marginTop: 2,
  },
  anecdoteContainer: {
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  anecdoteText: {
    fontStyle: 'italic',
    lineHeight: 18,
    fontSize: 12,
  },
  approvedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 6,
  },
  approvedText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
}); 