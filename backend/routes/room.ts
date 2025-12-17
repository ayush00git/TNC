import express from "express";
import { handleCreateRoom, handleRoomInfo, handleJoining, handleJoinedRooms } from "../controllers/room";

export const roomRoute = express.Router();

roomRoute.post('/', handleCreateRoom);
roomRoute.get('/joined', handleJoinedRooms);
roomRoute.get('/:roomId/join', handleJoining);
roomRoute.get('/:roomId', handleRoomInfo);