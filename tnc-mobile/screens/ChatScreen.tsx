import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet, Text, View, TextInput, TouchableOpacity,
    SafeAreaView, Platform, FlatList, Image, StatusBar, Keyboard, Animated, Modal
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AttachmentModal from '../components/AttachmentModal';
import CodeSnippetModal from '../components/CodeSnippetModal';
import MembersModal from '../components/MembersModal';

// Mock Data Types
interface Message {
    id: string;
    userId: number;
    content: string;
    timestamp: string;
    type?: 'text' | 'image' | 'code';
    imageUrl?: string;
}

interface User {
    id: number;
    name: string;
    avatar: string;
}

// Mock Data
const CURRENT_USER = { id: 99, name: "Alex Dev", avatar: "https://api.dicebear.com/7.x/avataaars/png?seed=Alex" };
const OTHER_USER = { id: 1, name: "Sarah Chen", avatar: "https://api.dicebear.com/7.x/avataaars/png?seed=Sarah" };

const INITIAL_MESSAGES: Message[] = [
    { id: '1', userId: 1, content: "Has anyone deployed the new smart contract to Sepolia testnet yet?", timestamp: "10:42 AM" },
    { id: '2', userId: 99, content: "I'm working on it. The gas optimization check failed.", timestamp: "10:44 AM" },
    { id: '3', userId: 1, content: "Classic reentrancy guard issue?", timestamp: "10:45 AM" },
    { id: '4', userId: 99, content: "Nah, just inefficient storage mapping. Fixing it now.", timestamp: "10:45 AM" },
    { id: '5', userId: 99, content: "Give me 15 mins.", timestamp: "10:46 AM" },
];

export default function ChatScreen({ navigation, route }: any) {
    const roomTitle = route.params?.roomTitle || "Blockchain";

    const [text, setText] = useState('');
    const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
    const [showAttachmentModal, setShowAttachmentModal] = useState(false);
    const [showCodeModal, setShowCodeModal] = useState(false);
    const [showMembersModal, setShowMembersModal] = useState(false);
    const flatListRef = useRef<FlatList>(null);
    const keyboardHeight = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const showSubscription = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            (e) => {
                // Move input container to sit ON TOP of keyboard, not just at keyboard level
                Animated.timing(keyboardHeight, {
                    duration: Platform.OS === 'ios' ? e.duration : 250,
                    toValue: e.endCoordinates.height - (Platform.OS === 'ios' ? 34 : 0), // Subtract safe area offset
                    useNativeDriver: false,
                }).start();
            }
        );

        const hideSubscription = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            (e) => {
                Animated.timing(keyboardHeight, {
                    duration: Platform.OS === 'ios' ? e.duration : 250,
                    toValue: 0,
                    useNativeDriver: false,
                }).start();
            }
        );

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    const handleSend = () => {
        if (!text.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            userId: CURRENT_USER.id,
            content: text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages([...messages, newMessage]);
        setText('');

        // Scroll to bottom after sending
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    // Render a single message item
    const renderItem = ({ item, index }: { item: Message; index: number }) => {
        const isMe = item.userId === CURRENT_USER.id;
        const user = isMe ? CURRENT_USER : OTHER_USER;

        // Check if previous message was from same user to group them visually
        const prevMessage = messages[index - 1];
        const isSequence = prevMessage && prevMessage.userId === item.userId;

        return (
            <View style={[styles.messageRow, isSequence && styles.sequenceRow]}>
                {/* Avatar (only show if not sequential) */}
                <View style={styles.avatarContainer}>
                    {!isSequence && (
                        <Image
                            source={{ uri: user.avatar }}
                            style={styles.avatar}
                        />
                    )}
                </View>

                {/* Message Content */}
                <View style={styles.messageContent}>
                    {!isSequence && (
                        <View style={styles.messageHeader}>
                            <Text style={[styles.userName, isMe && styles.myUserName]}>
                                {user.name}
                            </Text>
                            <Text style={styles.timestamp}>{item.timestamp}</Text>
                        </View>
                    )}
                    {item.type === 'image' && item.imageUrl ? (
                        <Image
                            source={{ uri: item.imageUrl }}
                            style={styles.messageImage}
                            resizeMode="cover"
                        />
                    ) : item.type === 'code' ? (
                        <View style={styles.codeBlock}>
                            <Text style={styles.codeText}>{item.content}</Text>
                        </View>
                    ) : (
                        <Text style={styles.messageText}>{item.content}</Text>
                    )}
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={24} color="#cbd5e1" />
                    </TouchableOpacity>

                    <View style={styles.headerInfo}>
                        <View style={styles.roomIcon}>
                            <Feather name="hash" size={16} color="#94a3b8" />
                        </View>
                        <Text style={styles.headerTitle}>{roomTitle}</Text>
                    </View>

                    <TouchableOpacity style={styles.headerAction} onPress={() => setShowMembersModal(true)}>
                        <Feather name="users" size={20} color="#cbd5e1" />
                    </TouchableOpacity>
                </View>

                {/* Message List */}
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    style={styles.list}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                />
            </SafeAreaView>

            {/* Input Area - Moves with keyboard, attached to it */}
            <Animated.View
                style={[
                    styles.inputContainer,
                    {
                        bottom: keyboardHeight
                    }
                ]}
            >
                <View style={styles.inputWrapper}>
                    <TouchableOpacity
                        style={styles.attachButton}
                        onPress={() => setShowAttachmentModal(true)}
                    >
                        <Feather name="plus" size={24} color="#64748b" />
                    </TouchableOpacity>

                    <TextInput
                        style={styles.input}
                        value={text}
                        onChangeText={setText}
                        placeholder={`Message #${roomTitle}`}
                        placeholderTextColor="#64748b"
                        multiline
                    />

                    <TouchableOpacity
                        style={[styles.sendButton, text.trim() && styles.sendButtonActive]}
                        onPress={handleSend}
                        disabled={!text.trim()}
                    >
                        <Ionicons name="send" size={18} color={text.trim() ? "#fff" : "#64748b"} />
                    </TouchableOpacity>
                </View>
            </Animated.View>

            <AttachmentModal
                visible={showAttachmentModal}
                onClose={() => setShowAttachmentModal(false)}
                onSelectImage={async () => {
                    setShowAttachmentModal(false);
                    const result = await ImagePicker.launchImageLibraryAsync({
                        mediaTypes: ImagePicker.MediaTypeOptions.Images,
                        allowsEditing: true,
                        aspect: [4, 3],
                        quality: 1,
                    });

                    if (!result.canceled) {
                        const newMessage: Message = {
                            id: Date.now().toString(),
                            userId: CURRENT_USER.id,
                            content: 'Sent an image',
                            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            type: 'image',
                            imageUrl: result.assets[0].uri
                        };
                        setMessages(prev => [...prev, newMessage]);
                        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
                    }
                }}
                onSelectCode={() => {
                    setShowAttachmentModal(false);
                    setShowCodeModal(true);
                }}
            />

            <CodeSnippetModal
                visible={showCodeModal}
                onClose={() => setShowCodeModal(false)}
                onSend={(code) => {
                    const newMessage: Message = {
                        id: Date.now().toString(),
                        userId: CURRENT_USER.id,
                        content: code,
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        type: 'code'
                    };
                    setMessages(prev => [...prev, newMessage]);
                    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
                }}
            />

            <MembersModal
                visible={showMembersModal}
                onClose={() => setShowMembersModal(false)}
                roomTitle={roomTitle}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#060010',
    },
    safeArea: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    messageImage: {
        width: 200,
        height: 150,
        borderRadius: 12,
        marginTop: 4,
    },
    codeBlock: {
        backgroundColor: '#0f0f12',
        padding: 12,
        borderRadius: 8,
        marginTop: 4,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    codeText: {
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
        fontSize: 13,
        color: '#a5b4fc',
    },
    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
        backgroundColor: '#060010',
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    headerInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 24,
    },
    roomIcon: {
        marginRight: 6,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    headerAction: {
        padding: 8,
    },
    // List
    list: {
        flex: 1,
    },
    listContent: {
        paddingVertical: 16,
        paddingHorizontal: 16,
        paddingBottom: 100, // Extra padding to prevent overlap with input
    },
    // Message Item
    messageRow: {
        flexDirection: 'row',
        marginBottom: 30,
    },
    sequenceRow: {
        marginBottom: 15,
        marginTop: -10,
    },
    avatarContainer: {
        width: 40,
        marginRight: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#1e1b4b',
    },
    messageContent: {
        flex: 1,
    },
    messageHeader: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 4,
    },
    userName: {
        color: '#cbd5e1',
        fontWeight: '600',
        fontSize: 15,
        marginRight: 8,
    },
    myUserName: {
        color: '#818cf8',
    },
    timestamp: {
        color: '#64748b',
        fontSize: 11,
    },
    messageText: {
        color: '#e2e8f0',
        fontSize: 15,
        lineHeight: 22,
    },
    // Input - Positioned absolutely, moves with keyboard
    inputContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0, // Will be animated with keyboardHeight
        backgroundColor: '#060010',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
        paddingBottom: Platform.OS === 'ios' ? 64 : 50, // Raised from bottom - safe area for home indicator/nav buttons
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 12,
        paddingTop: 12,
        paddingBottom: 8,
    },
    attachButton: {
        padding: 10,
        marginRight: 8,
    },
    input: {
        flex: 1,
        backgroundColor: '#0A0514',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20,
        color: '#fff',
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 10,
        maxHeight: 100,
        fontSize: 15,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#1A1625',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    sendButtonActive: {
        backgroundColor: '#4f46e5',
    },
});