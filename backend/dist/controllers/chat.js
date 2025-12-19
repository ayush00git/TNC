"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChatHistory = exports.sendChat = void 0;
const s3Bucket_1 = require("../services/s3Bucket");
const chat_1 = __importDefault(require("../models/chat"));
const mongoose_1 = require("mongoose");
const sendChat = async (req, res) => {
    try {
        const { text } = req.body;
        const { roomId } = req.params; // Incorrect: Route is POST / so room is in body
        const sender = req.user?._id;
        const image = req.file;
        if (!text && !image) {
            return res.status(400).json({ message: "message can't be sent empty" });
        }
        let imageUrl;
        if (image) {
            imageUrl = await (0, s3Bucket_1.uploadToS3)(image);
        }
        // save to database
        const chatMessage = await chat_1.default.create({
            sender,
            text,
            room: roomId,
            imageURL: imageUrl,
        });
        const populatedMessage = await chatMessage.populate("sender", "name email");
        const io = req.app.get("io");
        if (io) {
            io.to(roomId).emit("receive_message", populatedMessage);
        }
        else {
            console.warn("Socket.io instance not found in request app");
        }
        return res.status(200).json(populatedMessage);
    }
    catch (error) {
        console.error(`Error in sending the message:`, error);
        return res.status(500).json({ message: "Error sending message", error: String(error) });
    }
};
exports.sendChat = sendChat;
const getChatHistory = async (req, res) => {
    const { roomId } = req.params;
    if (!(0, mongoose_1.isValidObjectId)(roomId)) {
        return res.status(400).json({ message: "Invalid Room ID" });
    }
    const limit = 20;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    try {
        const messages = await chat_1.default.find({ room: roomId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("sender", "name email");
        return res.status(200).json(messages.reverse());
    }
    catch (error) {
        console.log(`Error in getChatHistory: ${error}`);
        return res.status(500).json({ message: "Error fetching chat history" });
    }
};
exports.getChatHistory = getChatHistory;
