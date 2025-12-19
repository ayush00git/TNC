"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const roomSchema = new mongoose_1.Schema({
    roomId: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    members: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Auth',
        }]
});
exports.default = (0, mongoose_1.model)("Room", roomSchema);
