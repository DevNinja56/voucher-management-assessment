import { Request, Response } from "express";
import OrderService from "../services/order.service";
import { successResponse, errorResponse } from "../utils/response.util";

const createOrder = async (req: Request, res: Response) => {
  try {
    const orderData = {
      ...req.body,
      user: req.user,
    };
    const order = await OrderService.createOrder(orderData);
    successResponse(res, order, "Order created successfully");
  } catch (error) {
    errorResponse(res, (error as Error).message);
  }
};

const getAllOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await OrderService.getAllOrders();
    successResponse(res, orders, "Orders retrieved successfully");
  } catch (error) {
    errorResponse(res, (error as Error).message);
  }
};

const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await OrderService.getOrderById(req.params.id);
    successResponse(res, order, "Order retrieved successfully");
  } catch (error) {
    errorResponse(res, (error as Error).message);
  }
};

const getUserOrders = async (req: Request, res: Response) => {
  try {
    const orders = await OrderService.getUserOrders(req.params.userId);
    successResponse(res, orders, "User orders retrieved successfully");
  } catch (error) {
    errorResponse(res, (error as Error).message);
  }
};

export default {
  createOrder,
  getAllOrders,
  getOrderById,
  getUserOrders,
};
