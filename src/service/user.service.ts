import { Response } from "express";
import { userSellerModel } from "../models/seller.model";

export const getAllSellersService = async (res: Response) => {
  const sellers = await userSellerModel.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    sellers,
  });
};
