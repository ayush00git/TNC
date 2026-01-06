import express from "express";
import { handleCreateRoom, handleRoomInfo, handleJoining, handleJoinedRooms, handleGetAllRooms } from "../controllers/room";
import { allowOnlyAuthenticatedUser } from "../middlewares/auth.ts";

export const roomRoute = express.Router();

roomRoute.get('/allRooms', handleGetAllRooms);
roomRoute.post('/', allowOnlyAutheticatedUser, handleCreateRoom);
roomRoute.get('/joined', allowOnlyAuthenticatedUser, handleJoinedRooms);
roomRoute.get('/:roomId/join', allowOnlyAuthenticatedUser, handleJoining);
roomRoute.get('/:roomId', allowOnlyAuthenticatedUser, handleRoomInfo);

