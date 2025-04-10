import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Text, SafeAreaView, Dimensions, Modal } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { Lesson } from '@/app/models/Lesson';
import { CommentsList } from './CommentsList';
import { useLessons } from '@/app/store/LessonStore';

interface FullScreenLessonProps {
    lesson: Lesson;
    onClose: () => void;
    userId: string;
    userName: string;
    isAdmin?: boolean;
}

export function FullScreenLesson({ lesson, onClose, userId, userName, isAdmin = false }: FullScreenLessonProps) {
    const scrollViewRef = useRef(null);
    const { getComments } = useLessons();
    const [commentsVisible, setCommentsVisible] = useState(false);
    const [commentCount, setCommentCount] = useState(0);

    // Update comment count when component mounts or comments change
    useEffect(() => {
        // Add a timer to periodically check for new comments
        const refreshComments = () => {
            const comments = getComments(lesson.id);
            setCommentCount(comments.length);
        };

        // Refresh immediately and then every 2 seconds
        refreshComments();
        const intervalId = setInterval(refreshComments, 2000);

        // Clean up interval on unmount
        return () => clearInterval(intervalId);
    }, [lesson.id, getComments]);

    // Additional check when comments modal visibility changes
    useEffect(() => {
        if (!commentsVisible) {
            // Refresh comment count when modal closes
            const comments = getComments(lesson.id);
            setCommentCount(comments.length);
        }
    }, [commentsVisible, lesson.id, getComments]);

    // Print debug info when mounting
    useEffect(() => {
        console.log('FullScreenLesson mounted');
        console.log('Lesson title:', lesson.lesson);
        console.log('Anecdote:', lesson.anecdote);
        console.log('Anecdote length:', lesson.anecdote.length);
    }, [lesson]);

    const handleClose = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onClose();
    };

    const toggleComments = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setCommentsVisible(!commentsVisible);
    };

    const handleCloseComments = () => {
        console.log("Closing comments from FullScreenLesson");
        setCommentsVisible(false);

        // Force update comment count after closing
        const comments = getComments(lesson.id);
        setCommentCount(comments.length);
    };

    // Calculate raw popularity percentage
    const totalVotes = lesson.upvotes + lesson.downvotes;
    const popularityPercentage = totalVotes === 0
        ? 0
        : Math.round((lesson.upvotes / totalVotes) * 100);

    // Calculate window dimensions
    const windowHeight = Dimensions.get('window').height;

    // Determine color based on ratio
    const getRatioColor = () => {
        if (popularityPercentage >= 75) return '#4CAF50'; // Green for 75%+ approval
        if (popularityPercentage >= 50) return '#FFC107'; // Yellow for 50-74% approval
        return '#F44336'; // Red for <50% approval
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={handleClose}
                    activeOpacity={0.7}
                >
                    <AntDesign name="arrowleft" size={20} color="#000" />
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.commentsButton}
                    onPress={toggleComments}
                    activeOpacity={0.7}
                >
                    <AntDesign name="message1" size={18} color="#000" />
                    {commentCount > 0 && (
                        <View style={styles.commentCountBadge}>
                            <Text style={styles.commentCount}>{commentCount}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView
                ref={scrollViewRef}
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={true}
                scrollEventThrottle={16}
            >
                <View style={styles.content}>
                    <ThemedText type="title" style={styles.titleText}>
                        {lesson.lesson}
                    </ThemedText>

                    {lesson.isUserSubmitted && (
                        <ThemedText style={styles.submittedBy}>
                            by {lesson.userName}
                        </ThemedText>
                    )}

                    <ThemedView style={styles.anecdoteContainer}>
                        <ThemedText style={styles.anecdoteText}>
                            {lesson.anecdote}
                        </ThemedText>

                        {/* Debug view - only shows in development */}
                        {__DEV__ && (
                            <View style={styles.debugInfo}>
                                <Text style={styles.debugText}>
                                    Anecdote length: {lesson.anecdote.length} characters
                                </Text>
                            </View>
                        )}
                    </ThemedView>
                </View>
            </ScrollView>

            {/* Comments Modal */}
            <Modal
                visible={commentsVisible}
                animationType="slide"
                transparent={false}
                presentationStyle="formSheet"
                supportedOrientations={['portrait']}
                onRequestClose={handleCloseComments}
            >
                <CommentsList
                    lessonId={lesson.id}
                    userId={userId}
                    userName={userName}
                    isAdmin={isAdmin}
                    onClose={handleCloseComments}
                />
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#A1CEDC',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backText: {
        marginLeft: 6,
        fontSize: 14,
    },
    commentsButton: {
        padding: 6,
        position: 'relative',
    },
    commentCountBadge: {
        position: 'absolute',
        top: -2,
        right: -2,
        backgroundColor: '#F44336',
        borderRadius: 8,
        minWidth: 16,
        height: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    commentCount: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    content: {
        padding: 12,
    },
    titleText: {
        fontSize: 20,
        marginBottom: 6,
    },
    submittedBy: {
        marginBottom: 10,
        fontSize: 12,
        opacity: 0.7,
    },
    anecdoteContainer: {
        padding: 12,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
    },
    anecdoteText: {
        fontSize: 14,
        lineHeight: 20,
    },
    debugInfo: {
        marginTop: 12,
        padding: 8,
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 4,
    },
    debugText: {
        fontSize: 10,
        color: '#666',
    }
}); 