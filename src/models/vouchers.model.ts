import mongoose, { Document, Schema } from "mongoose";

export interface IVoucher extends Document {
  code: string;
  discountType: string;
  discountValue: number;
  expirationDate: Date;
  usageLimit: number;
  usedCount: number;
  minimumOrderValue?: number;
}

const voucherSchema = new Schema<IVoucher>(
  {
    code: { type: String, unique: true, required: true },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    discountValue: { type: Number, required: true },
    expirationDate: { type: Date, required: true },
    usageLimit: { type: Number, required: true },
    usedCount: { type: Number, default: 0 },
    minimumOrderValue: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IVoucher>("Voucher", voucherSchema);
