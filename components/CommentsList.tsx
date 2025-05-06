import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, FlatList, Alert, KeyboardAvoidingView, Platform, SafeAreaView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { ThemedText } from './ThemedText';
import { CommentItem } from './CommentItem';
import type { Comment } from '../src/models/Lesson';
import { useLessons } from '../store/lessonStore';

interface CommentsListProps {
    lessonId: string;
    userId: string;
    userName: string;
    onClose: () => void;
    isAdmin?: boolean;
}

export function CommentsList({ lessonId, userId, userName, onClose, isAdmin = false }: CommentsListProps) {
    const { getComments, addComment, deleteComment } = useLessons();
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState<Comment[]>(getComments(lessonId));
    const [keyboardVisible, setKeyboardVisible] = useState(false);

    // Add keyboard listeners
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true);
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false);
            }
        );

        // Clean up listeners
        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    // Refresh comments when they change
    useEffect(() => {
        // Refresh comments list
        const updatedComments = getComments(lessonId);
        setComments(updatedComments);
    }, [lessonId, getComments]);

    const handleAddComment = () => {
        if (!commentText.trim()) {
            return;
        }

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        // Add comment to store
        addComment(lessonId, commentText.trim(), userId, userName);

        // Clear input
        setCommentText('');

        // Immediately refresh comments list to show the new comment
        const updatedComments = getComments(lessonId);
        setComments(updatedComments);

        // Dismiss keyboard after adding comment
        Keyboard.dismiss();
    };

    const handleDeleteComment = (commentId: string) => {
        // Get the comment to check ownership
        const comment = comments.find(c => c.id === commentId);

        // Only allow admin or self-deletion
        if (!comment || (!isAdmin && comment.userId !== userId)) {
            return;
        }

        Alert.alert(
            "Delete Comment",
            "Are you sure you want to delete this comment?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        // Delete comment from store
                        deleteComment(lessonId, commentId);

                        // Refresh comments list
                        setComments(getComments(lessonId));
                    }
                }
            ]
        );
    };

    const handleClose = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        console.log("Closing comments modal");
        onClose();
    };

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    const renderCommentItem = ({ item }: { item: Comment }) => (
        <CommentItem
            comment={item}
            currentUserId={userId}
            isAdmin={isAdmin}
            onDelete={handleDeleteComment}
        />
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <TouchableWithoutFeedback onPress={dismissKeyboard}>
                <SafeAreaView style={styles.safeContainer}>
                    <View style={styles.header}>
                        <View style={styles.leftHeader}>
                            <ThemedText style={styles.title}>Comments</ThemedText>
                        </View>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={handleClose}
                            activeOpacity={0.6}
                        >
                            <AntDesign name="close" size={24} color="#000" />
                        </TouchableOpacity>
                    </View>

                    <View style={[
                        styles.mainContainer,
                        keyboardVisible && { paddingBottom: 0 }
                    ]}>
                        <FlatList
                            data={comments}
                            renderItem={renderCommentItem}
                            keyExtractor={(item) => item.id}
                            style={styles.commentsList}
                            contentContainerStyle={[
                                styles.commentsContent,
                                keyboardVisible && { paddingBottom: 90 } // Increased padding when keyboard is visible
                            ]}
                            keyboardShouldPersistTaps="handled"
                            ListEmptyComponent={
                                <View style={styles.emptyContainer}>
                                    <ThemedText style={styles.emptyText}>No comments yet. Be the first to comment!</ThemedText>
                                </View>
                            }
                        />

                        <View style={styles.inputWrapper}>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Add a comment..."
                                    value={commentText}
                                    onChangeText={setCommentText}
                                    multiline
                                    maxLength={500}
                                    returnKeyType="default"
                                />
                                <TouchableOpacity
                                    style={[
                                        styles.addButton,
                                        !commentText.trim() && styles.disabledButton
                                    ]}
                                    onPress={handleAddComment}
                                    disabled={!commentText.trim()}
                                    activeOpacity={0.7}
                                >
                                    <AntDesign name="arrowright" size={20} color="white" />
                                </TouchableOpacity>
                            </View>

                            {/* Extra spacing to avoid home indicator */}
                            {!keyboardVisible && <View style={styles.homeIndicatorSpacer} />}
                        </View>
                    </View>
                </SafeAreaView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    mainContainer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: Platform.OS === 'ios' ? 34 : 0, // Account for home indicator
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#f8f8f8',
    },
    leftHeader: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 10,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.05)',
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
    },
    commentsList: {
        flex: 1,
    },
    commentsContent: {
        paddingBottom: 16,
    },
    emptyContainer: {
        padding: 24,
        alignItems: 'center',
    },
    emptyText: {
        textAlign: 'center',
        opacity: 0.6,
    },
    inputWrapper: {
        width: '100%',
        position: 'relative',
        backgroundColor: '#f8f8f8',
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 12,
        backgroundColor: '#f8f8f8',
    },
    input: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        maxHeight: 100,
    },
    addButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#4A90E2',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-end',
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    homeIndicatorSpacer: {
        height: Platform.OS === 'ios' ? 25 : 0,
        backgroundColor: '#f8f8f8',
    },
}); 