import mongoose, { Document, Schema } from "mongoose";
import { ProductCategory } from "./products.model";

export interface IPromotion extends Document {
  code: string;
  eligibleCategories: string[];
  discountType: string;
  discountValue: number;
  expirationDate: Date;
  usageLimit: number;
  currentUses: number;
}

const promotionSchema = new Schema<IPromotion>(
  {
    code: { type: String, required: true, unique: true },
    eligibleCategories: [
      { type: String, enum: Object.values(ProductCategory), required: true },
    ],
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    discountValue: { type: Number, required: true },
    expirationDate: { type: Date, required: true },
    usageLimit: { type: Number, required: true },
    currentUses: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IPromotion>("Promotion", promotionSchema);
