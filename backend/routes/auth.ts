import express from "express";
import { handleUserSignUp, handleUserLogIn, getLogin, getSignup } from "../controllers/auth";

export const authRoute = express.Router();

authRoute.post('/signup', handleUserSignUp);
authRoute.post('/login', handleUserLogIn);
authRoute.get('/login', getLogin);
authRoute.get('/signup', getSignup);
