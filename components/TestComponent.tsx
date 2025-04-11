import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function TestComponent() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                TEST COMPONENT - IF YOU CAN SEE THIS, CHANGES ARE WORKING
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'red',
        padding: 20,
        margin: 10,
        borderRadius: 10,
    },
    text: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },
}); 