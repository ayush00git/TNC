import express from "express";
import { getUsersBlogsHandler, getABlogHandler, editBlogHandler, getBlogsHandler, deleteBlogHandler, postBlogHandler } from "../controllers/blog"; 
import { allowOnlyAuthenticatedUser } from "../middlewares/auth";

export const blogRoute = express.Router();

blogRoute.get('/my-blogs/:userId', allowOnlyAuthenticatedUser, getUsersBlogsHandler);
blogRoute.get(`/:blogId`, getABlogHandler);
blogRoute.put('/edit/:blogId', allowOnlyAuthenticatedUser, editBlogHandler);
blogRoute.delete('/delete/:blogId', allowOnlyAuthenticatedUser, deleteBlogHandler);
blogRoute.get('/', getBlogsHandler);
blogRoute.post('/', allowOnlyAuthenticatedUser, postBlogHandler);

