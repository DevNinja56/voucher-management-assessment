import Product, { IProduct } from "../models/products.model";

const createProduct = async (
  name: string,
  description: string,
  price: number,
  category: string,
  stock: number
) => {
  const product = new Product({
    name,
    description,
    price,
    category,
    stock,
  });
  await product.save();
  return product;
};

const getAllProducts = async () => {
  return await Product.find({});
};

const getProductById = async (id: string) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new Error("Product not found");
  }
  return product;
};

const updateProduct = async (id: string, updateData: Partial<IProduct>) => {
  const product = await Product.findByIdAndUpdate(id, updateData, {
    new: true,
  });
  if (!product) {
    throw new Error("Product not found");
  }
  return product;
};

const deleteProduct = async (id: string) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    throw new Error("Product not found");
  }
};

export default {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
