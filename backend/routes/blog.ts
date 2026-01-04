import express from "express";
import { getUsersBlogsHandler, getABlogHandler, editBlogHandler, getBlogsHandler, postBlogHandler } from "../controllers/blog"; 
import { allowOnlyAuthenticatedUser } from "../middlewares/auth";

export const blogRoute = express.Router();

blogRoute.get('/my-blogs/:userId', getUsersBlogsHandler);
blogRoute.get(`/:blogId`, getABlogHandler);
blogRoute.put('/edit/:blogId', editBlogHandler);
blogRoute.get('/', getBlogsHandler);
blogRoute.post('/', allowOnlyAuthenticatedUser, postBlogHandler);
