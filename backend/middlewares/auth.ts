import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../services/authToken";
import Auth from "../models/auth";

export const allowOnlyAuthenticatedUser = async (req: Request, res: Response, next: NextFunction) => {
    let token = req.cookies?.token;
    if( !token && req.headers.authorization && req.headers.authorization.startsWith("Bearer") ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if( !token ) {
        return res.status(400).json({ message: "LogIn first to access this page" });
    }

    const decoded = verifyToken(token);
    if( !decoded || typeof decoded === 'string' || !decoded.email ) {
        return res.status(400).json({ message: "Invalid token" });
    }

    try {
        const user = await Auth.findOne({ email: decoded.email });
        if(!user) {
            return res.status(400).json({ message: "Login or Create an account first" });
        }
        req.user = user;
        next();
    } catch (error) {
        throw new Error(`While running the authentication middleware`);
    }
}