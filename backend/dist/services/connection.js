"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToMongo = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectToMongo = async (url) => {
    if (!url) {
        console.log(`Mongo connection string is not provided`);
    }
    await mongoose_1.default.connect(url);
};
exports.connectToMongo = connectToMongo;
