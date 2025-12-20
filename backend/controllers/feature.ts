import { Request, Response } from "express";
import Feature from "../models/feature";


export const postFeatures = async(req: Request, res: Response) => {
    const { title, description, status } = req.body;
    const user = req.user;
    if( !title || !description || !status ) {
        return res.status(400).json({ message: "All the fields are required" });
    }
    try {
        const feature = new Feature({
            title,
            description,
            status,
            user,
        })
        await feature.save();
        return res.status(200).json({ message: "Feature request accepted, you can contribute to it on github" })
    } catch (error) {
        console.log(`${error}`);
        throw new Error(`While submitting the feature request`);
    }
}

export const getFeatures = async(req: Request, res: Response) => {
    try {
        const features = await Feature.find({ });
        return res.status(200).json(features);
    } catch (error) {
        console.log(`${error}`);
        throw new Error(`While fetching the requested features from backend`);
    }
}