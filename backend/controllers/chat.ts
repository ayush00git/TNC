import { Request, Response } from "express";
import { uploadToS3 } from "../services/s3Bucket";
import Chat from "../models/chat";

export const sendChat = async(req: Request, res: Response) => {
    try {
        const { text } = req.body;
        const image = req.file;

        if( !text ) {
            return res.status(400).json({ "message": "message can't be sent empty" });
        }
        const imageUrl = await uploadToS3(image!); // promised that image would be given, change it afterwards

        // save to database
        const chatMessage = new Chat({
            text,
            imageURL: imageUrl,
        })
        chatMessage.save();
        return res.status(200).json({ "message": "chat sent successfully"});
    } catch (error) {
        console.log(`Error in sending the message`);
        throw new Error(`While hitting the post request`);
    }
}