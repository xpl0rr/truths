import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Comment } from '../src/models/Lesson';

interface CommentCardProps {
  comment: Comment;
  userId: string;
  onVote: (commentId: string, voteType: 'up' | 'down' | null) => void;
}

export default function CommentCard({ comment, userId, onVote }: CommentCardProps) {
  const userVote = comment.voters[userId];
  
  const formatDate = (date: Date) => {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    return date.toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      <View style={styles.commentHeader}>
        <Text style={styles.userName}>{comment.userName}</Text>
        <Text style={styles.date}>{formatDate(comment.createdAt)}</Text>
      </View>
      
      <Text style={styles.commentText}>{comment.text}</Text>
      
      <View style={styles.voteContainer}>
        <TouchableOpacity 
          style={[styles.voteButton, userVote === 'up' ? styles.activeVote : {}]} 
          onPress={() => onVote(comment.id, userVote === 'up' ? null : 'up')}
        >
          <Text style={userVote === 'up' ? styles.activeVoteText : {}}>👍 {comment.upvotes}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.voteButton, userVote === 'down' ? styles.activeVote : {}]} 
          onPress={() => onVote(comment.id, userVote === 'down' ? null : 'down')}
        >
          <Text style={userVote === 'down' ? styles.activeVoteText : {}}>👎 {comment.downvotes}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 8,
    padding: 8,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  userName: {
    fontWeight: '500',
    fontSize: 14,
    color: '#333',
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
  commentText: {
    fontSize: 14,
    marginBottom: 8,
  },
  voteContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  voteButton: {
    marginRight: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  activeVote: {
    backgroundColor: '#f0f0f0',
  },
  activeVoteText: {
    fontWeight: '500',
  },
});
