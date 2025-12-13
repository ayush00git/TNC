import { Request, Response } from "express";
import IAuth from "../models/auth";

export const handleUserSignUp = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All the fields are required" });
    }

    const newUser = new IAuth({
      name,
      email,
      password,
    });
    await newUser.save();
    return res.status(200).json({
      message: "New user created successfully",
      newUser: {
        name,
        email,
      },
    });
  } catch (error) {
    console.log(`While signing up`);
    throw new Error(`While creating a new User`);
  }
};

export const handleUserLogIn = async (req: Request, res: Response) => {};

export const getLogin = (req: Request, res: Response) => {
  return res.status(200).json({ message: "Login page" });
};

export const getSignup = (req: Request, res: Response) => {
  return res.status(200).json({ message: "Signup page" });
};
