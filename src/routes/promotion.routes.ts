import { Router } from "express";
import PromotionController from "../controllers/promotion.controller";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Promotion:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *           description: Unique promotion code used for applying the discount.
 *           example: SUMMER2024
 *         eligibleCategories:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               - Electronics
 *               - Fashion
 *               - Home
 *               - Beauty
 *               - Sports
 *           description: Array of product categories that the promotion is applicable to.
 *           example: [Electronics, Fashion]
 *         discountType:
 *           type: string
 *           enum: [percentage, fixed]
 *           description: Indicates whether the discount is a percentage off or a fixed amount off.
 *           example: percentage
 *         discountValue:
 *           type: number
 *           description: The value of the discount to be applied, either as a percentage or a fixed amount.
 *           example: 15
 *         expirationDate:
 *           type: string
 *           format: date
 *           description: The date when the promotion expires and can no longer be used.
 *           example: 2024-12-31
 *         usageLimit:
 *           type: number
 *           description: The maximum number of times this promotion can be applied.
 *           example: 100
 *         currentUses:
 *           type: number
 *           description: The current number of times this promotion has been used.
 *           example: 5
 */

/**
 * @swagger
 * /promotions:
 *   post:
 *     summary: Create a new promotion
 *     tags: [Promotions]
 *     description: This endpoint allows an admin to create a new promotion. The promotion must have a unique code and can apply to specified product categories with defined discount types and values. Validation checks ensure that the promotion code does not already exist.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Promotion'
 *     responses:
 *       201:
 *         description: Promotion created successfully, returns the created promotion object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Promotion'
 *       400:
 *         description: Bad request, promotion code already exists or invalid data provided.
 *       500:
 *         description: Internal server error, indicating a failure in creating the promotion.
 */
router.post("/", PromotionController.createPromotion);

/**
 * @swagger
 * /promotions:
 *   get:
 *     summary: Get all available promotions
 *     tags: [Promotions]
 *     description: This endpoint retrieves all active promotions that are still valid based on their expiration date and usage limits. Only promotions that have not expired and have remaining uses are returned.
 *     responses:
 *       200:
 *         description: A list of active promotions.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Promotion'
 *       404:
 *         description: No promotions found, meaning there are currently no valid promotions available.
 *       500:
 *         description: Internal server error, indicating a failure in fetching promotions.
 */
router.get("/", PromotionController.getAllPromotions);

/**
 * @swagger
 * /promotions/{id}:
 *   get:
 *     summary: Get a promotion by ID
 *     tags: [Promotions]
 *     description: This endpoint retrieves a specific promotion based on its unique ID. If the promotion is not found, an error is returned.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the promotion to retrieve.
 *     responses:
 *       200:
 *         description: Promotion found successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Promotion'
 *       404:
 *         description: Promotion not found, meaning the provided ID does not match any existing promotion.
 *       500:
 *         description: Internal server error, indicating a failure in retrieving the promotion.
 */
router.get("/:id", PromotionController.getPromotionById);

/**
 * @swagger
 * /promotions/{id}:
 *   put:
 *     summary: Update a promotion by ID
 *     tags: [Promotions]
 *     description: This endpoint allows for the updating of an existing promotion using its unique ID. The request body must include the new promotion details. If the promotion does not exist, an error is returned.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the promotion to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Promotion'
 *     responses:
 *       200:
 *         description: Promotion updated successfully, returns the updated promotion object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Promotion'
 *       404:
 *         description: Promotion not found, meaning the provided ID does not match any existing promotion.
 *       400:
 *         description: Bad request, indicating invalid data was provided for the update.
 *       500:
 *         description: Internal server error, indicating a failure in updating the promotion.
 */
router.put("/:id", PromotionController.updatePromotion);

/**
 * @swagger
 * /promotions/{id}:
 *   delete:
 *     summary: Delete a promotion by ID
 *     tags: [Promotions]
 *     description: This endpoint allows for the deletion of a promotion using its unique ID. If the promotion does not exist, an error is returned.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the promotion to delete.
 *     responses:
 *       200:
 *         description: Promotion deleted successfully.
 *       404:
 *         description: Promotion not found, meaning the provided ID does not match any existing promotion.
 *       500:
 *         description: Internal server error, indicating a failure in deleting the promotion.
 */
router.delete("/:id", PromotionController.deletePromotion);

export default router;
