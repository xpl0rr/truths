import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, FlatList, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { ThemedText } from './ThemedText';
import { CommentItem } from './CommentItem';
import { Comment } from '@/app/models/Lesson';
import { useLessons } from '@/app/store/LessonStore';

interface CommentsListProps {
    lessonId: string;
    userId: string;
    userName: string;
    onClose: () => void;
}

export function CommentsList({ lessonId, userId, userName, onClose }: CommentsListProps) {
    const { getComments, addComment, deleteComment } = useLessons();
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState<Comment[]>(getComments(lessonId));

    const handleAddComment = () => {
        if (!commentText.trim()) {
            return;
        }

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        // Add comment to store
        addComment(lessonId, commentText.trim(), userId, userName);

        // Clear input
        setCommentText('');

        // Refresh comments list
        setComments(getComments(lessonId));
    };

    const handleDeleteComment = (commentId: string) => {
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

    const renderCommentItem = ({ item }: { item: Comment }) => (
        <CommentItem
            comment={item}
            currentUserId={userId}
            onDelete={handleDeleteComment}
        />
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
            keyboardVerticalOffset={100}
        >
            <View style={styles.header}>
                <ThemedText style={styles.title}>Comments</ThemedText>
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={handleClose}
                    activeOpacity={0.7}
                >
                    <AntDesign name="close" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={comments}
                renderItem={renderCommentItem}
                keyExtractor={(item) => item.id}
                style={styles.commentsList}
                contentContainerStyle={styles.commentsContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <ThemedText style={styles.emptyText}>No comments yet. Be the first to comment!</ThemedText>
                    </View>
                }
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Add a comment..."
                    value={commentText}
                    onChangeText={setCommentText}
                    multiline
                    maxLength={500}
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
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#f8f8f8',
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
    inputContainer: {
        flexDirection: 'row',
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: '#eee',
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
}); 