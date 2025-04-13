import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
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
            <View style={styles.container}>
                <Text style={styles.title}>New Truth</Text>
                <TextInput
                    placeholder="Title"
                    style={styles.input}
                    value={title}
                    onChangeText={setTitle}
                />
                <TextInput
                    placeholder="Anecdote"
                    style={[styles.input, styles.anecdote]}
                    value={anecdote}
                    onChangeText={setAnecdote}
                    multiline
                />
                <View style={styles.buttonRow}>
                    <TouchableOpacity onPress={handleSave}>
                        <Text style={styles.button}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onClose}>
                        <Text style={styles.button}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 16,
    },
    input: {
        backgroundColor: '#f9f9f9',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        fontSize: 14,
        color: '#000',
    },
    anecdote: {
        height: 120,
        textAlignVertical: 'top',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    button: {
        color: '#007aff',
        fontSize: 16,
        fontWeight: '500',
    },
});