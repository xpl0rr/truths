import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { ThemedText } from './ThemedText';
import { Comment } from '@/app/models/Lesson';

interface CommentItemProps {
    comment: Comment;
    currentUserId: string;
    isAdmin?: boolean;
    onDelete?: (commentId: string) => void;
}

export function CommentItem({ comment, currentUserId, isAdmin = false, onDelete }: CommentItemProps) {
    const isOwnComment = comment.userId === currentUserId;

    const formatDate = (date: Date) => {
        try {
            const d = new Date(date);
            return d.toLocaleDateString();
        } catch (e) {
            return "Unknown date";
        }
    };

    const handleDelete = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        if (onDelete) {
            onDelete(comment.id);
        }
    };

    const canDelete = isAdmin || isOwnComment;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    <ThemedText style={styles.userName}>{comment.userName}</ThemedText>
                    <ThemedText style={styles.date}>{formatDate(comment.createdAt)}</ThemedText>
                </View>

                {canDelete && onDelete && (
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={handleDelete}
                        activeOpacity={0.7}
                    >
                        <AntDesign name="close" size={16} color="#888" />
                    </TouchableOpacity>
                )}
            </View>

            <ThemedText style={styles.commentText}>{comment.text}</ThemedText>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userName: {
        fontWeight: 'bold',
        fontSize: 14,
        marginRight: 8,
    },
    date: {
        fontSize: 12,
        opacity: 0.5,
    },
    commentText: {
        fontSize: 14,
        lineHeight: 20,
    },
    deleteButton: {
        padding: 4,
    }
}); 