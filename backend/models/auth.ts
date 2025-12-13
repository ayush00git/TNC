import { Schema, Document, model } from "mongoose";

export interface IAuth extends Document {
    name: string,
    email: string, 
    password: string    
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
}, { timestamps: true } );

export default model<IAuth>("Auth", authSchema);