import { Request, Response } from "express";
import CustomRoom from "../models/customRoom";
import { generateSalt, hashPassword } from "../services/authUtils";

export const createCustomRoom = async(req: Request, res: Response) => {
    const { title, description, pass } = req.body;
    const userId = req.user;
    if( !title || !description || !pass ) {
        return res.status(400).json({ message: "All the fields are required" });
    }
    const salt = generateSalt();
    const hashPass = hashPassword(pass, salt);
    try {
        const cstRoom = new CustomRoom({
            title,
            description,
            pass: hashPass,
            salt: salt,
            user: userId,
            members: [userId],
        })
        await cstRoom.save();
        return res.status(200).json({ message: `${cstRoom.title} created successfully` })
    } catch (error) {
        console.log(`${error}`);
        throw new Error(`While creating a custom room`);
    }
}

export const getAllCustomRooms = async(req: Request, res: Response) => {
    try {
        const customRooms = await CustomRoom.find({ })
            .sort({ createdAt: -1 });
        return res.status(200).json(customRooms);
    } catch (error) {
        console.log(`${error}`);
        throw new Error(`While getting all custom rooms`);
    }
}