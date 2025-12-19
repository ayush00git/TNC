"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRoute = void 0;
const express_1 = __importDefault(require("express"));
const chat_1 = require("../controllers/chat");
const multer_1 = __importDefault(require("multer"));
exports.chatRoute = express_1.default.Router();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
exports.chatRoute.post('/:roomId', upload.single("image"), chat_1.sendChat);
exports.chatRoute.get('/chat-history/:roomId', chat_1.getChatHistory);
