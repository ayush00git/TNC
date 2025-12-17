import express from "express";
import { handleCreateRoom, handleRoomInfo, handleJoining } from "../controllers/room";

export const roomRoute = express.Router();

roomRoute.post('/', handleCreateRoom);
roomRoute.get('/:roomId', handleRoomInfo);
roomRoute.get('/:roomId/join', handleJoining);