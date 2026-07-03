import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateToken = (user: any) => {
    try {
        const payload = {
            userId: user._id,
            name: user.name,
            email: user.email,
        }
        return jwt.sign(payload, process.env.JWT_ENCRYP_KEY!);
    } catch (error) {
        throw new Error(`While using servive generateToken`);
    }
}

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, process.env.JWT_ENCRYP_KEY!);
    } catch (error) {
        throw new Error(`While using servive verifyToken`);
    }
}