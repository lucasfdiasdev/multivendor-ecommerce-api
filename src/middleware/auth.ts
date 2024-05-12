import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

import { IUserAdmin } from "../models/admin.model";
import { ErrorHandler } from "../utils/error-handler";
import { CatchAsyncError } from "./catch-async-error";

// declare global
declare global {
  namespace Express {
    interface Request {
      userAdmin?: IUserAdmin;
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

    next();
  }
);

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.userAdmin?.role || "")) {
      return next(
        new ErrorHandler(
          403,
          `Role: ${req.userAdmin?.role} is not allowed to access this resource`
        )
      );
    }
    next();
  };
};
