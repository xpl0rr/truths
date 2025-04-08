import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Text, SafeAreaView, Dimensions } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { Lesson } from '@/app/models/Lesson';

interface FullScreenLessonProps {
    lesson: Lesson;
    onClose: () => void;
}

export function FullScreenLesson({ lesson, onClose }: FullScreenLessonProps) {
    const scrollViewRef = useRef(null);

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
                    <AntDesign name="arrowleft" size={24} color="#000" />
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                ref={scrollViewRef}
                style={styles.scrollView}
                contentContainerStyle={[styles.scrollContent, { minHeight: windowHeight * 0.7 }]}
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
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#A1CEDC',
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
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 40,
    },
    content: {
        padding: 16,
    },
    titleText: {
        fontSize: 24,
        marginBottom: 8,
    },
    submittedBy: {
        marginBottom: 16,
        fontSize: 14,
        opacity: 0.7,
    },
    anecdoteContainer: {
        padding: 16,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
    },
    anecdoteText: {
        fontSize: 16,
        lineHeight: 24,
    },
    debugInfo: {
        marginTop: 20,
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 4,
    },
    debugText: {
        fontSize: 12,
        color: '#666',
    }
}); 