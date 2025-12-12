import { Schema, model, Document } from "mongoose";

export interface IChat extends Document {
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
