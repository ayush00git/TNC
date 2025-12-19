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

        socket.on('join_room', (room: string) => {
            socket.join(room);
            console.log(`User ${socket.id} joined ${room}`);
        })

        socket.on('send_message', async (data: sendMessagePayload) => {
            console.log(`Message recieved: ${data}`);
        });

        socket.on('disconnect', () => {
            console.log(`${socket.id} connection closed`);
        })
    })
}