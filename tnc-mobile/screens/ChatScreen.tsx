import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet, Text, View, TextInput, TouchableOpacity,
    SafeAreaView, Platform, FlatList, Image, StatusBar, Keyboard, Animated, ActivityIndicator
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Socket } from 'socket.io-client';
import { jwtDecode } from "jwt-decode";
import { initSocket, disconnectSocket } from '../services/socket';
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
    const [isSending, setIsSending] = useState(false); // New state to prevent duplicates
    const [socketConnected, setSocketConnected] = useState(false); // Connection status
    const [roomMongoId, setRoomMongoId] = useState<string | null>(null); // Store actual _id for chat checks
    const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
    const flatListRef = useRef<FlatList>(null);
    const keyboardHeight = useRef(new Animated.Value(0)).current;

    const [members, setMembers] = useState<any[]>([]); // Use appropriate type or import Member

    const socketRef = useRef<Socket | null>(null);
    const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://13.202.26.208:8000"; // Fallback or env

    const fetchRoomInfo = async () => {
        try {
            const response = await client.get(`/api/room/${roomId}`);
            // Backend returns { room: [...] } because it uses Room.find()
            const roomData = Array.isArray(response.data.room) ? response.data.room[0] : response.data.room;

            if (roomData) {
                // Set the Mongo ID for chat operations
                if (roomData._id) {
                    setRoomMongoId(roomData._id);
                }

                if (roomData.members) {
                    // Map backend users to MembersModal format
                    const mappedMembers = roomData.members.map((m: any) => ({
                        id: m._id,
                        name: m.name,
                        avatar: m.avatar || `https://api.dicebear.com/7.x/initials/png?seed=${m.name}`
                    }));
                    setMembers(mappedMembers);
                }
            }
        } catch (error) {
            console.error("Error fetching room info:", error);
        }
    };


    // Get current user from storage/context
    useEffect(() => {
        const loadUser = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('token');
                if (storedToken) {
                    const decoded: any = jwtDecode(storedToken);
                    // Ensure the decoded token has the fields we need, or map them
                    setCurrentUser({
                        _id: decoded._id || decoded.id, // Handle potential field mismatch
                        name: decoded.name,
                        email: decoded.email,
                        avatar: decoded.avatar // Might be undefined
                    });
                }
            } catch (e) {
                console.error("Failed to load user from token", e);
            }
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
        if (!roomMongoId) return; // Need actual _id for chat
        try {
            const response = await client.get(`/api/chat/chat-history/${roomMongoId}`);
            // Backend returns array of messages
            setMessages(response.data);
        } catch (error) {
            console.error("Error fetching chat:", error);
        } finally {
            setLoading(false);
        }
    };

    // Initial load: Fetch room info to get _id
    useEffect(() => {
        fetchRoomInfo();
    }, [roomId]);

    useEffect(() => {
        if (roomMongoId && currentUser) {
            fetchMessages();

            // Socket Connection
            console.log("ChatScreen: Initializing socket for room:", roomMongoId);
            socketRef.current = initSocket();

            // Monitor connection status
            socketRef.current.on('connect', () => {
                console.log("ChatScreen: Socket connected successfully");
                setSocketConnected(true);
            });
            socketRef.current.on('disconnect', () => {
                console.log("ChatScreen: Socket disconnected");
                setSocketConnected(false);
            });

            socketRef.current.emit("join_room", roomMongoId);



            socketRef.current.on("receive_message", (newMessage: Message) => {
                // Ignore if from self (handled by optimistic/API response)
                const senderId = typeof newMessage.sender === 'string'
                    ? newMessage.sender
                    : newMessage.sender._id;

                if (String(senderId) === String(currentUser._id)) return;

                setMessages((prevMessages) => {
                    // Critical Dedup: Check if ID already exists
                    if (prevMessages.some(m => m._id === newMessage._id)) {
                        return prevMessages;
                    }
                    return [...prevMessages, newMessage];
                });
            });

            return () => {
                disconnectSocket();
            };
        }
    }, [roomMongoId, currentUser]); // Re-run if user or room changes

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0]);
            setShowAttachmentModal(false);
        }
    };

    const handleSend = async () => {
        if (!text.trim() && !selectedImage) return;
        if (isSending) return; // Guard against multiple clicks

        setIsSending(true);
        const tempId = Date.now().toString();
        const optimisticMessage: Message = {
            _id: tempId,
            text,
            sender: {
                _id: currentUser?._id || 'me',
                name: currentUser?.name || 'Me',
                email: currentUser?.email || '',
                avatar: currentUser?.avatar
            },
            room: roomMongoId!,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'sending',
            imageURL: selectedImage ? selectedImage.uri : undefined
        };

        // Add optimistic message
        setMessages(prev => [optimisticMessage, ...prev]);

        try {
            // Optimistic update? Maybe risky without real ID.
            // Let's just send and let polling/response update it.
            if (roomMongoId) {
                const formData = new FormData();
                if (text.trim()) formData.append('text', text);

                if (selectedImage) {
                    // React Native specific FormData structure
                    const file = {
                        uri: selectedImage.uri,
                        type: 'image/jpeg', // Default or infer
                        name: selectedImage.fileName || 'upload.jpg',
                    };
                    formData.append('image', file as any);
                }

                const response = await client.post(`/api/chat/${roomMongoId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                // Replace optimistic message with real one
                const realMessage = response.data;
                realMessage.status = 'sent';

                setMessages(prev => {
                    // Race condition check: Did socket already add this message?
                    const exists = prev.some(m => m._id === realMessage._id);
                    if (exists) {
                        // Socket beat us. Just remove the optimistic one.
                        return prev.filter(m => m._id !== tempId);
                    }
                    // Socket didn't add it (or we filtered it out). Update optimistic to real.
                    return prev.map(m => m._id === tempId ? realMessage : m);
                });

                setText('');
                setSelectedImage(null);
                // fetchMessages(); // No need to fetch immediately if we replaced it, let polling handle sync
                setTimeout(() => {
                    flatListRef.current?.scrollToEnd({ animated: true });
                }, 100);
            }
        } catch (error) {
            console.error("Error sending message:", error);
            // Mark as failed
            setMessages(prev => prev.map(m => m._id === tempId ? { ...m, status: 'failed' } : m));
        } finally {
            setIsSending(false);
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
                    {/* Status Indicator */}
                    {isMe && (
                        <View style={styles.statusContainer}>
                            {item.status === 'sending' ? (
                                <Feather name="more-horizontal" size={12} color="#818cf8" />
                            ) : item.status === 'failed' ? (
                                <Ionicons name="alert-circle" size={12} color="#ef4444" />
                            ) : (
                                // Default to sent if not sending/failed (existing messages are sent)
                                <Feather name="check" size={14} color="#4ade80" />
                            )}
                        </View>
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
                    <Animated.View style={{ flex: 1, marginBottom: keyboardHeight }}>
                        <FlatList
                            ref={flatListRef}
                            data={messages}
                            renderItem={renderItem}
                            keyExtractor={item => item._id}
                            contentContainerStyle={styles.listContent}
                            style={styles.list}
                            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                            onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })} // Scroll on layout change (keyboard)
                            ListEmptyComponent={
                                <Text style={{ color: '#64748b', textAlign: 'center', marginTop: 20 }}>No messages yet. Say hi!</Text>
                            }
                        />
                    </Animated.View>
                )}
            </SafeAreaView>

            {/* Input Area */}
            <Animated.View style={[styles.inputContainer, { bottom: keyboardHeight }]}>
                {selectedImage && (
                    <View style={styles.previewContainer}>
                        <Image source={{ uri: selectedImage.uri }} style={styles.previewImage} />
                        <TouchableOpacity
                            style={styles.removePreviewButton}
                            onPress={() => setSelectedImage(null)}
                        >
                            <Ionicons name="close-circle" size={24} color="#ef4444" />
                        </TouchableOpacity>
                    </View>
                )}
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
                        style={[
                            styles.sendButton,
                            ((text.trim() || selectedImage) && !isSending) ? styles.sendButtonActive : {}
                        ]}
                        onPress={handleSend}
                        disabled={(!text.trim() && !selectedImage) || isSending}
                    >
                        {isSending ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Ionicons name="send" size={18} color={text.trim() ? "#fff" : "#64748b"} />
                        )}
                    </TouchableOpacity>
                </View>
            </Animated.View>

            {/* Modals - Keep existing implementations */}
            <AttachmentModal
                visible={showAttachmentModal}
                onClose={() => setShowAttachmentModal(false)}
                onSelectImage={pickImage}
                onSelectCode={() => { setShowAttachmentModal(false); setShowCodeModal(true); }}
            />

            <CodeSnippetModal
                visible={showCodeModal}
                onClose={() => setShowCodeModal(false)}
                onSend={(code) => {
                    /* Handle Code Send - Treat as text for now or extend API */
                    if (roomMongoId) {
                        client.post(`/api/chat/${roomMongoId}`, { text: code });
                        setShowCodeModal(false);
                        fetchMessages();
                    }
                }}
            />

            <MembersModal
                visible={showMembersModal}
                onClose={() => setShowMembersModal(false)}
                roomTitle={roomTitle}
                members={members}
            />

            {/* Connection Status Indicator */}
            {!socketConnected && (
                <View style={{ position: 'absolute', top: 120, alignSelf: 'center', backgroundColor: 'rgba(239, 68, 68, 0.9)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, zIndex: 100 }}>
                    <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>Disconnected - Connecting...</Text>
                </View>
            )}
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
        marginBottom: 25,
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
    previewContainer: {
        paddingHorizontal: 16,
        paddingTop: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    previewImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 8,
    },
    removePreviewButton: {
        position: 'absolute',
        top: 0,
        left: 85,
    },
    statusContainer: {
        alignSelf: 'flex-end',
        marginTop: 4,
    }
});
