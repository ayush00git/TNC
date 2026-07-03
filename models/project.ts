import { Types, Schema, model } from "mongoose";

export interface IProject{
  _id: Types.ObjectId,
  user: Types.ObjectId,
  title: string,
  description: string,
  tags: string[],
  githubLink: string,
  liveLink: string,
}

const projectSchema: Schema = new Schema({
  user: {
      type: Schema.Types.ObjectId,
      ref: 'Auth',
  },
  title: {
      type: String,
      required: true,
  },
  tags: {
      type: [String],
  },
  githubLink: {
      type: String,
      required: true,
  },
  liveLink: {
      type: String,
      required: false,
  }
}, { timestamps: true } );

export default model<IProject>("Project", projectSchema);

