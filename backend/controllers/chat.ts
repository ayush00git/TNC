import { Request, Response } from "express";
import { uploadToS3 } from "../services/s3Bucket";
import Chat from "../models/chat";

export const sendChat = async(req: Request, res: Response) => {
    try {
        const { text } = req.body;
        const image = req.file;

        if(!image) {
            console.log("Please upload the file");
            return;
        }
        const imageUrl = await uploadToS3(image);

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