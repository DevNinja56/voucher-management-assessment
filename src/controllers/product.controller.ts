import { Request, Response } from "express";
import ProductService from "../services/product.service";
import { successResponse, errorResponse } from "../utils/response.util";

const createProduct = async (req: Request, res: Response) => {
  const { name, description, price, category, stock } = req.body;

  try {
    const product = await ProductService.createProduct(
      name,
      description,
      price,
      category,
      stock
    );
    successResponse(res, product, "Product created successfully");
  } catch (error) {
    errorResponse(res, (error as Error).message);
  }
};

const getProducts = async (_req: Request, res: Response) => {
  try {
    const products = await ProductService.getAllProducts();
    successResponse(res, products, "Products retrieved successfully");
  } catch (error) {
    errorResponse(res, (error as Error).message);
  }
};

const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await ProductService.getProductById(req.params.id);
    successResponse(res, product, "Product retrieved successfully");
  } catch (error) {
    errorResponse(res, (error as Error).message);
  }
};

const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedProduct = await ProductService.updateProduct(id, updateData);
    successResponse(res, updatedProduct, "Product updated successfully");
  } catch (error) {
    errorResponse(res, (error as Error).message);
  }
};

const deleteProduct = async (req: Request, res: Response) => {
  try {
    await ProductService.deleteProduct(req.params.id);
    successResponse(res, { message: "Product deleted successfully" });
  } catch (error) {
    errorResponse(res, (error as Error).message);
  }
};

export default {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
