import dotenv from "dotenv";

dotenv.config();

export const envConstants = {
  Port: process.env.PORT || 5000,
  MongoUri: process.env.MONGO_URI || "",
  MongoTestUri: process.env.MONGO_URI_TEST || "",
  JwtSecret: process.env.JWT_SECRET || "your_jwt_secret",
};
