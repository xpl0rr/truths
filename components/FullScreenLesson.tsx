import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FullScreenLesson({
    lesson,
    onClose,
    userId,
    userName,
    isAdmin,
}) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onClose} style={styles.backButton}>
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                <Text style={styles.title}>{lesson.lesson}</Text>
                <Text style={styles.submitted}>Submitted by {userName}</Text>

                <View style={styles.anecdoteBox}>
                    <Text style={styles.anecdote}>
                        {lesson.anecdote || lesson.lesson}
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: '#A1CEDC',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backText: {
        marginLeft: 6,
        fontSize: 14,
        fontWeight: '500',
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 8,
        color: '#111',
    },
    submitted: {
        fontSize: 12,
        color: '#777',
        marginBottom: 16,
    },
    anecdoteBox: {
        padding: 14,
        backgroundColor: '#f2f2f2',
        borderRadius: 10,
    },
    anecdote: {
        fontSize: 15,
        lineHeight: 22,
        color: '#333',
    },
});