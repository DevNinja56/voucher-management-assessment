import { Request, Response } from "express";
import UserService from "../services/user.service";
import { successResponse, errorResponse } from "../utils/response.util";

const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const { user, token } = await UserService.registerUser(
      name,
      email,
      password
    );
    successResponse(
      res,
      { user: { id: user._id, name: user.name, email: user.email }, token },
      "User registered successfully"
    );
  } catch (error) {
    errorResponse(res, (error as Error).message);
  }
};

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const { user, token } = await UserService.loginUser(email, password);
    successResponse(
      res,
      { user: { id: user._id, name: user.name, email: user.email }, token },
      "User logged in successfully"
    );
  } catch (error) {
    errorResponse(res, (error as Error).message);
  }
};

const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await UserService.getAllUsers();
    successResponse(res, users, "Users retrieved successfully");
  } catch (error) {
    errorResponse(res, (error as Error).message);
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await UserService.getUserById(req.params.id);
    successResponse(res, user, "User retrieved successfully");
  } catch (error) {
    errorResponse(res, (error as Error).message);
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await UserService.deleteUser(req.params.id);
    successResponse(res, { message: "User deleted successfully" });
  } catch (error) {
    errorResponse(res, (error as Error).message);
  }
};

export default {
  registerUser,
  loginUser,
  getUsers,
  getUserById,
  deleteUser,
};
