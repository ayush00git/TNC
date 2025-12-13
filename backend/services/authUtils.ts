import crypto from "crypto";

// to generate a random salt
export const generateSalt = () => {
    return crypto.randomBytes(16).toString("hex");
}

// to hash a password with a salt
export const hashPassword = (password: string, salt: string) => {
    const hash = crypto.createHmac("sha-256", salt);
    hash.update(password);
    return hash.digest("hex");
}