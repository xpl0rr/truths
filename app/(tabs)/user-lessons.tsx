import React, { useState } from 'react';
import {
    StyleSheet,
    FlatList,
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    Alert,
    ScrollView,
} from 'react-native';
import textStyles from '../styles/textStyles';
import LessonCard from '../../components/LessonCard';
import { useLessons } from '../../store/lessonStore';
import AddWisdomModal from '../components/AddWisdomModal';
import FullScreenLesson from '../../components/FullScreenLesson';

export default function CommunityScreen() {

    const userId = 'user123';
    const userName = 'Jane Doe';
    const {
        getAllLessons,
        voteLesson,
        addLesson
    } = useLessons();

    const [selectedLesson, setSelectedLesson] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);

    // Filter for user-submitted lessons
    const unapprovedLessons = getAllLessons().filter(l => l.isUserSubmitted && !l.isApproved);

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
        addLesson({
            id: newId,
            lesson: input.lesson,
            anecdote: input.anecdote,
            upvotes: 0,
            downvotes: 0,
            voters: {},
            createdAt: new Date(),
            userId,
            userName,
            isUserSubmitted: true,
            isApproved: false,
            approvalThreshold: 10,
            comments: [],
        });
        Alert.alert('Sent for approval');
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
        <SafeAreaView style={[styles.safe, { flex: 1, position: 'relative' }]}> 
            <View style={{ flex: 1, paddingBottom: 24 }}>
                <ScrollView contentContainerStyle={styles.container}>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={textStyles.title}>Community</Text>
                    </View>

                    <TouchableOpacity 
                        onPress={() => setShowAddModal(true)} 
                        style={{
                            marginTop: 20,
                            backgroundColor: '#f5f5f5',
                            paddingVertical: 8,
                            paddingHorizontal: 12,
                            borderRadius: 8,
                        }}
                    >
                        <Text style={{ fontSize: 16, fontWeight: 'normal', color: '#000', textAlign: 'center' }}>+ Add Your Wisdom</Text>
                    </TouchableOpacity>

                    {unapprovedLessons.length > 0 && (
                        <FlatList
                            data={unapprovedLessons}
                            renderItem={renderLessonCard}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={styles.list}
                        />
                    )}
                </ScrollView>

                <AddWisdomModal
                    visible={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    onSubmit={(input: { lesson: string; anecdote: string }) => {
                        console.log('[AddWisdomModal onSubmit] received:', input);
                        if (!input.lesson || !input.lesson.trim()) {
                            alert('Lesson is required!');
                            return;
                        }
                        handleAddNew(input);
                    }}
                />
                
                {selectedLesson && (
                    <FullScreenLesson
                        lesson={selectedLesson}
                        onClose={() => setSelectedLesson(null)}
                        userId={userId}
                        userName={userName}
                        isAdmin={false}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#fff' },
    container: { paddingHorizontal: 16, paddingBottom: 32 },
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
    addWisdomLink: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'normal',
        textAlign: 'center',
        marginVertical: 6,
    },
});