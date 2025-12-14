import express from "express";
import { handleUserSignUp, handleUserLogIn } from "../controllers/auth";

export const authRoute = express.Router();

authRoute.post('/signup', handleUserSignUp);
authRoute.post('/login', handleUserLogIn);
