import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, SafeAreaView, View, TextInput, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LessonCard } from '@/components/LessonCard';
import { useLessons } from '../store/LessonStore';
import { BlurView } from 'expo-blur';

export default function UserLessonsScreen() {
    // In a real app, we would get the userId from auth
    const userId = 'user123';
    const userName = 'Jane Doe';
    const { voteLesson, getUserSubmittedLessons, addLesson } = useLessons();

    // Get user-submitted lessons that aren't approved yet
    const userSubmittedLessons = getUserSubmittedLessons();

    // Form state
    const [isAddingLesson, setIsAddingLesson] = useState(false);
    const [newLesson, setNewLesson] = useState('');
    const [newAnecdote, setNewAnecdote] = useState('');

    // Debug sorting - verify in the console that higher percentages are first
    useEffect(() => {
        if (__DEV__ && userSubmittedLessons.length > 0) {
            console.log('Sorted lessons:');
            userSubmittedLessons.forEach(lesson => {
                const total = lesson.upvotes + lesson.downvotes;
                const percentage = total > 0 ? (lesson.upvotes / total) * 100 : 0;
                console.log(`- ${lesson.lesson}: ${lesson.upvotes}/${total} = ${percentage.toFixed(1)}%`);
            });
        }
    }, [userSubmittedLessons]);

    const handleVote = (lessonId: string, userId: string, voteType: 'up' | 'down' | null) => {
        voteLesson(lessonId, userId, voteType);
    };

    const handleSubmitLesson = () => {
        if (newLesson.trim() && newAnecdote.trim()) {
            addLesson(newLesson, newAnecdote, userId, userName);
            setNewLesson('');
            setNewAnecdote('');
            setIsAddingLesson(false);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
    };

    const renderLessonCard = ({ item }: { item: typeof userSubmittedLessons[0] }) => (
        <LessonCard
            lesson={item}
            userId={userId}
            onVote={handleVote}
        />
    );

    const inputBgColor = 'rgba(255, 255, 255, 0.7)';

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <ThemedText type="title" style={styles.titleText}>Community Submissions</ThemedText>
                    <ThemedText style={styles.subtitle}>
                        Help select the best wisdom
                    </ThemedText>
                </View>

                <ThemedView style={styles.infoBox}>
                    <ThemedText style={styles.infoText}>
                        Submissions are sorted by community vote ratio. Your votes determine which wisdom gets featured!
                    </ThemedText>
                </ThemedView>

                {!isAddingLesson ? (
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => setIsAddingLesson(true)}>
                        <ThemedText style={styles.addButtonText}>+ Share a lesson</ThemedText>
                    </TouchableOpacity>
                ) : (
                    <BlurView intensity={90} tint="light" style={styles.quickSubmitForm}>
                        <TextInput
                            placeholder="Life lesson (e.g. 'Patience is a virtue')"
                            placeholderTextColor="rgba(0, 0, 0, 0.5)"
                            value={newLesson}
                            onChangeText={setNewLesson}
                            style={[styles.input, { backgroundColor: inputBgColor, color: '#000' }]}
                            maxLength={100}
                            contextMenuHidden={false}
                        />

                        <TextInput
                            placeholder="Brief anecdote or explanation..."
                            placeholderTextColor="rgba(0, 0, 0, 0.5)"
                            value={newAnecdote}
                            onChangeText={setNewAnecdote}
                            style={[styles.input, styles.textArea, { backgroundColor: inputBgColor, color: '#000' }]}
                            multiline
                            maxLength={500}
                            textAlignVertical="top"
                            autoCapitalize="sentences"
                            contextMenuHidden={false}
                            editable={true}
                        />

                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setIsAddingLesson(false)}>
                                <ThemedText style={styles.buttonText}>Cancel</ThemedText>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.submitButton}
                                onPress={handleSubmitLesson}>
                                <ThemedText style={styles.submitButtonText}>Submit</ThemedText>
                            </TouchableOpacity>
                        </View>
                    </BlurView>
                )}

                {userSubmittedLessons.length > 0 ? (
                    <FlatList
                        data={userSubmittedLessons}
                        renderItem={renderLessonCard}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.lessonsList}
                    />
                ) : (
                    <ThemedView style={styles.emptyState}>
                        <ThemedText style={styles.emptyStateText}>
                            No community submissions yet. Be the first to add one!
                        </ThemedText>
                    </ThemedView>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        paddingHorizontal: 4,
        paddingTop: 4,
        paddingBottom: 8,
        backgroundColor: '#A1CEDC',
        alignItems: 'center',
    },
    titleText: {
        fontWeight: 'normal',
    },
    subtitle: {
        marginTop: 2,
        fontSize: 12,
        opacity: 0.8,
    },
    infoBox: {
        margin: 8,
        padding: 8,
        backgroundColor: 'rgba(74, 144, 226, 0.1)',
        borderRadius: 8,
        borderLeftWidth: 3,
        borderLeftColor: '#4A90E2',
    },
    infoText: {
        fontSize: 12,
        lineHeight: 16,
    },
    addButton: {
        margin: 8,
        padding: 6,
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: 'rgba(76, 175, 80, 0.3)',
        alignItems: 'center',
    },
    addButtonText: {
        fontSize: 12,
        color: '#4CAF50',
    },
    quickSubmitForm: {
        margin: 8,
        padding: 8,
        borderRadius: 8,
        gap: 8,
    },
    input: {
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 6,
        fontSize: 12,
    },
    textArea: {
        minHeight: 60,
        textAlignVertical: 'top',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
    },
    cancelButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    submitButton: {
        backgroundColor: '#4A90E2',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 4,
    },
    buttonText: {
        fontSize: 12,
    },
    submitButtonText: {
        fontSize: 12,
        color: 'white',
    },
    lessonsList: {
        padding: 4,
    },
    emptyState: {
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyStateText: {
        textAlign: 'center',
        opacity: 0.7,
        fontSize: 12,
    },
}); 