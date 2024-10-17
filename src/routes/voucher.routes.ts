import { Router } from "express";
import VoucherController from "../controllers/voucher.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Vouchers
 *   description: Voucher management API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Voucher:
 *       type: object
 *       required:
 *         - code
 *         - discountType
 *         - discountValue
 *         - expirationDate
 *         - usageLimit
 *       properties:
 *         code:
 *           type: string
 *           description: Unique voucher code.
 *           example: WELCOME10
 *         discountType:
 *           type: string
 *           enum: [percentage, fixed]
 *           description: Type of discount applied by the voucher.
 *           example: percentage
 *         discountValue:
 *           type: number
 *           description: Value of the discount (percentage or fixed amount).
 *           example: 10
 *         expirationDate:
 *           type: string
 *           format: date
 *           description: Expiration date of the voucher.
 *           example: 2024-12-31
 *         usageLimit:
 *           type: number
 *           description: Maximum number of times this voucher can be used.
 *           example: 100
 *         usedCount:
 *           type: number
 *           description: Number of times the voucher has been used.
 *           example: 0
 *         minimumOrderValue:
 *           type: number
 *           description: Minimum order value required to use the voucher.
 *           example: 50
 */

/**
 * @swagger
 * /vouchers:
 *   post:
 *     summary: Create a new voucher
 *     description: >
 *       This endpoint allows users to create a new voucher by providing the necessary details
 *       such as the voucher code, discount type, discount value, expiration date, usage limit,
 *       and optional minimum order value. The voucher code must be unique, and an error will
 *       be returned if the code already exists.
 *     tags: [Vouchers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Voucher'
 *     responses:
 *       201:
 *         description: Voucher created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Voucher'
 *       400:
 *         description: Bad request (invalid input data or duplicate voucher code).
 */
router.post("/", VoucherController.createVoucher);

/**
 * @swagger
 * /vouchers:
 *   get:
 *     summary: Get all vouchers
 *     description: >
 *       This endpoint retrieves a list of all active vouchers in the system. Vouchers that have
 *       expired or exceeded their usage limits will not be included in the response. This is useful
 *       for administrators and users looking to view all available vouchers.
 *     tags: [Vouchers]
 *     responses:
 *       200:
 *         description: List of vouchers retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Voucher'
 *       500:
 *         description: Internal server error.
 */
router.get("/", VoucherController.getAllVouchers);

/**
 * @swagger
 * /vouchers/{id}:
 *   get:
 *     summary: Get a voucher by ID
 *     description: >
 *       This endpoint allows users to fetch a specific voucher by providing the voucher ID.
 *       The response includes detailed information about the voucher, such as its code, discount
 *       type, discount value, expiration date, and usage statistics. Useful for checking voucher
 *       details or managing vouchers.
 *     tags: [Vouchers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Voucher ID.
 *     responses:
 *       200:
 *         description: Voucher found and details returned successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Voucher'
 *       404:
 *         description: Voucher not found.
 *       500:
 *         description: Internal server error.
 */
router.get("/:id", VoucherController.getVoucherById);

/**
 * @swagger
 * /vouchers/{id}:
 *   put:
 *     summary: Update a voucher
 *     description: >
 *       This endpoint allows users to update the details of an existing voucher by providing the
 *       voucher ID and the updated voucher data. All fields can be modified except for the ID.
 *       Returns the updated voucher object upon success. If the voucher does not exist, an error
 *       will be returned.
 *     tags: [Vouchers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Voucher ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Voucher'
 *     responses:
 *       200:
 *         description: Voucher updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Voucher'
 *       404:
 *         description: Voucher not found.
 *       400:
 *         description: Bad request (invalid input data).
 *       500:
 *         description: Internal server error.
 */
router.put("/:id", VoucherController.updateVoucher);

/**
 * @swagger
 * /vouchers/{id}:
 *   delete:
 *     summary: Delete a voucher
 *     description: >
 *       This endpoint allows users to delete a voucher by providing the voucher ID. Upon successful
 *       deletion, a confirmation message will be returned. If the voucher does not exist, an error
 *       will be returned.
 *     tags: [Vouchers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Voucher ID.
 *     responses:
 *       200:
 *         description: Voucher deleted successfully.
 *       404:
 *         description: Voucher not found.
 *       500:
 *         description: Internal server error.
 */
router.delete("/:id", VoucherController.deleteVoucher);

export default router;
