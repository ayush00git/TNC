import express from "express";
import { getBlogsHandler, postBlogHandler } from "../controllers/blog"; 
import { allowOnlyAuthenticatedUser } from "../middlewares/auth";

export const blogRoute = express.Router();

blogRoute.get('/', getBlogsHandler);
blogRoute.post('/', allowOnlyAuthenticatedUser, postBlogHandler);

