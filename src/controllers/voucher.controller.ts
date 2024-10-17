import { Request, Response } from "express";
import VoucherService from "../services/voucher.service";
import { successResponse, errorResponse } from "../utils/response.util";

const createVoucher = async (req: Request, res: Response) => {
  try {
    const voucher = await VoucherService.createVoucher(req.body);
    successResponse(res, voucher, "Voucher created successfully");
  } catch (error) {
    errorResponse(res, (error as Error).message);
  }
};

const getAllVouchers = async (_req: Request, res: Response) => {
  try {
    const vouchers = await VoucherService.getAllVouchers();
    successResponse(res, vouchers, "Vouchers retrieved successfully");
  } catch (error) {
    errorResponse(res, (error as Error).message);
  }
};

const getVoucherById = async (req: Request, res: Response) => {
  try {
    const voucher = await VoucherService.getVoucherById(req.params.id);
    successResponse(res, voucher, "Voucher retrieved successfully");
  } catch (error) {
    errorResponse(res, (error as Error).message);
  }
};

const updateVoucher = async (req: Request, res: Response) => {
  try {
    const voucher = await VoucherService.updateVoucher(req.params.id, req.body);
    successResponse(res, voucher, "Voucher updated successfully");
  } catch (error) {
    errorResponse(res, (error as Error).message);
  }
};

const deleteVoucher = async (req: Request, res: Response) => {
  try {
    await VoucherService.deleteVoucher(req.params.id);
    successResponse(res, { message: "Voucher deleted successfully" });
  } catch (error) {
    errorResponse(res, (error as Error).message);
  }
};

export default {
  createVoucher,
  getAllVouchers,
  getVoucherById,
  updateVoucher,
  deleteVoucher,
};
