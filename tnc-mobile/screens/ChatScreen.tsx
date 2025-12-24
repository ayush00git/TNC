import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet, Text, View, TextInput, TouchableOpacity,
    SafeAreaView, Platform, FlatList, Image, StatusBar, Keyboard, Animated, ActivityIndicator
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AttachmentModal from '../components/AttachmentModal';
import CodeSnippetModal from '../components/CodeSnippetModal';
import MembersModal from '../components/MembersModal';
import client from '../services/client'; // Import client
import { Message, User } from '../types'; // Import types
import { useToast } from '../context/ToastContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ChatScreen({ navigation, route }: any) {
    const { roomTitle, roomId } = route.params || { roomTitle: "Room", roomId: "" };

    const [text, setText] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [showAttachmentModal, setShowAttachmentModal] = useState(false);
    const [showCodeModal, setShowCodeModal] = useState(false);
    const [showMembersModal, setShowMembersModal] = useState(false);
    const flatListRef = useRef<FlatList>(null);
    const keyboardHeight = useRef(new Animated.Value(0)).current;

    const [members, setMembers] = useState<any[]>([]); // Use appropriate type or import Member

    // Polling interval ref
    const pollingRef = useRef<NodeJS.Timeout | null>(null);

    const fetchRoomInfo = async () => {
        try {
            const response = await client.get(`/api/room/${roomId}`);
            if (response.data && response.data.room && response.data.room.members) {
                // Map backend users to MembersModal format
                const mappedMembers = response.data.room.members.map((m: any) => ({
                    id: m._id,
                    name: m.name,
                    avatar: m.avatar || `https://api.dicebear.com/7.x/initials/png?seed=${m.name}`
                }));
                setMembers(mappedMembers);
            }
        } catch (error) {
            console.error("Error fetching room info:", error);
        }
    };


    // Get current user from storage/context
    useEffect(() => {
        const loadUser = async () => {
            try {
                // Here we should actually decode the token or fetch user profile
                // For now, we rely on the backend being stateless or efficient
                const storedToken = await AsyncStorage.getItem('token');
                // Potential TODO: Decode token to get user ID if needed immediately
            } catch (e) { }
        };
        loadUser();
    }, []);

    // Keyboard handling
    useEffect(() => {
        const showSubscription = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            (e) => {
                Animated.timing(keyboardHeight, {
                    duration: Platform.OS === 'ios' ? e.duration : 250,
                    toValue: e.endCoordinates.height - (Platform.OS === 'ios' ? 34 : 0),
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



    // Fetch Messages
    const fetchMessages = async () => {
        try {
            const response = await client.get(`/api/chat/chat-history/${roomId}`);
            // Backend returns array of messages
            setMessages(response.data);
        } catch (error) {
            console.error("Error fetching chat:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (showMembersModal) {
            fetchRoomInfo();
        }
    }, [showMembersModal, roomId]);

    useEffect(() => {
        fetchMessages();
        // Poll every 3 seconds for new messages
        pollingRef.current = setInterval(fetchMessages, 3000);
        return () => {
            if (pollingRef.current) clearInterval(pollingRef.current);
        };
    }, [roomId]);

    const handleSend = async () => {
        if (!text.trim()) return;

        try {
            // Optimistic update? Maybe risky without real ID.
            // Let's just send and let polling/response update it.
            await client.post(`/api/chat/${roomId}`, { text });
            setText('');
            fetchMessages(); // Immediate refresh
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    // Render a single message item
    const renderItem = ({ item, index }: { item: Message; index: number }) => {
        // Check if message is from current user
        const isMe = (currentUser && item.sender) ? item.sender._id === currentUser._id : false;

        const prevMessage = messages[index - 1];
        const isSequence = prevMessage && prevMessage.sender && item.sender && prevMessage.sender._id === item.sender._id;

        return (
            <View style={[styles.messageRow, isSequence && styles.sequenceRow]}>
                {/* Avatar */}
                <View style={styles.avatarContainer}>
                    {!isSequence && (
                        <Image
                            source={{ uri: item.sender?.avatar || `https://api.dicebear.com/7.x/initials/png?seed=${item.sender?.name || 'Unknown'}` }}
                            style={styles.avatar}
                        />
                    )}
                </View>

                {/* Content */}
                <View style={styles.messageContent}>
                    {!isSequence && (
                        <View style={styles.messageHeader}>
                            <Text style={[styles.userName, isMe && styles.myUserName]}>
                                {item.sender?.name || "Unknown User"}
                            </Text>
                            <Text style={styles.timestamp}>
                                {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                        </View>
                    )}
                    {item.imageURL && item.imageURL.trim() ? (
                        <Image
                            source={{ uri: item.imageURL }}
                            style={styles.messageImage}
                            resizeMode="cover"
                        />
                    ) : (
                        <Text style={styles.messageText}>{item.text}</Text>
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
                {loading ? (
                    <View style={styles.center}>
                        <ActivityIndicator size="small" color="#6366f1" />
                    </View>
                ) : (
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        renderItem={renderItem}
                        keyExtractor={item => item._id}
                        contentContainerStyle={styles.listContent}
                        style={styles.list}
                        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                        ListEmptyComponent={
                            <Text style={{ color: '#64748b', textAlign: 'center', marginTop: 20 }}>No messages yet. Say hi!</Text>
                        }
                    />
                )}
            </SafeAreaView>

            {/* Input Area */}
            <Animated.View style={[styles.inputContainer, { bottom: keyboardHeight }]}>
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
                        style={[styles.sendButton, text.trim() ? styles.sendButtonActive : {}]} // Fixed type error with null/undefined checking
                        onPress={handleSend}
                        disabled={!text.trim()}
                    >
                        <Ionicons name="send" size={18} color={text.trim() ? "#fff" : "#64748b"} />
                    </TouchableOpacity>
                </View>
            </Animated.View>

            {/* Modals - Keep existing implementations */}
            <AttachmentModal
                visible={showAttachmentModal}
                onClose={() => setShowAttachmentModal(false)}
                onSelectImage={async () => { /* Implement Image Upload Logic Later */ setShowAttachmentModal(false); }}
                onSelectCode={() => { setShowAttachmentModal(false); setShowCodeModal(true); }}
            />

            <CodeSnippetModal
                visible={showCodeModal}
                onClose={() => setShowCodeModal(false)}
                onSend={(code) => {
                    /* Handle Code Send - Treat as text for now or extend API */
                    client.post(`/api/chat/${roomId}`, { text: code });
                    setShowCodeModal(false);
                    fetchMessages();
                }}
            />

            <MembersModal
                visible={showMembersModal}
                onClose={() => setShowMembersModal(false)}
                roomTitle={roomTitle}
                members={members}
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
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // ... [Previous styles remain mostly same, adding missing ones if any] ...
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
    list: {
        flex: 1,
    },
    listContent: {
        paddingVertical: 16,
        paddingHorizontal: 16,
        paddingBottom: 100,
    },
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
    inputContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#060010',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
        paddingBottom: Platform.OS === 'ios' ? 64 : 50,
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