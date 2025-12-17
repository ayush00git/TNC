import { Schema, model, Types } from "mongoose";
import { ref } from "node:process";

export interface IRoom {
    _id: Types.ObjectId,
    roomId: string,
    title: string,
    description: string,
    members: Types.ObjectId[],
}

const roomSchema: Schema = new Schema({
    roomId: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'Auth', 
    }]
})

export default model<IRoom>("Room", roomSchema);