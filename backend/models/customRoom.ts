import { model, Schema, Types } from "mongoose";

export interface ICustomRoom {
    _id: Types.ObjectId,
    user: Types.ObjectId,
    title: string,  // take this as a analogy to roomId or slug
    description: string,
    pass: string,
    salt: string,
    Members: Types.ObjectId[], 
}

const cstRoomSchema: Schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Auth',
        required: true,
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
    pass: {
        type: String,
        required: true,
    },
    salt: {
        type: String,
        required: true,
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'Auth',
    }]
})

export default model<ICustomRoom>("CustomRoom", cstRoomSchema);