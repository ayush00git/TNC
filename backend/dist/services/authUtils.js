"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = exports.generateSalt = void 0;
const crypto_1 = __importDefault(require("crypto"));
// to generate a random salt
const generateSalt = () => {
    return crypto_1.default.randomBytes(16).toString("hex");
};
exports.generateSalt = generateSalt;
// to hash a password with a salt
const hashPassword = (password, salt) => {
    const hash = crypto_1.default.createHmac("sha-256", salt);
    hash.update(password);
    return hash.digest("hex");
};
exports.hashPassword = hashPassword;
