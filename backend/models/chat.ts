import { Schema, model, Types } from "mongoose";

export interface IChat {
  _id: Types.ObjectId,
  sender: Types.ObjectId,
  room: Types.ObjectId,
  text: string;
  imageURL: string;
}

const chatSchema: Schema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'Auth',
    required: true,
  },
  room: {
    type: Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
    index: true,
  },
  text: {
    type: String,
  },
  imageURL: {
    type: String,
    default: " ",
  },
},
  { timestamps: true });

export default model<IChat>("Chat", chatSchema);
