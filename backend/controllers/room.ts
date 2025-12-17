import { Request, Response } from "express";
import Room from "../models/room";
import Chat from "../models/chat";

export const handleCreateRoom = async (req: Request, res: Response) => {
    const { roomId, title, description } = req.body;
    if( !roomId || !title || !description ) {
        return res.status(400).json({ "message": "All the fields are required" });
    }
    try {
        const room = new Room({
            roomId,
            title,
            description,
        })
        await room.save();
        return res.status(200).json({ "message": "Room created successfully" });
    } catch (error) {
        console.log(`${error}`);
        throw new Error(`While creating a room`);
    }
};

export const handleRoomInfo = async(req: Request, res: Response) => {
    const Id = req.params.roomId;
    const room = await Room.find({ roomId: Id });
    return res.status(200).json({ room });
}

export const handleJoining = async(req: Request, res: Response) => {
    const room_Id = req.params.roomId;
    const userId = req.user?._id;
    const room = await Room.findOne({ roomId: room_Id });
    if(!room) {
        return res.status(400).json({ "message": "Invalid room id" });
    }
    await room.updateOne(
        { _id: room._id },
        { $addToSet: { members: userId } }
    )
    return res.status(200).json({ "message": `Joined room: ${room.roomId}` });
}