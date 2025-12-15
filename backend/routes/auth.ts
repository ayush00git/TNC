import express from "express";
import { handleUserSignUp, handleUserLogIn, handlerForgetPassViaEmail, handleForgetPassViaOld, changeUserPass, handleVerifyEmail } from "../controllers/auth";

export const authRoute = express.Router();

authRoute.post('/signup', handleUserSignUp);
authRoute.post('/login', handleUserLogIn);
authRoute.post('/forget-password/viaOldPass', handleForgetPassViaOld);
authRoute.post('/forget-password/viaEmail', handlerForgetPassViaEmail)
authRoute.post('/reset-password', changeUserPass);
authRoute.post('/verify-acc', handleVerifyEmail);