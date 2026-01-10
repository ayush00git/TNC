import { Request, Response } from "express";
import Blog from "../models/blog";

export const getBlogsHandler = async (req: Request, res: Response) => {
	try {
		const blogs = await Blog.find({ isDraft: false }).populate("user", "name email");
		return res.status(200).json({ message: "Blogs fetched successfully", blogs });
	} catch (error) {
		console.log(`${error}`);
		throw new Error(`While fetching blogs`);
	};
};

export const postBlogHandler = async (req: Request, res: Response) => {
	const { title, excerpt, tags, content, isDraft } = req.body;
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
            isDraft,
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
	if( !blogId ) {
		return res.status(400).json({ message: "Invalid request" });
	}

    try {
        const blog = await Blog.findOne({ _id: blogId }).populate("user", "name email");
        if( !blog ) {
            return res.status(200).json({ message: "This blog no longer exists" });
        }
        return res.status(200).json(blog);
    }catch(error) {
        console.log(`${error}`);
        throw new Error(`While fetching this requested blog`);
    }
};

export const getUsersBlogsHandler = async (req: Request, res: Response) => {
    const { userId } = req.params;
    if( !userId ) {
        return res.status(400).json({ message: "Invalid request" });
    }

    try {
        const blogs = await Blog.find({ user: userId }).populate("user", "name email");    // for reference see the json of blog once
        return res.status(200).json(blogs);
    } catch(error) {
        console.log(`${error}`);
        throw new Error(`While fetching user's own blogs`);
    }
};

export const editBlogHandler = async (req: Request, res: Response) => {
    const { blogId } = req.params;
    if( !blogId ) {
        return res.status(400).json({ message: "Please specify the blog you're trying to edit" });
    }
    try {
        const { title, excerpt, tags, content, isDraft } = req.body;
        if( !title || !excerpt || !tags || !content ) {
            return res.status(400).json({ messages: "Fields can't be kept empty" });
        }

        const reqBlog = await Blog.findOne({ _id: blogId });
        if( reqBlog?.user._id.toString() !== req.user?._id.toString() ) {
            return res.status(400).json({ message: "You are not authorized to edit this blog" });
        }

        const editBlog = await Blog.findOneAndUpdate( { _id: blogId }, { 
            title,
            excerpt,
            tags,
            content,
            isDraft,
        } );
        return res.status(200).json({ message: "Blog edited successfully", blog: editBlog });
    }catch(error) {
        console.log(`${error}`);
        throw new Error(`While editing the blog`);
    }
};

export const deleteBlogHandler = async (req: Request, res: Response) => {
    const { blogId } = req.params;
    if( !blogId ) {
        return res.status(400).json({ message: "Specify the blog you want to delete" });
    };
    
    try{
        const reqBlog = await Blog.findOne({ _id: blogId });
        if( reqBlog?.user._id.toString() !== req.user?._id.toString() ) {
            return res.status(400).json({ message: "You are not authorized to delete this blog" });
        }

        await Blog.findOneAndDelete({ _id: blogId });
        return res.status(200).json({ message: "Blog deleted successfully", blog: reqBlog });
    }catch(error) {
        console.log(`${error}`);
        throw new Error(`While deleting the blog`);
    }
};
