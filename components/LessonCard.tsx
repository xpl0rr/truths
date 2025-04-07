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
          <ThemedText type="subtitle" style={styles.lessonText}>
            {lesson.lesson}
          </ThemedText>
          
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
        
        <SimpleCollapsible collapsed={!expanded}>
          <ThemedView style={styles.anecdoteContainer}>
            <ThemedText style={styles.anecdoteText}>
              {lesson.anecdote}
            </ThemedText>
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
  lessonText: {
    flex: 1,
    marginRight: 4,
    fontWeight: 'normal',
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
  anecdoteContainer: {
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  anecdoteText: {
    fontStyle: 'italic',
    lineHeight: 18,
    fontSize: 12,
  },
}); 