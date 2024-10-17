import Voucher, { IVoucher } from "../models/vouchers.model";

const createVoucher = async (data: Partial<IVoucher>) => {
  if (await Voucher.findOne({ code: data.code })) {
    throw new Error("Voucher code already exists");
  }

  const voucher = new Voucher(data);
  return await voucher.save();
};

const getAllVouchers = async () => {
  return await Voucher.find({
    expirationDate: { $gte: new Date() },
    $expr: { $lt: ["$usedCount", "$usageLimit"] },
  });
};

const getVoucherById = async (id: string) => {
  const voucher = await Voucher.findById(id);
  if (!voucher) throw new Error("Voucher not found");
  return voucher;
};

const updateVoucher = async (id: string, data: Partial<IVoucher>) => {
  const voucher = await Voucher.findByIdAndUpdate(id, data, { new: true });
  if (!voucher) throw new Error("Voucher not found");
  return voucher;
};

const deleteVoucher = async (id: string) => {
  const voucher = await Voucher.findByIdAndDelete(id);
  if (!voucher) throw new Error("Voucher not found");
  return voucher;
};

const validateVoucher = async (code: string, orderAmount: number) => {
  const voucher = await Voucher.findOne({ code });
  if (!voucher) throw new Error("Invalid voucher code");

  if (voucher.expirationDate < new Date()) {
    throw new Error("Voucher expired");
  }

  if (voucher.usedCount >= voucher.usageLimit) {
    throw new Error("Voucher usage limit exceeded");
  }

  if (voucher.minimumOrderValue && orderAmount < voucher.minimumOrderValue) {
    throw new Error(
      `Minimum order value of ${voucher.minimumOrderValue} required`
    );
  }

  return voucher;
};

export default {
  createVoucher,
  getAllVouchers,
  getVoucherById,
  updateVoucher,
  deleteVoucher,
  validateVoucher,
};
