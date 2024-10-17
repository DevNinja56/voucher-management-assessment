import Promotion, { IPromotion } from "../models/promotions.model";

const createPromotion = async (data: Partial<IPromotion>) => {
  if (await Promotion.findOne({ code: data.code })) {
    throw new Error("Promotion code already exists");
  }

  const promotion = new Promotion(data);
  return await promotion.save();
};

const getAllPromotions = async () => {
  return await Promotion.find({
    expirationDate: { $gte: new Date() },
    $expr: { $lt: ["$currentUses", "$usageLimit"] },
  });
};

const getPromotionById = async (id: string) => {
  const promotion = await Promotion.findById(id);
  if (!promotion) throw new Error("Promotion not found");
  return promotion;
};

const updatePromotion = async (id: string, data: Partial<IPromotion>) => {
  const promotion = await Promotion.findByIdAndUpdate(id, data, { new: true });
  if (!promotion) throw new Error("Promotion not found");
  return promotion;
};

const deletePromotion = async (id: string) => {
  const promotion = await Promotion.findByIdAndDelete(id);
  if (!promotion) throw new Error("Promotion not found");
  return promotion;
};

const validatePromotion = async (
  code: string,
  productCategory: string,
  _orderAmount: number
) => {
  const promotion = await Promotion.findOne({ code });
  if (!promotion) throw new Error("Invalid promotion code");

  if (promotion.expirationDate < new Date()) {
    throw new Error("Promotion expired");
  }

  if (promotion.currentUses >= promotion.usageLimit) {
    throw new Error("Promotion usage limit exceeded");
  }

  if (!promotion.eligibleCategories.includes(productCategory)) {
    throw new Error("This promotion is not applicable to the product category");
  }

  return promotion;
};

export default {
  createPromotion,
  getAllPromotions,
  getPromotionById,
  updatePromotion,
  deletePromotion,
  validatePromotion,
};
