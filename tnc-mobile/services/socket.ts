import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;
const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://13.202.26.208:8000";

export const initSocket = (): Socket => {
    if (!socket) {
        console.log("Initializing socket connection to:", API_URL);
        socket = io(API_URL, {
            transports: ['websocket'], // explicit transport often helps in RN
        });

        socket.on('connect', () => {
            console.log('Socket connected:', socket?.id);
        });

        socket.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
        });

        socket.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
        });
    }
    return socket;
};

export const getSocket = (): Socket | null => {
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
