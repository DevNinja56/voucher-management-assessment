import mongoose from "mongoose";
import OrderService from "../services/order.service";
import ProductService from "../services/product.service";
import VoucherService from "../services/voucher.service";
import PromotionService from "../services/promotion.service";
import { IProduct } from "../models/products.model";
import { envConstants } from "../constants";
import Order from "../models/orders.model";
import Product from "../models/products.model";
import Promotion from "../models/promotions.model";
import Voucher from "../models/vouchers.model";

beforeAll(async () => {
  await mongoose.connect(envConstants.MongoTestUri);
});

afterEach(async () => {
  await Promise.all([
    Order.deleteMany({}),
    Product.deleteMany({}),
    Voucher.deleteMany({}),
    Promotion.deleteMany({}),
  ]);
});

afterAll(async () => {
  await mongoose.connection.close();
});

const createProduct = async (): Promise<IProduct> => {
  const productData = {
    name: "Test Product",
    description: "This is a test product",
    price: 100,
    category: "Electronics",
    stock: 10,
  };
  return await ProductService.createProduct(
    productData.name,
    productData.description,
    productData.price,
    productData.category,
    productData.stock
  );
};

const createVoucher = async () => {
  const voucherData = {
    code: "TESTVOUCHER",
    discountType: "fixed",
    discountValue: 10,
    minimumOrderValue: 50,
    expirationDate: new Date(Date.now() + 86400000), // 1 day from now
    usageLimit: 100,
    usedCount: 0,
  };
  return await VoucherService.createVoucher(voucherData);
};

const createPromotion = async () => {
  const promotionData = {
    code: "TESTPROMO",
    eligibleCategories: ["Electronics"],
    discountType: "percentage",
    discountValue: 20,
    minimumOrderValue: 50,
    expirationDate: new Date(Date.now() + 86400000), // 1 day from now
    usageLimit: 100,
    currentUses: 0,
  };
  return await PromotionService.createPromotion(promotionData);
};

// Tests for the createOrder function
describe("Order Service", () => {
  it("should create an order successfully", async () => {
    const product = await createProduct();
    const user = new mongoose.Types.ObjectId();
    const orderData = {
      user: user._id,
      product: product._id as mongoose.Types.ObjectId,
      quantity: 2,
    };

    const createdOrder = await OrderService.createOrder(orderData);
    expect(createdOrder).toHaveProperty("_id");
    expect(createdOrder.quantity).toBe(2);
    expect(createdOrder.totalAmount).toBe(200); // 100 * 2
  });

  it("should throw an error if product not found", async () => {
    const orderData = {
      user: new mongoose.Types.ObjectId(),
      product: new mongoose.Types.ObjectId(), // Does not exsist
      quantity: 2,
    };

    await expect(OrderService.createOrder(orderData)).rejects.toThrow(
      "Product not found"
    );
  });

  it("should throw an error if insufficient stock", async () => {
    const product = await createProduct();
    const orderData = {
      user: new mongoose.Types.ObjectId(),
      product: product._id as mongoose.Types.ObjectId,
      quantity: 20, // More than available stock
    };

    await expect(OrderService.createOrder(orderData)).rejects.toThrow(
      "Insufficient stock"
    );
  });

  it("should apply voucher discount correctly", async () => {
    const product = await createProduct();
    const voucher = await createVoucher();
    const orderData = {
      user: new mongoose.Types.ObjectId(),
      product: product._id as mongoose.Types.ObjectId,
      quantity: 2,
      voucher: voucher._id as mongoose.Types.ObjectId,
    };

    const createdOrder = await OrderService.createOrder(orderData);
    expect(createdOrder.totalAmount).toBe(190); // 200 - 10
  });

  it("should throw an error if voucher is expired", async () => {
    const product = await createProduct();
    const voucherData = {
      code: "EXPIREDVOUCHER",
      discountType: "fixed",
      discountValue: 10,
      minimumOrderValue: 50,
      expirationDate: new Date(Date.now() - 86400000), // Expired 1 day ago
      usageLimit: 100,
      usedCount: 0,
    };
    const expiredVoucher = await VoucherService.createVoucher(voucherData);

    const orderData = {
      user: new mongoose.Types.ObjectId(),
      product: product._id as mongoose.Types.ObjectId,
      quantity: 2,
      voucher: expiredVoucher._id as mongoose.Types.ObjectId,
    };

    await expect(OrderService.createOrder(orderData)).rejects.toThrow(
      "Voucher expired"
    );
  });

  it("should throw an error if promotion is expired", async () => {
    const product = await createProduct();
    const promotionData = {
      code: "EXPIREDPROMO",
      eligibleCategories: ["Electronics"],
      discountType: "percentage",
      discountValue: 20,
      minimumOrderValue: 50,
      expirationDate: new Date(Date.now() - 86400000), // Expired 1 day ago
      usageLimit: 100,
      currentUses: 0,
    };
    const expiredPromotion = await PromotionService.createPromotion(
      promotionData
    );

    const orderData = {
      user: new mongoose.Types.ObjectId(),
      product: product._id as mongoose.Types.ObjectId,
      quantity: 2,
      promotion: expiredPromotion._id as mongoose.Types.ObjectId,
    };

    await expect(OrderService.createOrder(orderData)).rejects.toThrow(
      "Promotion expired"
    );
  });

  it("should throw an error if the promotion is not applicable to the product category", async () => {
    const product = await createProduct(); // This creates a product in the Electronics category
    const promotionData = {
      code: "ANOTHERDISCOUNT",
      eligibleCategories: ["Beauty"],
      discountType: "percentage",
      discountValue: 30,
      minimumOrderValue: 50,
      expirationDate: new Date(Date.now() + 86400000), // Valid for 1 day
      usageLimit: 100,
      currentUses: 0,
    };
    const promotion = await PromotionService.createPromotion(promotionData);

    const orderData = {
      user: new mongoose.Types.ObjectId(),
      product: product._id as mongoose.Types.ObjectId,
      quantity: 2,
      promotion: promotion._id as mongoose.Types.ObjectId, // Promotion not applicable
    };

    await expect(OrderService.createOrder(orderData)).rejects.toThrow(
      "Promotion not applicable to this product"
    );
  });

  it("should not allow combined discounts from voucher and promotion to exceed 50% of total order amount", async () => {
    const product = await createProduct();
    const voucherData = {
      code: "TOOMUCHDISCOUNT",
      discountType: "percentage",
      discountValue: 30,
      minimumOrderValue: 50,
      expirationDate: new Date(Date.now() + 86400000), // Valid for 1 day
      usageLimit: 100,
      usedCount: 0,
    };
    const voucher = await VoucherService.createVoucher(voucherData);

    const promotionData = {
      code: "ANOTHERDISCOUNT",
      eligibleCategories: ["Electronics"],
      discountType: "percentage",
      discountValue: 30,
      minimumOrderValue: 50,
      expirationDate: new Date(Date.now() + 86400000), // Valid for 1 day
      usageLimit: 100,
      currentUses: 0,
    };
    const promotion = await PromotionService.createPromotion(promotionData);

    const orderData = {
      user: new mongoose.Types.ObjectId(),
      product: product._id as mongoose.Types.ObjectId,
      quantity: 2,
      voucher: voucher._id as mongoose.Types.ObjectId,
      promotion: promotion._id as mongoose.Types.ObjectId,
    };

    await expect(OrderService.createOrder(orderData)).rejects.toThrow(
      "Maximum discount limit exceeded"
    );
  });

  it("should throw an error if voucher usage limit is exceeded", async () => {
    const product = await createProduct();
    const voucher = await createVoucher();
    voucher.usedCount = voucher.usageLimit; // Set to limit to exceed it
    await voucher.save();

    const orderData = {
      user: new mongoose.Types.ObjectId(),
      product: product._id as mongoose.Types.ObjectId,
      quantity: 2,
      voucher: voucher._id as mongoose.Types.ObjectId,
    };

    await expect(OrderService.createOrder(orderData)).rejects.toThrow(
      "Voucher usage limit exceeded"
    );
  });

  it("should throw an error if order value does not meet minimum voucher requirement", async () => {
    const product = await createProduct();
    const voucher = await createVoucher(); // Minimum order value is 50
    const orderData = {
      user: new mongoose.Types.ObjectId(),
      product: product._id as mongoose.Types.ObjectId,
      quantity: 1, // Total amount is 100, meets minimum
      voucher: voucher._id as mongoose.Types.ObjectId,
    };

    // Adjust order total to be less than the minimum voucher requirement
    await Product.updateOne({ _id: product._id }, { price: 30 }); // Adjust product price to 30
    const adjustedOrderData = {
      user: new mongoose.Types.ObjectId(),
      product: product._id as mongoose.Types.ObjectId,
      quantity: 1,
      voucher: voucher._id as mongoose.Types.ObjectId,
    };

    await expect(OrderService.createOrder(adjustedOrderData)).rejects.toThrow(
      "Order value does not meet minimum requirement"
    );
  });

  it("should use promotion correctly and update currentUses", async () => {
    const product = await createProduct();
    const promotion = await createPromotion();

    const orderData = {
      user: new mongoose.Types.ObjectId(),
      product: product._id as mongoose.Types.ObjectId,
      quantity: 2, // Total amount is 200
      promotion: promotion._id as mongoose.Types.ObjectId,
    };

    const createdOrder = await OrderService.createOrder(orderData);
    expect(createdOrder).toHaveProperty("_id");
    expect(createdOrder.totalAmount).toBe(160); // 200 - 20% = 160

    const updatedPromotion = await Promotion.findById(promotion._id);

    expect(updatedPromotion).not.toBeNull(); // Assert that it's not null
    if (updatedPromotion) {
      expect(updatedPromotion.currentUses).toBe(1); // Should increment usage
    }
  });
});
