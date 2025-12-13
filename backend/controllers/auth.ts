import { Request, Response } from "express";
import Auth from "../models/auth";
import { generateToken } from "../services/authToken";
import { generateSalt, hashPassword } from "../services/authUtils";

export const handleUserSignUp = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All the fields are required" });
    }

    const salt = generateSalt();
    const hash = hashPassword(password, salt);
    
    const newUser = new Auth({
      name,
      email,
      password: hash,
      salt: salt,
    });
    await newUser.save();

    return res.status(200).json({
      "message": "New user created successfully",
      "new user": {
        name,
        email,
      },
    });
  } catch (error) {
    console.log(`While signing up`);
    throw new Error(`While creating a new User`);
  }
};

export const handleUserLogIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const existingUser = await Auth.findOne({ email });
  if(!existingUser) {
    return res.status(400).json({ "message": "You don't have an account" });
  }

  const inputhash = hashPassword(password, existingUser.salt);
  if(inputhash != existingUser.password) {
    return res.status(400).json({ "message": "Incorrect password" })
  }
  const token = generateToken(existingUser);
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({ "message": "Logged in success" });
};

export const getLogin = (req: Request, res: Response) => {
  return res.status(200).json({ message: "Login page" });
};

export const getSignup = (req: Request, res: Response) => {
  return res.status(200).json({ message: "Signup page" });
};
