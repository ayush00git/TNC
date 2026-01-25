import { Types, Schema, model } from "mongoose";

export interface IProject{
  _id: Types.ObjectId,
  userId: Types.ObjectId,
  title: string,
  description: string,
  tags: []string,
  githubLink: string,
  liveLink: string,
}

const projectSchema: Schema = new Schema({
  userId: {
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
}, { timeStamps: true } );

export default model<IProject>("Project", projectSchema);

