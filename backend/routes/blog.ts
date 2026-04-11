import express from "express";
import multer from "multer";
import { getUsersBlogsHandler, getABlogHandler, editBlogHandler, getBlogsHandler, deleteBlogHandler, postBlogHandler, uploadBlogImageHandler } from "../controllers/blog"; 
import { allowOnlyAuthenticatedUser } from "../middlewares/auth";

const upload = multer({ storage: multer.memoryStorage() });

export const blogRoute = express.Router();

blogRoute.get('/my-blogs/:userId', allowOnlyAuthenticatedUser, getUsersBlogsHandler);
blogRoute.get(`/:blogId`, getABlogHandler);
blogRoute.put('/edit/:blogId', allowOnlyAuthenticatedUser, editBlogHandler);
blogRoute.delete('/delete/:blogId', allowOnlyAuthenticatedUser, deleteBlogHandler);
blogRoute.get('/', getBlogsHandler);
blogRoute.post('/upload-image', allowOnlyAuthenticatedUser, upload.single('image'), uploadBlogImageHandler);
blogRoute.post('/', allowOnlyAuthenticatedUser, postBlogHandler);

