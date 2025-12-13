import { JwtPayload } from "jsonwebtoken";
import { IAuth } from "../models/auth";

declare global {
    namespace Express {
        interface Request {
            user?: IAuth;
        }
    }
}

export {};