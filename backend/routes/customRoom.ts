import express from "express";
import { createCustomRoom, getAllCustomRooms } from "../controllers/customRoom";
import { allowOnlyAuthenticatedUser } from "../middlewares/auth";

export const customRoomRoute = express.Router();

customRoomRoute.post("/create-room", allowOnlyAuthenticatedUser, createCustomRoom);
customRoomRoute.get("/rooms", getAllCustomRooms);