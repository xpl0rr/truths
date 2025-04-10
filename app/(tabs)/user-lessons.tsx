import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, SafeAreaView, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Text, Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import { AntDesign } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LessonCard } from '@/components/LessonCard';
import { useLessons } from '../store/LessonStore';
import { BlurView } from 'expo-blur';
import { FullScreenLesson } from '@/components/FullScreenLesson';

export default function UserLessonsScreen() {
    // In a real app, we would get the userId from auth
    const userId = 'user123';
    const userName = 'Jane Doe';
    const { voteLesson, getUserSubmittedLessons, addLesson } = useLessons();
    const [selectedLesson, setSelectedLesson] = useState(null);

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

    const handleOpenLesson = (lesson) => {
        console.log("Opening lesson:", lesson.lesson);
        console.log("Anecdote length:", lesson.anecdote.length);
        setSelectedLesson(lesson);
    };

    const handleCloseLesson = () => {
        setSelectedLesson(null);
    };

    const validateInputs = () => {
        if (!newLesson.trim()) {
            Alert.alert('Error', 'Please enter a lesson title');
            return false;
        }

        if (!newAnecdote.trim()) {
            Alert.alert('Error', 'Please enter an anecdote');
            return false;
        }

        if (newAnecdote.trim().length < 10) {
            Alert.alert('Error', 'Anecdote is too short (minimum 10 characters)');
            return false;
        }

        return true;
    };

    const handleSubmitLesson = () => {
        if (!validateInputs()) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            return;
        }

        try {
            console.log("Submitting new lesson:", newLesson.trim());
            console.log("Anecdote content:", newAnecdote);
            console.log("Anecdote length:", newAnecdote.length);

            // Add the lesson with the raw anecdote - no need for special formatting
            addLesson(newLesson.trim(), newAnecdote, userId, userName);

            // Success feedback
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert('Success', 'Your lesson has been submitted to the community!');

            // Clear form and close it
            setNewLesson('');
            setNewAnecdote('');
            setIsAddingLesson(false);
        } catch (error) {
            console.error('Error submitting lesson:', error);
            Alert.alert('Error', 'Failed to submit lesson. Please try again.');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
    };

    const renderLessonCard = ({ item }: { item: typeof userSubmittedLessons[0] }) => (
        <LessonCard
            lesson={item}
            userId={userId}
            onVote={handleVote}
            onSelect={handleOpenLesson}
        />
    );

    const inputBgColor = 'rgba(255, 255, 255, 0.7)';

    // Show full screen lesson if one is selected
    if (selectedLesson) {
        return (
            <FullScreenLesson
                lesson={selectedLesson}
                onClose={handleCloseLesson}
                userId={userId}
                userName={userName}
            />
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
            >
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
                    <View style={styles.formContainer}>
                        <BlurView intensity={90} tint="light" style={styles.quickSubmitForm}>
                            <ThemedText style={styles.formTitle}>Share Your Wisdom</ThemedText>

                            <TextInput
                                placeholder="Life lesson (e.g. 'Patience is a virtue')"
                                placeholderTextColor="rgba(0, 0, 0, 0.5)"
                                value={newLesson}
                                onChangeText={setNewLesson}
                                style={[styles.input, { backgroundColor: inputBgColor, color: '#000' }]}
                                maxLength={100}
                            />

                            <TextInput
                                placeholder="Tell a short anecdote about this lesson..."
                                placeholderTextColor="rgba(0, 0, 0, 0.5)"
                                value={newAnecdote}
                                onChangeText={setNewAnecdote}
                                style={[styles.input, styles.textArea, { backgroundColor: inputBgColor, color: '#000' }]}
                                multiline={true}
                                numberOfLines={8}
                                maxLength={1000}
                                textAlignVertical="top"
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
                    </View>
                )}

                {!isAddingLesson && (
                    userSubmittedLessons.length > 0 ? (
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
                    )
                )}
            </KeyboardAvoidingView>
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
    formContainer: {
        margin: 8,
        maxHeight: 300,
    },
    quickSubmitForm: {
        padding: 8,
        borderRadius: 8,
        gap: 8,
    },
    formTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 4,
    },
    input: {
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 6,
        fontSize: 12,
    },
    textArea: {
        minHeight: 120,
        textAlignVertical: 'top',
        paddingTop: 8,
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
    // Full screen styles
    fullScreenHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#A1CEDC',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backText: {
        marginLeft: 8,
        fontSize: 16,
    },
    scrollView: {
        flex: 1,
    },
    fullScreenContent: {
        padding: 16,
    },
    fullScreenTitle: {
        fontSize: 24,
        marginBottom: 8,
    },
    fullScreenSubmitter: {
        marginBottom: 16,
        fontSize: 14,
        opacity: 0.7,
    },
    fullScreenAnecdoteContainer: {
        padding: 16,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
    },
    fullScreenAnecdote: {
        fontSize: 16,
        lineHeight: 24,
    },
    debugText: {
        marginTop: 20,
        fontSize: 12,
        color: '#666',
        backgroundColor: 'rgba(0,0,0,0.05)',
        padding: 10,
        borderRadius: 4,
    }
}); 