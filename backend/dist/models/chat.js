"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const chatSchema = new mongoose_1.Schema({
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Auth',
        required: true,
    },
    room: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Room',
        required: true,
        index: true,
    },
    text: {
        type: String,
    },
    imageURL: {
        type: String,
        default: " ",
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Chat", chatSchema);
