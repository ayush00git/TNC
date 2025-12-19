"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const generateToken = (user) => {
    try {
        const payload = {
            userId: user._id,
            name: user.name,
            email: user.email,
        };
        return jsonwebtoken_1.default.sign(payload, process.env.JWT_ENCRYP_KEY);
    }
    catch (error) {
        throw new Error(`While using servive generateToken`);
    }
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, process.env.JWT_ENCRYP_KEY);
    }
    catch (error) {
        throw new Error(`While using servive verifyToken`);
    }
};
exports.verifyToken = verifyToken;
