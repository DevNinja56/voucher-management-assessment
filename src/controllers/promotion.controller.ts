import { Request, Response } from "express";
import PromotionService from "../services/promotion.service";
import { successResponse, errorResponse } from "../utils/response.util";

const createPromotion = async (req: Request, res: Response) => {
  try {
    const promotion = await PromotionService.createPromotion(req.body);
    successResponse(res, promotion, "Promotion created successfully");
  } catch (error) {
    errorResponse(res, (error as Error).message);
  }
};

const getAllPromotions = async (_req: Request, res: Response) => {
  try {
    const promotions = await PromotionService.getAllPromotions();
    successResponse(res, promotions, "Promotions retrieved successfully");
  } catch (error) {
    errorResponse(res, (error as Error).message);
  }
};

const getPromotionById = async (req: Request, res: Response) => {
  try {
    const promotion = await PromotionService.getPromotionById(req.params.id);
    successResponse(res, promotion, "Promotion retrieved successfully");
  } catch (error) {
    errorResponse(res, (error as Error).message);
  }
};

const updatePromotion = async (req: Request, res: Response) => {
  try {
    const promotion = await PromotionService.updatePromotion(
      req.params.id,
      req.body
    );
    successResponse(res, promotion, "Promotion updated successfully");
  } catch (error) {
    errorResponse(res, (error as Error).message);
  }
};

const deletePromotion = async (req: Request, res: Response) => {
  try {
    await PromotionService.deletePromotion(req.params.id);
    successResponse(res, null, "Promotion deleted successfully");
  } catch (error) {
    errorResponse(res, (error as Error).message);
  }
};

export default {
  createPromotion,
  getAllPromotions,
  getPromotionById,
  updatePromotion,
  deletePromotion,
};
