import { useEffect, useRef } from 'react';
import { socket } from '../services/socket';
import { useBrowserNotifications } from './useBrowserNotifications';
import { useNotificationSound } from './useNotificationSound';

interface UserRoom {
    _id: string;
    title: string;
    roomId: string;
}

export function useGlobalNotifications(userId: string | null) {
    const { showNotification, requestPermission } = useBrowserNotifications();
    const { playSound } = useNotificationSound();
    const userRoomsRef = useRef<UserRoom[]>([]);
    const currentRoomRef = useRef<string | null>(null);

    // Set current room (to avoid notifying when user is actively in that room)
    const setCurrentRoom = (roomId: string | null) => {
        currentRoomRef.current = roomId;
    };

    useEffect(() => {
        if (!userId) return;

        // Request notification permission
        requestPermission();

        // Fetch user's rooms and join them via socket
        const fetchAndJoinRooms = async () => {
            try {
                const response = await fetch('/api/room/joined', {
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    const rooms: UserRoom[] = data.rooms;
                    userRoomsRef.current = rooms;

                    // Connect socket if not already connected
                    if (!socket.connected) {
                        socket.connect();
                    }

                    // Join all user's rooms
                    rooms.forEach((room) => {
                        socket.emit('join_room', { room: room._id, userId });
                    });

                    console.log(`[Global Notifications] Joined ${rooms.length} rooms`);
                }
            } catch (error) {
                console.error('[Global Notifications] Failed to fetch rooms:', error);
            }
        };

        fetchAndJoinRooms();

        // Listen for messages from ALL rooms
        const handleGlobalMessage = (message: any) => {
            const senderId = message.sender?._id || message.sender;
            const roomId = message.room;

            // Don't notify if:
            // 1. Message is from current user
            // 2. User is currently viewing this room
            if (senderId === userId || roomId === currentRoomRef.current) {
                return;
            }

            // Find room info
            const room = userRoomsRef.current.find((r) => r._id === roomId);
            const roomTitle = room?.title || 'Chat';
            const senderName = message.sender?.name || 'Someone';
            const messageText = message.text || 'Sent an image';

            // Play sound
            playSound();

            // Show browser notification
            showNotification(`${senderName} in #${roomTitle}`, {
                body: messageText,
                icon: '/tnc-logo.png',
                tag: roomId,
                data: { roomId, roomTitle },
            });
        };

        socket.on('receive_message', handleGlobalMessage);
        socket.on('received_message', handleGlobalMessage);

        return () => {
            socket.off('receive_message', handleGlobalMessage);
            socket.off('received_message', handleGlobalMessage);
        };
    }, [userId, showNotification, playSound, requestPermission]);

    return { setCurrentRoom };
}
