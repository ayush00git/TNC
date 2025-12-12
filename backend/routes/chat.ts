import express from "express";
import { sendChat } from "../controllers/chat";
import multer from "multer";

export const chatRoute = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

chatRoute.post('/', upload.single("image"), sendChat);