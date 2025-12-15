import { Request, Response } from "express";
import Auth from "../models/auth";
import { generateToken } from "../services/authToken";
import { generateSalt, hashPassword } from "../services/authUtils";
import { sendEmail } from "../services/sendEmail";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { verifyAcc } from "../services/verifyAcc";

dotenv.config();

export const handleUserSignUp = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All the fields are required" });
    }

    const existingUser = await Auth.findOne({ email });
    if(existingUser) {
      return res.status(400).json({ "message": "You already have an account, login instead OR if you want to verify your email then check your email inbox or contact us" });
    }

    const salt = generateSalt();
    const hash = hashPassword(password, salt);

    const newUser = new Auth({
      name,
      email,
      password: hash,
      salt: salt,
      isVerified: false,
    });
    await newUser.save();
    verifyAcc(newUser);

    return res.status(200).json({ message: "Email sent for verification" });
  } catch (error) {
    console.log(`While signing up`);
    throw new Error(`While creating a new User`);
  }
};

export const handleVerifyEmail = async (req: Request, res: Response) => {
  try {
    const queryHash = req.query.hash as string;
    const decoder = jwt.verify(queryHash, process.env.JWT_ENCRYP_KEY!) as {
      email: string;
      name: string;
    };

    const user = await Auth.findOne({ email: decoder.email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User with that email is not registered" });
    }

    user.isVerified = true;
    await user.save();
    return res.status(200).json({ "message": "Email is verified, now you can login to your account" });
  } catch (error) {
    console.log(`${error}`);
    throw new Error(`While verifying the email`);
  }
};

export const handleUserLogIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All the fields are required" });
  }
  try {
    const existingUser = await Auth.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({ message: "You don't have an account" });
    }

    if (!existingUser.isVerified) {
      return res.status(400).json({ message: "Account is unverified" });
    }

    const inputhash = hashPassword(password, existingUser.salt);

    if (inputhash !== existingUser.password) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = generateToken(existingUser);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ message: "Logged in success" });
  } catch (error) {
    console.log(`${error}`);
    throw new Error(`While logging in`);
  }
};

// via old password
export const handleForgetPassViaOld = async (req: Request, res: Response) => {
  const { email, oldPassword, newPassword } = req.body;
  if (!email || !oldPassword || !newPassword) {
    return res.status(400).json({ message: "All the fields are required" });
  }

  try {
    const user = await Auth.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Account with that email does not exists" });
    }

    const oldHash = hashPassword(oldPassword, user?.salt);
    if (oldHash !== user?.password) {
      return res
        .status(400)
        .json({ message: "You have entered a wrong password" });
    }

    const newSalt = generateSalt();
    const newHash = hashPassword(newPassword, newSalt);

    user.password = newHash;
    user.salt = newSalt;
    await user.save();
    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.log(`${error}`);
    throw new Error(`While changing the password`);
  }
};

// via nodemailer
export const handlerForgetPassViaEmail = async (
  req: Request,
  res: Response
) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Enter all the required fields" });
  }
  try {
    const user = await Auth.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ message: "This email isn't registered to any accounts" });
    }

    const status = sendEmail(user);
    if (!status) {
      return res
        .status(400)
        .json({ message: "Email couldn't be sent at the moment" });
    }
    return res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.log(`${error}`);
    throw new Error(`While user tried to change pass via email`);
  }
};

export const changeUserPass = async (req: Request, res: Response) => {
  const { newPassword } = req.body;
  const token = req.query.token as string;

  if (!newPassword) {
    return res.status(400).json({ message: "All the fields are required" });
  }

  if (!token) {
    return res.status(400).json({ message: "No validated token found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ENCRYP_KEY!) as {
      name: string;
      email: string;
    };

    const user = await Auth.findOne({ email: decoded.email });
    if (!user) {
      return res.status(400).json({ message: "Token is altered" });
    }

    const newSalt = generateSalt();
    const newHash = hashPassword(newPassword, newSalt);
    user.password = newHash;
    user.salt = newSalt;
    await user.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.log(`${error}`);
    throw new Error(`While changing password via email`);
  }
};
