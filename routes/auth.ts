import express from "express";
import { handleUserSignUp, handleUserLogIn, handlerForgetPassViaEmail, handleForgetPassViaOld, changeUserPass, handleVerifyEmail, handleUserLogOut } from "../controllers/auth";
import { savePushToken } from "../controllers/notification";
import { allowOnlyAuthenticatedUser } from "../middlewares/auth";

export const authRoute = express.Router();

authRoute.post('/signup', handleUserSignUp);
authRoute.post('/login', handleUserLogIn);
authRoute.post('/forget-password/viaOldPass', handleForgetPassViaOld);
authRoute.post('/forget-password/viaEmail', handlerForgetPassViaEmail)
authRoute.post('/reset-password', changeUserPass);
authRoute.get('/verify-acc', handleVerifyEmail);
authRoute.post('/save-token', allowOnlyAuthenticatedUser, savePushToken);
authRoute.post('/logout', allowOnlyAuthenticatedUser, handleUserLogOut);
