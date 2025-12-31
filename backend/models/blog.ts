import { model, Schema, Types } from "mongoose";

export interface IBlog {
	_id: Types.ObjectId,
	user: Types.ObjectId,
	title: string,
	excerpt: string,
	date: string,
	readTime: string,
	tags: string[],
	color: string,
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
	date: {
		type: String,
		default: Date.now,
	},
	readTime: {
		type: String,
		default: "5 min",
	},
	tags: {
		type: [String],
	},
	color: {
		type: String,
		default: "#ff0080",
	},
	content: {
		type: String,
		required: true,
	},
}, { timestamps: true } );

export default model<IBlog>("Blog", blogSchema);
