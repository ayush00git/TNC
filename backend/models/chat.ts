import { Schema, model, Types } from "mongoose";

export interface IChat {
  _id: Types.ObjectId,
  text: string;
  imageURL: string;
}

const chatSchema: Schema = new Schema(
  {
    text: {
      type: String,
      default: " ",
    },
    imageURL: {
      type: String,
      default: " ",
    },
  },
  { timestamps: true }
);

export default model<IChat>("Chat", chatSchema);
