import React, { useState } from 'react';
import { StyleSheet, FlatList, SafeAreaView, View, Text } from 'react-native';
import LessonCard from '@/components/LessonCard';
import { useLessons } from '@/store/lessonStore';

export default function CommunityScreen() {
    const userId = 'user123';
    const userName = 'Jane Doe';
    const { voteLesson, getUserSubmittedLessons } = useLessons();
    const [selectedLesson, setSelectedLesson] = useState(null);

    const unapprovedLessons = getUserSubmittedLessons();

    const handleVote = (lessonId: string, userId: string, voteType: 'up' | 'down' | null) => {
        voteLesson(lessonId, userId, voteType);
    };

    const handleOpenLesson = (lesson: any) => {
        setSelectedLesson(lesson);
    };

    const handleCloseLesson = () => {
        setSelectedLesson(null);
    };

    const renderLessonCard = ({ item }: { item: any }) => (
        <LessonCard
            lesson={item}
            userId={userId}
            onVote={handleVote}
            onSelect={handleOpenLesson}
        />
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Community Truths</Text>
            {unapprovedLessons.length > 0 ? (
                <FlatList
                    data={unapprovedLessons}
                    renderItem={renderLessonCard}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                />
            ) : (
                <View style={styles.empty}>
                    <Text style={styles.emptyText}>No unapproved truths yet.</Text>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        paddingVertical: 12,
        color: '#111',
    },
    list: {
        paddingHorizontal: 12,
    },
    empty: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 13,
        color: '#666',
    },
});