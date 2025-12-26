import { Request, Response } from "express";
import Auth from "../models/auth";

export const savePushToken = async (req: Request, res: Response) => {
    const { token } = req.body;
    const userId = (req as any).user?._id; // Assuming auth middleware attaches user

    if (!token || !userId) {
        return res.status(400).json({ message: "Token and User ID are required" });
    }

    try {
        await Auth.findByIdAndUpdate(userId, { expoPushToken: token });
        return res.status(200).json({ message: "Push token saved successfully" });
    } catch (error) {
        console.error("Error saving push token:", error);
        return res.status(500).json({ message: "Failed to save push token" });
    }
};
