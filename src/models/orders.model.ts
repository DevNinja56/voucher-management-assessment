import mongoose, { Document, Schema } from "mongoose";

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  quantity: number;
  totalAmount: number;
  voucher?: mongoose.Types.ObjectId;
  promotion?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    voucher: { type: mongoose.Schema.Types.ObjectId, ref: "Voucher" },
    promotion: { type: mongoose.Schema.Types.ObjectId, ref: "Promotion" },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>("Order", orderSchema);
