import mongoose from "mongoose";

export const connectToMongo = async (url: string) => {

    if(!url) {
        console.log(`Mongo connection string is not provided`);
    }

    await mongoose.connect(url);
}