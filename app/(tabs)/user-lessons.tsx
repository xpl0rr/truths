import React from 'react';
import { StyleSheet, FlatList, SafeAreaView, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LessonCard } from '@/components/LessonCard';
import { useLessons } from '../store/LessonStore';

export default function UserLessonsScreen() {
    // In a real app, we would get the userId from auth
    const userId = 'user123';
    const { voteLesson, getUserSubmittedLessons, currentThreshold } = useLessons();

    // Get user-submitted lessons that aren't approved yet
    const userSubmittedLessons = getUserSubmittedLessons();

    const handleVote = (lessonId: string, userId: string, voteType: 'up' | 'down' | null) => {
        voteLesson(lessonId, userId, voteType);
    };

    const renderLessonCard = ({ item }: { item: typeof userSubmittedLessons[0] }) => (
        <LessonCard
            lesson={item}
            userId={userId}
            onVote={handleVote}
        />
    );

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