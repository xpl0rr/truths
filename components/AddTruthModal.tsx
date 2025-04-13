import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';

export default function AddTruthModal({ visible, onClose, onSubmit }) {
    const [title, setTitle] = useState('');
    const [anecdote, setAnecdote] = useState('');

    const handleSave = () => {
        if (title.trim() && anecdote.trim()) {
            onSubmit({ title: title.trim(), anecdote: anecdote.trim() });
            setTitle('');
            setAnecdote('');
            onClose();
        }
    };

    return (
        <Modal visible={visible} animationType="slide">
            <KeyboardAvoidingView
                style={styles.safe}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <View style={styles.container}>
                    <Text style={styles.title}>New Truth</Text>

                    <TextInput
                        placeholder="Title"
                        style={styles.titleInput}
                        value={title}
                        onChangeText={setTitle}
                        multiline
                        numberOfLines={2}
                        textAlignVertical="top"
                    />

                    <ScrollView contentContainerStyle={styles.scroll}>
                        <TextInput
                            placeholder="Anecdote"
                            style={styles.anecdoteInput}
                            value={anecdote}
                            onChangeText={setAnecdote}
                            multiline
                            textAlignVertical="top"
                        />
                    </ScrollView>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity onPress={handleSave}>
                            <Text style={styles.button}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.button}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 12,
    },
    titleInput: {
        backgroundColor: '#f9f9f9',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        color: '#000',
        height: 60,
        marginBottom: 12,
    },
    scroll: {
        flexGrow: 1,
    },
    anecdoteInput: {
        backgroundColor: '#f9f9f9',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        color: '#000',
        minHeight: 240,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 20,
    },
    button: {
        color: '#007aff',
        fontSize: 16,
        fontWeight: '500',
    },
});