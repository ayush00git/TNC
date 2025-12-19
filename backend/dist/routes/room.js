"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomRoute = void 0;
const express_1 = __importDefault(require("express"));
const room_1 = require("../controllers/room");
exports.roomRoute = express_1.default.Router();
exports.roomRoute.post('/', room_1.handleCreateRoom);
exports.roomRoute.get('/joined', room_1.handleJoinedRooms);
exports.roomRoute.get('/:roomId/join', room_1.handleJoining);
exports.roomRoute.get('/:roomId', room_1.handleRoomInfo);
