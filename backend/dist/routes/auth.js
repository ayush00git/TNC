"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoute = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controllers/auth");
exports.authRoute = express_1.default.Router();
exports.authRoute.post('/signup', auth_1.handleUserSignUp);
exports.authRoute.post('/login', auth_1.handleUserLogIn);
exports.authRoute.post('/forget-password/viaOldPass', auth_1.handleForgetPassViaOld);
exports.authRoute.post('/forget-password/viaEmail', auth_1.handlerForgetPassViaEmail);
exports.authRoute.post('/reset-password', auth_1.changeUserPass);
exports.authRoute.get('/verify-acc', auth_1.handleVerifyEmail);
