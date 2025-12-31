import { Request, Response } from "express";
import Blog from "../models/blog";

export const getBlogsHandler = async (req: Request, res: Response) => {
	try {
		const blogs = await Blog.find({});
		return res.status(200).json({ message: "Blogs fetched successfully", blogs });
	}catch(error) {
		console.log(`${error}`);
		throw new Error(`While fetching blogs`);
	};
};

export const postBlogHandler = async (req: Request, res: Response) => {
	const { title, excerpt, date, readTime, tags, color, content } = req.body;
	const userId = req.user;
		
	if( !title || !excerpt || !content ) {
		return res.status(400).json({ message: "Title, excerpt and content are required" });
	}
	
	try {
		const blog = new Blog ({
			user: userId,
			title,
			excerpt,
			date,
			readTime,
			tags,
			color,
			content,
		});
		await blog.save();
		return res.status(200).json({ message: "Blog uploaded success", blog });
	} catch(error) {
		console.log(`${error}`);
		throw new Error(`While posting the blog`);
	};
};
