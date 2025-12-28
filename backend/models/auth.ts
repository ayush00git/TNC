import { Schema, Types, model } from "mongoose";

export interface IAuth {
    _id: Types.ObjectId,
    name: string,
    email: string,
    password: string,
    salt: string,
    isVerified: boolean,
    expoPushToken?: string,
}

const authSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    salt: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    expoPushToken: {
        type: String,
        default: null,
    }
}, { timestamps: true });

export default model<IAuth>("Auth", authSchema);