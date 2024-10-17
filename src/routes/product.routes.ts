import { Router } from "express";
import ProductController from "../controllers/product.controller";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - price
 *         - category
 *         - stock
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the product.
 *         description:
 *           type: string
 *           description: A detailed description of the product.
 *         price:
 *           type: number
 *           description: The price of the product.
 *         category:
 *           type: string
 *           description: The category under which the product is classified.
 *           enum:  # Enum with category options for dropdown selection
 *             - Electronics
 *             - Fashion
 *             - Home
 *             - Beauty
 *             - Sports
 *         stock:
 *           type: number
 *           description: The number of units available in stock.
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product.
 *     description: >
 *       This endpoint allows the creation of a new product by providing the necessary details such as
 *       name, description, price, category, and stock. All fields are required for successful creation.
 *       Upon successful creation, the product object will be returned.
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created successfully. Returns the created product object.
 *       400:
 *         description: Invalid product data. Required fields may be missing or invalid.
 */
router.post("/", ProductController.createProduct);

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Retrieve all products.
 *     description: >
 *       This endpoint retrieves a list of all products available in the system. Each product includes
 *       essential information such as name, description, price, category, and stock status.
 *       This is useful for administrators and users who wish to browse all available products.
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       404:
 *         description: No products found in the system.
 */
router.get("/", ProductController.getProducts);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Retrieve a product by ID.
 *     description: >
 *       This endpoint allows users to fetch a specific product by providing the product ID.
 *       The response includes detailed information about the product, such as its name, description,
 *       price, category, and stock availability. Useful for viewing specific product details.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the product.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product found and details returned successfully.
 *       404:
 *         description: Product not found with the specified ID.
 */
router.get("/:id", ProductController.getProductById);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product.
 *     description: >
 *       This endpoint allows users to update an existing product by providing the product ID
 *       and the updated details. All fields can be updated except for the ID.
 *       Returns the updated product object upon success.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the product to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully. Returns the updated product object.
 *       404:
 *         description: Product not found with the specified ID.
 *       400:
 *         description: Invalid update data. Required fields may be missing or invalid.
 */
router.put("/:id", ProductController.updateProduct);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product.
 *     description: >
 *       This endpoint allows users to delete a product by providing the product ID.
 *       Upon successful deletion, a confirmation message is returned.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the product to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully.
 *       404:
 *         description: Product not found with the specified ID.
 */
router.delete("/:id", ProductController.deleteProduct);

export default router;
