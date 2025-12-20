import { model, Schema, Types } from "mongoose";

export interface IFeature {
    _id: Types.ObjectId,
    user: Types.ObjectId,
    title: string,
    description: string,
    status: string,
}

const featureSchema: Schema = new Schema({
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
    status: {
        type: String,
        required: true,
    },
}, { timestamps: true } )

export default model<IFeature>("Feature", featureSchema);