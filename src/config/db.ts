import mongoose from "mongoose";
import dotenv from "dotenv";
import { envConstants } from "../constants";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(envConstants.MongoUri);
    console.log("MongoDB connected successfully...");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;
