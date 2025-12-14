import express from "express";
import { handleUserSignUp, handleUserLogIn, handleForgetPass } from "../controllers/auth";

export const authRoute = express.Router();

authRoute.post('/signup', handleUserSignUp);
authRoute.post('/login', handleUserLogIn);
authRoute.post('/forget-password/viaOldPass', handleForgetPass);