import { model, Schema, Types } from "mongoose";

export interface IBlog {
	_id: Types.ObjectId,
	user: Types.ObjectId,
	title: string,
	excerpt: string,
	tags: string[],
	content: string,
}

const blogSchema: Schema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'Auth',
	},
	title: {
		type: String,
		required: true,
	},
	excerpt: {
		type: String,
		required: true,
	},
	tags: {
		type: [String],
	},
	content: {
		type: String,
		required: true,
	},
}, { timestamps: true } );

export default model<IBlog>("Blog", blogSchema);
