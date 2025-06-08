import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

type Props = {
  lesson: {
    id: string;
    lesson: string;
    anecdote?: string;
    upvotes: number;
    downvotes: number;
    voters: {
      [userId: string]: 'up' | 'down' | null;
    };
  };
  userId: string;
  onVote: (lessonId: string, userId: string, voteType: 'up' | 'down' | null) => void;
  onSelect: (lesson: any) => void;
};

const LessonCard = ({ lesson, userId, onVote, onSelect }: Props) => {
  const [expanded, setExpanded] = useState(false);

  // Use voters, upvotes, downvotes from the canonical model
  const userVote = lesson.voters?.[userId] ?? null;
  const isUpvoted = userVote === 'up';
  const isDownvoted = userVote === 'down';

  // Use upvotes/downvotes from lesson, fallback to counting voters for safety
  const upvotes = typeof lesson.upvotes === 'number' ? lesson.upvotes : Object.values(lesson.voters || {}).filter((v) => v === 'up').length;
  const downvotes = typeof lesson.downvotes === 'number' ? lesson.downvotes : Object.values(lesson.voters || {}).filter((v) => v === 'down').length;
  const totalVotes = upvotes + downvotes;
  const approvalRate = totalVotes > 0 ? Math.round((upvotes / totalVotes) * 100) : 100;

  return (
    <TouchableOpacity
      onPress={() => onSelect(lesson)}
      style={styles.container}
      activeOpacity={0.8}
    >
      <Text style={styles.lessonText}>{lesson.lesson}</Text>

      <View style={styles.metaRow}>
        <Text style={styles.percent}>{approvalRate}% ({upvotes}/{totalVotes || 1})</Text>

        <View style={styles.voteRow}>
          <TouchableOpacity
            onPress={() =>
              onVote(lesson.id, userId, isUpvoted ? null : 'up')
            }
          >
            <AntDesign
              name="arrowup"
              size={20}
              color={isUpvoted ? 'green' : '#ccc'}
              style={styles.voteIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              onVote(lesson.id, userId, isDownvoted ? null : 'down')
            }
          >
            <AntDesign
              name="arrowdown"
              size={20}
              color={isDownvoted ? 'red' : '#ccc'}
              style={styles.voteIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default LessonCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  lessonText: {
    fontSize: 14,
    marginBottom: 6,
    color: '#222',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  percent: {
    fontSize: 12,
    color: 'green',
  },
  voteRow: {
    flexDirection: 'row',
  },
  voteIcon: {
    marginLeft: 8,
  },
});