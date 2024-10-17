import { Router } from "express";
import OrderController from "../controllers/order.controller";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - product
 *         - quantity
 *       properties:
 *         product:
 *           type: string
 *           description: ID of the product being ordered.
 *         quantity:
 *           type: number
 *           description: Quantity of the product ordered.
 *         voucher:
 *           type: string
 *           description: ID of the voucher applied to the order (optional).
 *         promotion:
 *           type: string
 *           description: ID of the promotion applied to the order (optional).
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order.
 *     description: >
 *       This endpoint allows users to create a new order by providing the required details such as
 *       product ID and quantity. Optional voucher and promotion IDs can also be
 *       provided.
 *
 *       The following rules apply:
 *       - A voucher or promotion cannot be used more than once in a single order.
 *       - Maximum discount cannot exceed 50% of the total order value.
 *       - Vouchers are validated for expiration and usage limits.
 *       - Promotions are checked against eligibility criteria, including expiration dates, usage limits,
 *         and applicable product categories.
 *
 *       If valid:
 *       - The order total may be reduced based on the discount specified by the voucher, promotion.
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Order created successfully. Returns the created order object with applied discounts.
 *       400:
 *         description: Bad request if any required fields are missing or if there are validation errors related to the product, voucher, or promotion.
 */
router.post("/", authMiddleware, OrderController.createOrder);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Retrieve all orders.
 *     description: >
 *       This endpoint returns a list of all orders placed in the system. Each order includes
 *       detailed information such as user details, product information, and any applied
 *       vouchers or promotions. It is useful for administrators or users who wish to view all
 *       orders.
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: List of all orders retrieved successfully, populated with user, product, voucher, and promotion details.
 *       404:
 *         description: No orders found in the system.
 */
router.get("/", OrderController.getAllOrders);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Retrieve an order by ID.
 *     description: >
 *       This endpoint allows users to fetch a specific order by providing the order ID.
 *       The response includes detailed information about the order, including associated
 *       user, product, voucher, and promotion information.
 *       Useful for checking order status or details.
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order found and details returned successfully.
 *       404:
 *         description: Order not found with the specified ID.
 */
router.get("/:id", OrderController.getOrderById);

/**
 * @swagger
 * /orders/user/{userId}:
 *   get:
 *     summary: Retrieve all orders for a specific user.
 *     description: >
 *       This endpoint allows the retrieval of all orders placed by a specific user, identified
 *       by the user ID. The response includes details of each order, populated with associated
 *       user, product, voucher, and promotion information.
 *       Useful for users to track their order history.
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of orders for the specified user retrieved successfully, with details populated.
 *       404:
 *         description: No orders found for the specified user ID.
 */
router.get("/user/:userId", OrderController.getUserOrders);

export default router;
