import mongoose from "mongoose";
import Order, { IOrder } from "../models/orders.model";
import Product from "../models/products.model";
import Voucher from "../models/vouchers.model";
import Promotion from "../models/promotions.model";
import { calculateDiscount } from "../utils/helperFunctions.util";

const createOrder = async (data: Partial<IOrder>) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (!data.product || !data.quantity) {
      throw new Error("Missing required fields: product or quantity");
    }

    const product = await Product.findById(data.product).session(session);
    if (!product) throw new Error("Product not found");
    if (product.stock < data.quantity) throw new Error("Insufficient stock");

    let totalDiscount = 0;
    let totalAmount = product.price * data.quantity;

    // Process voucher if provided
    if (data.voucher) {
      const voucher = await Voucher.findById(data.voucher).session(session);
      if (!voucher) throw new Error("Voucher not found");
      if (voucher.expirationDate < new Date()) {
        throw new Error("Voucher expired");
      }
      if (voucher.usedCount >= voucher.usageLimit) {
        throw new Error("Voucher usage limit exceeded");
      }

      if (totalAmount < (voucher.minimumOrderValue || 0)) {
        throw new Error("Order value does not meet minimum requirement");
      }

      let voucherDiscount = calculateDiscount(
        voucher.discountType,
        voucher.discountValue,
        totalAmount
      );
      if (voucherDiscount > totalAmount * 0.5) {
        voucherDiscount = totalAmount * 0.5;
      }

      totalDiscount += voucherDiscount;
      voucher.usedCount++; // Mark as used for this session
      await voucher.save({ session });
    }

    // Process promotion if provided
    if (data.promotion) {
      const promotion = await Promotion.findById(data.promotion).session(
        session
      );
      if (!promotion) throw new Error("Promotion not found");
      if (promotion.expirationDate < new Date()) {
        throw new Error("Promotion expired");
      }
      if (promotion.currentUses >= promotion.usageLimit) {
        throw new Error("Promotion usage limit exceeded");
      }
      if (!promotion.eligibleCategories.includes(product.category)) {
        throw new Error("Promotion not applicable to this product");
      }

      let promotionDiscount = calculateDiscount(
        promotion.discountType,
        promotion.discountValue,
        totalAmount
      );
      if (promotionDiscount > totalAmount * 0.5) {
        promotionDiscount = totalAmount * 0.5;
      }

      totalDiscount += promotionDiscount;
      promotion.currentUses++; // Increment usage for this session
      await promotion.save({ session });
    }

    // Ensure total discount does not exceed 50% of total amount
    if (totalDiscount > totalAmount * 0.5) {
      throw new Error("Maximum discount limit exceeded");
    }

    totalAmount -= totalDiscount;

    const order = new Order({
      user: data.user as mongoose.Types.ObjectId,
      product: data.product as mongoose.Types.ObjectId,
      quantity: data.quantity,
      totalAmount,
      voucher: data.voucher || undefined,
      promotion: data.promotion || undefined,
    });

    product.stock -= data.quantity;
    await product.save({ session });

    await order.save({ session });
    await session.commitTransaction();
    return order;
  } catch (error) {
    await session.abortTransaction();
    throw new Error((error as Error).message);
  } finally {
    session.endSession();
  }
};

const getAllOrders = async () => {
  return await Order.find().populate("user product voucher promotion");
};

const getOrderById = async (id: string) => {
  const order = await Order.findById(id).populate(
    "user product voucher promotion"
  );
  if (!order) {
    throw new Error("Order not found");
  }
  return order;
};

const getUserOrders = async (userId: string) => {
  return await Order.find({ user: userId }).populate(
    "user product voucher promotion"
  );
};

export default {
  createOrder,
  getAllOrders,
  getOrderById,
  getUserOrders,
};
