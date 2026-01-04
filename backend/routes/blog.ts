import express from "express";
import { getUsersBlogsHandler, getABlogHandler, getBlogsHandler, postBlogHandler } from "../controllers/blog"; 
import { allowOnlyAuthenticatedUser } from "../middlewares/auth";

export const blogRoute = express.Router();

blogRoute.get('/my-blogs/:userId', getUsersBlogsHandler);
blogRoute.get(`/:blogId`, getABlogHandler);
blogRoute.get('/', getBlogsHandler);
blogRoute.post('/', allowOnlyAuthenticatedUser, postBlogHandler);
