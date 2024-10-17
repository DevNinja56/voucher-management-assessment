import { Router } from "express";
import userRoutes from "./user.routes";
import productRoutes from "./product.routes";
import voucherRoutes from "./voucher.routes";
import promotionRoutes from "./promotion.routes";
import orderRoutes from "./order.routes";

const router = Router();

router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/vouchers", voucherRoutes);
router.use("/promotions", promotionRoutes);
router.use("/orders", orderRoutes);

export default router;
