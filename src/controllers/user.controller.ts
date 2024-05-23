import { NextFunction, Request, Response } from "express";

import { ErrorHandler } from "../utils/error-handler";
import { userAdminModel } from "../models/admin.model";
import { userSellerModel } from "../models/seller.model";
import { getAllSellersService } from "../service/user.service";
import { CatchAsyncError } from "../middleware/catch-async-error";

export const getUserById = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // get user by id
      const userId = req.params.id;
      // Busca o usuário pelo ID
      const userAdmin = await userAdminModel.findById(userId);
      if (!userAdmin) {
        const userSeller = await userSellerModel.findById(userId);
        if (!userSeller) {
          return next(new ErrorHandler(400, "User is not authenticated"));
        }
        return res.status(404).json({ message: "User not found" });
      }
      // Retorna as informações do usuário
      res.status(200).json(userAdmin);
    } catch (error: any) {
      return next(new ErrorHandler(500, error.message));
    }
  }
);

export const getUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // get user by id
      const { id, role } = req.params;

      if (role === "ADMIN") {
        // Busca o usuário pelo ID
        const userAdmin = await userAdminModel.findById(id);

        return res.status(200).json({ userInfo: userAdmin });
      } else {
        // Busca o usuário pelo ID
        const userSeller = await userSellerModel.findById(id);
        return res.status(200).json({ userInfo: userSeller });
      }
    } catch (error: any) {
      console.error(error);
      return next(new ErrorHandler(500, error.message));
    }
  }
);

export const getRole = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userRole = req.userAdmin?.role || req.userSeller?.role;
      if (!userRole) {
        return next(new ErrorHandler(400, "User role not found"));
      }

      res.status(200).json({ roles: userRole });
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
