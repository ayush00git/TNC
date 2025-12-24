import { Request, Response } from "express";
import Room from "../models/room";

export const handleCreateRoom = async (req: Request, res: Response) => {
  const { roomId, title, description } = req.body;
  if (!roomId || !title || !description) {
    return res.status(400).json({ message: "All the fields are required" });
  }
  try {
    const room = new Room({
      roomId,
      title,
      description,
    });
    await room.save();
    return res.status(200).json({ message: "Room created successfully" });
  } catch (error) {
    console.log(`${error}`);
    throw new Error(`While creating a room`);
  }
};

export const handleRoomInfo = async (req: Request, res: Response) => {
  const Id = req.params.roomId;
  try {
    const room = await Room.find({ roomId: Id }).populate(
      "members",
      "name email"
    );
    return res.status(200).json({ room });
  } catch (error) {
    console.log(`${error}`);
    throw new Error(`While gathering the rooms info`);
  }
};

export const handleJoining = async (req: Request, res: Response) => {
  const room_Id = req.params.roomId;
  const userId = req.user?._id;
  try {
    const room = await Room.findOne({ roomId: room_Id });
    if (!room) {
      return res.status(400).json({ message: "Invalid room id" });
    }
    await room.updateOne({ $addToSet: { members: userId } });
    return res.status(200).json({ message: `Joined room: ${room.roomId}` });
  } catch (error) {
    console.log(`${error}`);
    throw new Error(`While joining room`);
  }
};

export const handleJoinedRooms = async (req: Request, res: Response) => {
  const userId = req.user?._id;
  if (!userId) {
    return res.status(400).json({ message: "Login first" });
  }
  try {
    const rooms = await Room.find({ members: userId }).select(
      "roomId title description"
    );
    return res.status(200).json({ rooms });
  } catch (error) {
    console.log(`${error}`);
    throw new Error(`While fetching joined rooms`);
  }
};
// get all rooms
export const handleGetAllRooms = async (req: Request, res: Response) => {
  try {
    const rooms = await Room.find({}).select("roomId title description");
    return res.status(200).json({ rooms });
  } catch (error) {
    console.log(`${error}`);
    throw new Error(`While fetching all rooms`);
  }
};
