import { Request, Response } from "express";
import { uploadToS3 } from "../services/s3Bucket";
import Chat from "../models/chat";
import Room from "../models/room";
import { isValidObjectId } from "mongoose";
import { Expo } from "expo-server-sdk";

export const sendChat = async (req: Request, res: Response) => {
    try {
        const { text } = req.body;
        const { roomId } = req.params; // Incorrect: Route is POST / so room is in body
        const sender = req.user?._id;
        const image = req.file;

        if (!text && !image) {
            return res.status(400).json({ message: "message can't be sent empty" });
        }

        let imageUrl: string | undefined;
        if (image) {
            imageUrl = await uploadToS3(image);
        }

        // save to database
        const chatMessage = await Chat.create({
            sender,
            text,
            room: roomId,
            imageURL: imageUrl,
        })
        const populatedMessage = await chatMessage.populate("sender", "name email");
        const io = req.app.get("io");
        if (io) {
            io.to(roomId).emit("receive_message", populatedMessage);
        } else {
            console.warn("Socket.io instance not found in request app");
        }

        // Send Push Notifications
        try {
            const roomDoc = await Room.findById(roomId).populate("members", "expoPushToken");
            const senderName = (req.user as any)?.name || "Someone";

            if (roomDoc) {
                const pushTokens: string[] = [];
                roomDoc.members.forEach((member: any) => {
                    if (member._id.toString() !== sender && member.expoPushToken) {
                        pushTokens.push(member.expoPushToken);
                    }
                });

                if (pushTokens.length > 0) {
                    const expo = new Expo();
                    const messages = pushTokens
                        .filter(token => Expo.isExpoPushToken(token))
                        .map(token => ({
                            to: token,
                            sound: 'default',
                            title: `New message in #${roomDoc.title}`,
                            body: `${senderName}: ${text || 'Sent an image'}`,
                            data: { roomId: roomId, roomTitle: roomDoc.title },
                        }));

                    const chunks = expo.chunkPushNotifications(messages as any);
                    for (const chunk of chunks) {
                        try {
                            await expo.sendPushNotificationsAsync(chunk);
                        } catch (error) {
                            console.error("Error sending push notification chunk:", error);
                        }
                    }
                }
            }
        } catch (notifError) {
            console.error("Error processing notifications:", notifError);
        }

        return res.status(200).json(populatedMessage);
    } catch (error) {
        console.error(`Error in sending the message:`, error);
        return res.status(500).json({ message: "Error sending message", error: String(error) });
    }
}


export const getChatHistory = async (req: Request, res: Response) => {
    const { roomId } = req.params;

    if (!isValidObjectId(roomId)) {
        return res.status(400).json({ message: "Invalid Room ID" });
    }

    const limit = 20;
    const page = parseInt(req.query.page as string) || 1;
    const skip = (page - 1) * limit;

    try {
        const messages = await Chat.find({ room: roomId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("sender", "name email");

        return res.status(200).json(messages.reverse());
    } catch (error) {
        console.log(`Error in getChatHistory: ${error}`);
        return res.status(500).json({ message: "Error fetching chat history" });
    }
}