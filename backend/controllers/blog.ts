import { Request, Response } from "express";
import Blog from "../models/blog";

export const getBlogsHandler = async (req: Request, res: Response) => {
	try {
		const blogs = await Blog.find({}).populate("user", "name email");
		return res.status(200).json({ message: "Blogs fetched successfully", blogs });
	} catch (error) {
		console.log(`${error}`);
		throw new Error(`While fetching blogs`);
	};
};

export const postBlogHandler = async (req: Request, res: Response) => {
	const { title, excerpt, tags, content } = req.body;
	const userId = req.user;

	if (!title || !excerpt || !content) {
		return res.status(400).json({ message: "Title, excerpt and content are required" });
	}

	try {
		const blog = new Blog({
			user: userId,
			title,
			excerpt,
			tags,
			content,
		});
		await blog.save();
		return res.status(200).json({ message: "Blog uploaded success", blog });
	} catch (error) {
		console.log(`${error}`);
		throw new Error(`While posting the blog`);
	};
};

export const getABlogHandler = async (req: Request, res: Response) => {
    const { blogId } = req.params;
    try {
        const blog = await Blog.findOne({ _id: blogId }).populate("user", "name email");
        return res.status(200).json(blog);
    }catch(error) {
        console.log(`${error}`);
        throw new Error(`While fetching this requested blog`);
    }
};

export const getUsersBlogsHandler = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        const blogs = await Blog.find({ user: userId }).populate("user", "name email");    // for reference see the json of blog once
        return res.status(200).json(blogs);
    } catch(error) {
        console.log(`${error}`);
        throw new Error(`While fetching user's own blogs`);
    }
};

