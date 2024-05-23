import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

import { ErrorHandler } from "../utils/error-handler";
import { CatchAsyncError } from "./catch-async-error";
import { IUserSeller, userSellerModel } from "../models/seller.model";
import { IUserAdmin, userAdminModel } from "../models/admin.model";

// declare global
declare global {
  namespace Express {
    interface Request {
      userAdmin?: IUserAdmin;
      userSeller?: IUserSeller;
    }
  }
}

// authenticated user
export const isAuthenticated = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token;

    if (!access_token) {
      return next(new ErrorHandler(400, "User is not authenticated"));
    }

    const decoded = jwt.verify(
      access_token,
      process.env.JWT_ACCESS_TOKEN as string
    ) as JwtPayload;

    if (!decoded) {
      return next(new ErrorHandler(400, "access token is not valid"));
    }

    // Busca o usuário no banco de dados admin
    const user = await userAdminModel.findById(decoded.id);

    // Se não encontrar no modelo de administrador, busca no modelo de vendedor
    if (!user) {
      const userSeller = await userSellerModel.findById(decoded.id);

      if (!userSeller) {
        return next(new ErrorHandler(400, "User is not authenticated"));
      }

      req.userSeller = userSeller;
    } else {
      req.userAdmin = user;
    }

    next();
  }
);

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.userAdmin?.role || req.userSeller?.role;

    if (!roles.includes(userRole || "")) {
      return next(
        new ErrorHandler(
          403,
          `Role: ${userRole} is not allowed to access this resource`
        )
      );
    }
    next();
  };
};
