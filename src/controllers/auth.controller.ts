import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";

import { sendToken } from "../utils/jwt";
import { ErrorHandler } from "../utils/error-handler";
import { userAdminModel } from "../models/admin.model";
import { CatchAsyncError } from "../middleware/catch-async-error";

interface IAdminLoginRequest {
  email: string;
  password: string;
}

export const admin_login = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as IAdminLoginRequest;

      if (!email || !password) {
        return next(new ErrorHandler(400, "Please provide email and password"));
      }

      const adminUser = await userAdminModel
        .findOne({ email })
        .select("+password");

      if (!adminUser) {
        return next(new ErrorHandler(404, "Usuário não autorizado"));
      }

      const isPasswordMatched = await adminUser.comparePassword(password);

      if (!isPasswordMatched) {
        return next(new ErrorHandler(400, "Invalid password"));
      }

      sendToken(adminUser, 200, res);
    } catch (error: any) {
      return next(new ErrorHandler(500, error.message));
    }
  }
);
