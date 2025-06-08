import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLessons } from '../store/lessonStore';
// Import our Wilson score calculation utility
import { calculateWilsonScore } from '../utils/wilsonScore';
import CommentCard from './CommentCard';

import { Lesson, Comment } from '../src/models/Lesson';

interface FullScreenLessonProps {
    lesson: Lesson;
    onClose: () => void;
    userId: string;
    userName: string;
    isAdmin: boolean;
}

export default function FullScreenLesson({
    lesson,
    onClose,
    userId,
    userName,
    isAdmin,
}: FullScreenLessonProps) {
    const [newComment, setNewComment] = useState('');
    const { getComments, addComment, voteComment, approveComment } = useLessons();
    
    // Get comments and apply Wilson score sorting + approvals filtering
    const allComments = getComments(lesson.id);
    const approvedComments = allComments.filter(comment => comment.isApproved);
    
    // Use Wilson score to sort comments (same as with lessons)
    const sortedComments = [...approvedComments].sort(
        (a, b) => calculateWilsonScore(b.upvotes, b.downvotes) - calculateWilsonScore(a.upvotes, a.downvotes)
    );
    
    // Admin sees all comments, including unapproved ones
    const commentsToShow = isAdmin ? allComments : sortedComments;
    
    const handleSubmitComment = () => {
        if (newComment.trim()) {
            addComment(lesson.id, newComment.trim(), userId, userName);
            setNewComment('');
        }
    };
    
    const handleVoteComment = (commentId: string, voteType: 'up' | 'down' | null) => {
        voteComment(lesson.id, commentId, userId, voteType);
    };
    
    const handleApproveComment = (commentId: string) => {
        if (isAdmin) {
            approveComment(lesson.id, commentId);
        }
    };
    
    const renderComment = ({ item }: { item: Comment }) => (
        <View style={styles.commentWrapper}>
            {isAdmin && !item.isApproved && (
                <TouchableOpacity 
                    style={styles.standardButton}
                    onPress={() => handleApproveComment(item.id)}
                >
                    <Text style={styles.standardButtonText}>Approve Comment</Text>
                </TouchableOpacity>
            )}
            <CommentCard 
                comment={item} 
                userId={userId} 
                onVote={handleVoteComment} 
            />
            {isAdmin && !item.isApproved && <Text style={styles.unapprovedLabel}>* Awaiting approval</Text>}
        </View>
    );
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onClose} style={styles.backButton}>
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView 
                style={{flex: 1}}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                    <Text style={styles.title}>{lesson.lesson}</Text>
                    <Text style={styles.submitted}>Submitted by {lesson.userName}</Text>

                    <View style={styles.anecdoteBox}>
                        <Text style={styles.anecdote}>
                            {lesson.anecdote || lesson.lesson}
                        </Text>
                    </View>
                    
                    <View style={styles.commentsSection}>
                        <Text style={styles.commentsTitle}>Comments</Text>
                        
                        <View style={styles.commentInputContainer}>
                            <TextInput
                                style={styles.commentInput}
                                value={newComment}
                                onChangeText={setNewComment}
                                placeholder="Add your comment..."
                                multiline
                            />
                            <TouchableOpacity 
                                style={styles.standardButton}
                                onPress={handleSubmitComment}
                                disabled={!newComment.trim()}
                            >
                                <Text style={styles.standardButtonText}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                        
                        {commentsToShow.length > 0 ? (
                            commentsToShow.map((comment) => (
                                <React.Fragment key={comment.id}>
                                    {renderComment({item: comment})}
                                </React.Fragment>
                            ))
                        ) : (
                            <Text style={styles.noComments}>No comments yet. Be the first to comment!</Text>
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    standardButton: {
        marginTop: 16,
        backgroundColor: '#f5f5f5',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    standardButtonText: {
        fontSize: 16,
        fontWeight: 'normal',
        color: '#000',
        textAlign: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: '#A1CEDC',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backText: {
        marginLeft: 6,
        fontSize: 14,
        fontWeight: '500',
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 8,
        color: '#111',
    },
    submitted: {
        fontSize: 12,
        color: '#777',
        marginBottom: 16,
    },
    anecdoteBox: {
        padding: 14,
        backgroundColor: '#f2f2f2',
        borderRadius: 10,
    },
    anecdote: {
        fontSize: 16,
        lineHeight: 24,
        color: '#333',
    },
    commentsSection: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    commentsTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
    commentInputContainer: {
        marginBottom: 8,
    },
    commentInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 8,
        minHeight: 60,
        textAlignVertical: 'top',
    },
    commentWrapper: {
        marginBottom: 16,
    },
    unapprovedLabel: {
        color: '#ff9900',
        fontSize: 12,
        fontStyle: 'italic',
        marginTop: 4,
    },
    noComments: {
        color: '#999',
        fontStyle: 'italic',
        marginTop: 8,
    },
});