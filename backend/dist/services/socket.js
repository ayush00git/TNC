"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketSetup = void 0;
const socketSetup = (io) => {
    io.on('connection', (socket) => {
        console.log(`User connected ${socket.id}`);
        socket.on('join_room', (room) => {
            socket.join(room);
            console.log(`User ${socket.id} joined ${room}`);
        });
        socket.on('send_message', async (data) => {
            console.log(`Message recieved: ${data}`);
        });
        socket.on('disconnect', () => {
            console.log(`${socket.id} connection closed`);
        });
    });
};
exports.socketSetup = socketSetup;
