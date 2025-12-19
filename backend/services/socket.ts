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
            console.log(`User ${socket.id} joined ${room}`);
        })
        
        socket.on('send_message', async (data: sendMessagePayload) => {
            console.log(`Message recieved: ${data}`);
            try {
                const newMessage = await Chat.create({
                sender: data.sender,
                room: data.room,
                text: data.text,
                imageURL: data.imageURL,
            })
                await newMessage.populate("sender", "name");
                io.to(data.room).emit(`received_message: ${newMessage}`);
            } catch (error) {
                console.log(`${error}`);
                throw new Error(`While saving the message to db`);
            }
        });
        socket.on('disconnect', () => {
            console.log(`${socket.id} connection closed`);
        })
    })
}