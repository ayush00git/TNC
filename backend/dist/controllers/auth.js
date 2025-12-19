"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeUserPass = exports.handlerForgetPassViaEmail = exports.handleForgetPassViaOld = exports.handleUserLogIn = exports.handleVerifyEmail = exports.handleUserSignUp = void 0;
const auth_1 = __importDefault(require("../models/auth"));
const authToken_1 = require("../services/authToken");
const authUtils_1 = require("../services/authUtils");
const sendEmail_1 = require("../services/sendEmail");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const verifyAcc_1 = require("../services/verifyAcc");
dotenv_1.default.config();
const handleUserSignUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All the fields are required" });
        }
        const existingUser = await auth_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "You already have an account, login instead OR if you want to verify your email then check your email inbox or contact us" });
        }
        const salt = (0, authUtils_1.generateSalt)();
        const hash = (0, authUtils_1.hashPassword)(password, salt);
        const newUser = new auth_1.default({
            name,
            email,
            password: hash,
            salt: salt,
            isVerified: false,
        });
        await newUser.save();
        (0, verifyAcc_1.verifyAcc)(newUser);
        return res.status(200).json({ message: "Email sent for verification" });
    }
    catch (error) {
        console.log(`While signing up`);
        throw new Error(`While creating a new User`);
    }
};
exports.handleUserSignUp = handleUserSignUp;
const handleVerifyEmail = async (req, res) => {
    try {
        const queryHash = req.query.hash;
        const decoder = jsonwebtoken_1.default.verify(queryHash, process.env.JWT_ENCRYP_KEY);
        const user = await auth_1.default.findOne({ email: decoder.email });
        if (!user) {
            return res
                .status(400)
                .json({ message: "User with that email is not registered" });
        }
        user.isVerified = true;
        await user.save();
        return res.status(200).json({ message: "Email is verified, now you can login to your account" });
    }
    catch (error) {
        console.log(`${error}`);
        throw new Error(`While verifying the email`);
    }
};
exports.handleVerifyEmail = handleVerifyEmail;
const handleUserLogIn = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "All the fields are required" });
    }
    try {
        const existingUser = await auth_1.default.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ message: "You don't have an account, sign up first" });
        }
        if (!existingUser.isVerified) {
            return res.status(400).json({ message: "Account is unverified" });
        }
        const inputhash = (0, authUtils_1.hashPassword)(password, existingUser.salt);
        if (inputhash !== existingUser.password) {
            return res.status(400).json({ message: "Incorrect password" });
        }
        const token = (0, authToken_1.generateToken)(existingUser);
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });
        return res.status(200).json({
            message: "Logged in success",
            user: {
                _id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
            },
        });
    }
    catch (error) {
        console.log(`${error}`);
        throw new Error(`While logging in`);
    }
};
exports.handleUserLogIn = handleUserLogIn;
// via old password
const handleForgetPassViaOld = async (req, res) => {
    const { email, oldPassword, newPassword } = req.body;
    if (!email || !oldPassword || !newPassword) {
        return res.status(400).json({ message: "All the fields are required" });
    }
    try {
        const user = await auth_1.default.findOne({ email });
        if (!user) {
            return res
                .status(400)
                .json({ message: "Account with that email does not exists" });
        }
        const oldHash = (0, authUtils_1.hashPassword)(oldPassword, user?.salt);
        if (oldHash !== user?.password) {
            return res
                .status(400)
                .json({ message: "You have entered a wrong password" });
        }
        const newSalt = (0, authUtils_1.generateSalt)();
        const newHash = (0, authUtils_1.hashPassword)(newPassword, newSalt);
        user.password = newHash;
        user.salt = newSalt;
        await user.save();
        return res.status(200).json({ message: "Password changed successfully" });
    }
    catch (error) {
        console.log(`${error}`);
        throw new Error(`While changing the password`);
    }
};
exports.handleForgetPassViaOld = handleForgetPassViaOld;
// via nodemailer
const handlerForgetPassViaEmail = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Enter all the required fields" });
    }
    try {
        const user = await auth_1.default.findOne({ email });
        if (!user) {
            return res
                .status(400)
                .json({ message: "This email isn't registered to any accounts" });
        }
        const status = (0, sendEmail_1.sendEmail)(user);
        if (!status) {
            return res
                .status(400)
                .json({ message: "Email couldn't be sent at the moment" });
        }
        return res.status(200).json({ message: "Email sent successfully" });
    }
    catch (error) {
        console.log(`${error}`);
        throw new Error(`While user tried to change pass via email`);
    }
};
exports.handlerForgetPassViaEmail = handlerForgetPassViaEmail;
const changeUserPass = async (req, res) => {
    const { newPassword } = req.body;
    const token = req.query.token;
    if (!newPassword) {
        return res.status(400).json({ message: "All the fields are required" });
    }
    if (!token) {
        return res.status(400).json({ message: "No validated token found" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_ENCRYP_KEY);
        const user = await auth_1.default.findOne({ email: decoded.email });
        if (!user) {
            return res.status(400).json({ message: "Token is altered" });
        }
        const newSalt = (0, authUtils_1.generateSalt)();
        const newHash = (0, authUtils_1.hashPassword)(newPassword, newSalt);
        user.password = newHash;
        user.salt = newSalt;
        await user.save();
        return res.status(200).json({ message: "Password changed successfully" });
    }
    catch (error) {
        console.log(`${error}`);
        throw new Error(`While changing password via email`);
    }
};
exports.changeUserPass = changeUserPass;
