import { NextFunction, Request, Response } from "express";

import { ErrorHandler } from "../utils/error-handler";
import { userAdminModel } from "../models/admin.model";
import { CatchAsyncError } from "../middleware/catch-async-error";
import { getAllSellersService } from "../service/user.service";

export const getUserInfo = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.id;
      // Busca o usuário pelo ID
      const user = await userAdminModel.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Retorna as informações do usuário
      res.status(200).json(user);
    } catch (error: any) {
      return next(new ErrorHandler(500, error.message));
    }
  }
);

// get all users --- only for admin
export const getAllSellersInfo = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllSellersService(res);
    } catch (error: any) {
      return next(new ErrorHandler(500, error.message));
    }
  }
);
