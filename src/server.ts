import dotenv from "dotenv";
import app from "./app";
import connectDB from "./config/db";
import { envConstants } from "./constants";

dotenv.config();

const PORT = envConstants.Port;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();
