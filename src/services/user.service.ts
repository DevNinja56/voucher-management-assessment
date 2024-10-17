import User, { IUser } from "../models/users.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { envConstants } from "../constants";

const JWT_SECRET = envConstants.JwtSecret;

const registerUser = async (name: string, email: string, password: string) => {
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });
  const token = generateToken(user._id.toString());
  return { user, token };
};

const loginUser = async (email: string, password: string) => {
  const user: IUser | null = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user._id.toString());
  return { user, token };
};

const getAllUsers = async () => {
  return await User.find({}, "-password");
};

const getUserById = async (id: string) => {
  const user = await User.findById(id, "-password");
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

const deleteUser = async (id: string) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

const generateToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1h" });
};

export default {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  deleteUser,
};
