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
  try {
    const { email, password } = req.body;
    const existingUser = await Auth.findOne({ email });
    
    if(!existingUser) {
      return res.status(400).json({ "message": "You don't have an account" });
    }

    const inputhash = hashPassword(password, existingUser.salt);
  
    if(inputhash !== existingUser.password) {
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
  } catch (error) {
    console.log(`${error}`);
    throw new Error(`While logging in`);
  }
};

// via old password
export const handleForgetPass = async(req: Request, res: Response) => {
  try {
    const { email, oldPassword, newPassword } = req.body;
    const user = await Auth.findOne({ email });

    if(!user) {
      return res.status(400).json({ "message": "Account with that email does not exists" });
    }

    const oldHash = hashPassword(oldPassword, user?.salt);

    if(oldHash !== user?.password) {
      return res.status(400).json({ "message": "You have entered a wrong password" });
    }

    const newSalt = generateSalt();
    const newHash = hashPassword(newPassword, newSalt);

    user.password = newHash;
    user.salt = newSalt;
    await user.save();
    return res.status(200).json({ "message": "Password changed successfully" });

  } catch (error) {
    console.log(`${error}`)
    throw new Error(`While changing the password`);
  }
}