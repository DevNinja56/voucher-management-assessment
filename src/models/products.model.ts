import mongoose, { Document, Schema } from "mongoose";

export enum ProductCategory {
  ELECTRONICS = "Electronics",
  FASHION = "Fashion",
  HOME = "Home",
  BEAUTY = "Beauty",
  SPORTS = "Sports",
}

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  stock: number;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: {
      type: String,
      enum: Object.values(ProductCategory),
      required: true,
    },
    stock: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>("Product", productSchema);
