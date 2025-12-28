import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CodeSnippetModalProps {
    visible: boolean;
    onClose: () => void;
    onSend: (code: string, language?: string) => void;
}

export default function CodeSnippetModal({ visible, onClose, onSend }: CodeSnippetModalProps) {
    const [code, setCode] = useState('');

    const handleSend = () => {
        if (code.trim()) {
            onSend(code);
            setCode('');
            onClose();
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <Text style={styles.title}>New Snippet</Text>
                        <TouchableOpacity
                            onPress={handleSend}
                            disabled={!code.trim()}
                            style={[styles.sendButton, !code.trim() && styles.disabledButton]}
                        >
                            <Text style={[styles.sendText, !code.trim() && styles.disabledText]}>Share</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.editorContainer}>
                        <TextInput
                            style={styles.input}
                            multiline
                            autoFocus
                            placeholder="// Type or paste your code here..."
                            placeholderTextColor="#64748b"
                            value={code}
                            onChangeText={setCode}
                            textAlignVertical="top"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>
                </SafeAreaView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0514',
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    closeButton: {
        padding: 8,
        marginLeft: -8,
    },
    cancelText: {
        color: '#94a3b8',
        fontSize: 15,
    },
    sendButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#6366f1',
        borderRadius: 20,
    },
    sendText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    disabledButton: {
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
    },
    disabledText: {
        color: 'rgba(255, 255, 255, 0.3)',
    },
    editorContainer: {
        flex: 1,
        padding: 16,
    },
    input: {
        flex: 1,
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
        fontSize: 14,
        color: '#e2e8f0',
        lineHeight: 20,
    },
});
