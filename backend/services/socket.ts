import { Server, Socket } from "socket.io";
import Chat from "../models/chat";

interface sendMessagePayload {
    sender: string,
    room: string,
    text: string,
    imageURL: string,
}

export const socketSetup = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        console.log(`User connected ${socket.id}`)

        socket.on('join_room', (data: { room: string; userId?: string }) => {
            const room = typeof data === 'string' ? data : data.room;
            socket.join(room);

            // Store userId on socket for notification filtering
            if (typeof data === 'object' && data.userId) {
                (socket as any).userId = data.userId;
            }

            console.log(`User ${socket.id} (userId: ${(socket as any).userId || 'unknown'}) joined ${room}`);
        })

        socket.on('send_message', async (data: sendMessagePayload) => {
            console.log(`Message recieved: ${data}`);
        });

        socket.on('disconnect', () => {
            console.log(`${socket.id} connection closed`);
        })
    })
}