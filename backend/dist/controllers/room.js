"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleJoinedRooms = exports.handleJoining = exports.handleRoomInfo = exports.handleCreateRoom = void 0;
const room_1 = __importDefault(require("../models/room"));
const handleCreateRoom = async (req, res) => {
    const { roomId, title, description } = req.body;
    if (!roomId || !title || !description) {
        return res.status(400).json({ message: "All the fields are required" });
    }
    try {
        const room = new room_1.default({
            roomId,
            title,
            description,
        });
        await room.save();
        return res.status(200).json({ message: "Room created successfully" });
    }
    catch (error) {
        console.log(`${error}`);
        throw new Error(`While creating a room`);
    }
};
exports.handleCreateRoom = handleCreateRoom;
const handleRoomInfo = async (req, res) => {
    const Id = req.params.roomId;
    try {
        const room = await room_1.default.find({ roomId: Id }).populate("members", "name email");
        return res.status(200).json({ room });
    }
    catch (error) {
        console.log(`${error}`);
        throw new Error(`While gathering the rooms info`);
    }
};
exports.handleRoomInfo = handleRoomInfo;
const handleJoining = async (req, res) => {
    const room_Id = req.params.roomId;
    const userId = req.user?._id;
    try {
        const room = await room_1.default.findOne({ roomId: room_Id });
        if (!room) {
            return res.status(400).json({ message: "Invalid room id" });
        }
        await room.updateOne({ $addToSet: { members: userId } });
        return res.status(200).json({ message: `Joined room: ${room.roomId}` });
    }
    catch (error) {
        console.log(`${error}`);
        throw new Error(`While joining room`);
    }
};
exports.handleJoining = handleJoining;
const handleJoinedRooms = async (req, res) => {
    const userId = req.user?._id;
    if (!userId) {
        return res.status(400).json({ message: "Login first" });
    }
    try {
        const rooms = await room_1.default.find({ members: userId }).select("roomId title description");
        return res.status(200).json({ rooms });
    }
    catch (error) {
        console.log(`${error}`);
        throw new Error(`While fetching joined rooms`);
    }
};
exports.handleJoinedRooms = handleJoinedRooms;
