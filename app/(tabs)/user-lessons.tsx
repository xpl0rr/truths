import React, { useState } from 'react';
import {
    StyleSheet,
    FlatList,
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import textStyles from '../styles/textStyles';
import LessonCard from '@/components/LessonCard';
import { useLessons, useHydrateLessons } from '@/store/lessonStore-persist';
import AddTruthModal from '../components/AddTruthModal';
import FullScreenLesson from '@/components/FullScreenLesson';

export default function CommunityScreen() {
    const hydrated = useHydrateLessons();
    if (!hydrated) return null;
    const userId = 'user123';
    const userName = 'Jane Doe';
    const {
        getUserSubmittedLessons,
        addLesson,
        voteLesson
    } = useLessons();

    const [selectedLesson, setSelectedLesson] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);

    const unapprovedLessons = getUserSubmittedLessons();

    const handleVote = (
        lessonId: string,
        userId: string,
        voteType: 'up' | 'down' | null
    ) => {
        voteLesson(lessonId, userId, voteType);
    };

    const handleOpenLesson = (lesson: any) => {
        setSelectedLesson(lesson);
    };

    const handleCloseLesson = () => {
        setSelectedLesson(null);
    };

    const handleAddNew = (input: { lesson: string; anecdote: string }) => {
    console.log('[Community handleAddNew] received:', input);
        const newId = Date.now().toString();
        addLesson({ ...input, id: newId, isUserSubmitted: true });
        setShowAddModal(false);
    };

    const renderLessonCard = ({ item }: { item: any }) => (
        <LessonCard
            lesson={item}
            userId={userId}
            onVote={handleVote}
            onSelect={handleOpenLesson}
        />
    );

    if (selectedLesson) {
        return (
            <FullScreenLesson
                lesson={selectedLesson}
                onClose={handleCloseLesson}
                userId={userId}
                userName={userName}
                isAdmin={false}
            />
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.lesson}>Community Truths</Text>

            <TouchableOpacity onPress={() => setShowAddModal(true)}>
                <Text style={styles.addButton}>+ Add Your Truth</Text>
            </TouchableOpacity>

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

            <AddTruthModal
                visible={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSubmit={(input: { lesson: string; anecdote: string }) => {
                    console.log('[AddTruthModal onSubmit] received:', input);
                    if (!input.lesson || !input.lesson.trim()) {
                        alert('Lesson is required!');
                        return;
                    }
                    handleAddNew(input);
                }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    lesson: {
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
    addButton: {
        color: '#007aff',
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 20,
        textAlign: 'center',
    },
});