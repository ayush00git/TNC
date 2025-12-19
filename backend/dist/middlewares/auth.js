"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allowOnlyAuthenticatedUser = void 0;
const authToken_1 = require("../services/authToken");
const auth_1 = __importDefault(require("../models/auth"));
const allowOnlyAuthenticatedUser = async (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) {
        return res.status(400).json({ message: "LogIn first to access this page" });
    }
    const decoded = (0, authToken_1.verifyToken)(token);
    if (!decoded || typeof decoded === 'string' || !decoded.email) {
        return res.status(400).json({ message: "Invalid token" });
    }
    try {
        const user = await auth_1.default.findOne({ email: decoded.email });
        if (!user) {
            return res.status(400).json({ message: "Need to have an account for login" });
        }
        req.user = user;
        next();
    }
    catch (error) {
        throw new Error(`While running the authentication middleware`);
    }
};
exports.allowOnlyAuthenticatedUser = allowOnlyAuthenticatedUser;
